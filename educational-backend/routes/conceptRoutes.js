// educational-backend/routes/conceptRoutes.js
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const ingestData = require('../scripts/ingest_ncert_data.js'); // Assuming relative path

const { PromptTemplate } = require("@langchain/core/prompts");
const { Document } = require("@langchain/core/documents");
const path = require('path');

const router = express.Router();

let vectorStore;
let embeddingsInstance;
let llmModel;
let ragPromptTemplate;

async function initializeRAGComponents() {
    try {
        console.log("Initializing RAG components (using HNSWLib in-memory vector store)..."); // <-- CHANGED LOG
         console.log("DEBUG: GOOGLE_API_KEY loaded (check length):", process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.length + " characters" : "NOT FOUND / UNDEFINED");
        embeddingsInstance = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "embedding-001",
        });

        vectorStore = await ingestData();
        console.log("HNSWLib in-memory vector store is ready for queries."); // <-- CHANGED LOG

        llmModel = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "gemini-1.5-flash",
            temperature: 0.5,
            baseUrl: "https://generativelanguage.googleapis.com",
            apiVersion: "v1",
            generationConfig: {},
            safetySettings: [],
        });
        console.log("DEBUG: LLM Model configured as:", llmModel.model);     // <-- ADD THIS LINE
        console.log("DEBUG: LLM API Version configured as:", llmModel.apiVersion); // <-- ADD THIS LINE

        ragPromptTemplate = PromptTemplate.fromTemplate(
            `Given the following context from NCERT textbooks:
            ---
            {context}
            ---
            And the following video transcript segment:
            "{question}"

            Identify 3-5 distinct scientific/mathematical/historical concepts or topics from the NCERT context that are directly related to the video transcript segment. For each concept, provide:
            1. The concept name.
            2. A brief, 1-2 sentence explanation of the concept based on the NCERT context.
            3. A specific reference from the NCERT context (e.g., "NCERT Class 10 Science, Chapter 3, Page 50, Paragraph 2"). If specific page/paragraph not possible, provide chapter name.

            If no direct concepts are found, state "No direct concepts found based on the provided context."
            Provide the output as a JSON array of objects, like so:
            [
                {{
                    "concept": "Concept Name",
                    "explanation": "Brief explanation...",
                    "reference": "NCERT Class X Subject, Chapter Y, Page Z"
                }}
            ]
            `
        );
        console.log("RAG components initialized.");
    } catch (error) {
        console.error("Failed to initialize RAG components:", error);
        process.exit(1);
    }
}

initializeRAGComponents();

router.post('/map', async (req, res) => {
    console.log('DEBUG: Request received for /api/map');
    const { transcript } = req.body;

    if (!vectorStore || !embeddingsInstance || !llmModel || !ragPromptTemplate) {
        return res.status(503).json({ message: "AI mapping service not initialized. Please ensure the backend started correctly." });
    }
    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
        return res.status(400).json({ message: "Transcript segment is required for concept mapping." });
    }

    try {
        console.log("Mapping concepts for transcript:", transcript.substring(0, Math.min(transcript.length, 100)) + "...");

        console.log("DEBUG: Querying HNSWLib in-memory vector store..."); // <-- CHANGED LOG
        const relevantDocs = await vectorStore.similaritySearch(transcript, 5);
        console.log("DEBUG: HNSWLib in-memory vector store query results:", relevantDocs.length, "documents found."); // <-- CHANGED LOG

        let context = "";
        if (relevantDocs && relevantDocs.length > 0) {
            context = relevantDocs
                .map((doc, index) => {
                    const sourceRef = doc.metadata.source ? ` (Source: ${path.basename(doc.metadata.source)})` : '';
                    const pageRef = doc.metadata.pdf_numpages ? ` (Pages: ${doc.metadata.pdf_numpages})` : '';
                    return `Document ${index + 1}${sourceRef}${pageRef}:\n${doc.pageContent}`;
                })
                .join("\n\n---\n\n");
        } else {
            console.warn("No relevant documents found in HNSWLib in-memory vector store for the query."); // <-- CHANGED LOG
            context = "No relevant context found from NCERT textbooks.";
        }

        const formattedPrompt = await ragPromptTemplate.format({
            context: context,
            question: transcript
        });

        console.log("DEBUG: Invoking LLM with formatted prompt...");
        const llmResponse = await llmModel.invoke(formattedPrompt);
        console.log("Raw AI Response:", llmResponse.content);

let concepts = [];
        try {
            const llmContent = llmResponse.content;
            let jsonString = llmContent;

            // Use regex to extract JSON string from markdown code block if present
            const jsonMatch = llmContent.match(/```json\n([\s\S]*?)```/); // Regex to find content between ```json and ```
            if (jsonMatch && jsonMatch[1]) {
                jsonString = jsonMatch[1]; // If a match is found, use the captured group (the JSON content)
            } else {
                // If no markdown block is found, check for ``` (without json)
                const genericMatch = llmContent.match(/```\n([\s\S]*?)```/);
                if (genericMatch && genericMatch[1]) {
                    jsonString = genericMatch[1];
                }
                // Else, assume it's pure JSON or try to parse as is, which might fail
            }

            concepts = JSON.parse(jsonString); // Parse the extracted JSON string

            if (!Array.isArray(concepts) || !concepts.every(item => typeof item === 'object' && item !== null)) {
                throw new Error("LLM did not return a valid JSON array of objects.");
            }
        } catch (parseError) {
            console.error("Failed to parse LLM response as JSON:", parseError);
            // Include the raw LLM content in the error response for debugging
            return res.status(500).json({ message: "AI response could not be parsed. Raw response: " + llmResponse.content, error_details: parseError.message });
        }

        res.json(concepts);

    } catch (error) {
        console.error('Error in concept mapping:', error);
        res.status(500).json({ message: 'Failed to map concepts', error: error.message });
    }
});

module.exports = router;