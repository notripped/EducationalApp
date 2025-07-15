// educational-backend/scripts/ingest_ncert_data.js
require('dotenv').config();
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");

const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');

const PDF_DIR = path.resolve(__dirname, '../data/ncert_pdfs');

async function ingestData() {
    console.log('Starting data ingestion into HNSWLib in-memory vector store...');

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "embedding-001",
    });

    const pdfFiles = fs.readdirSync(PDF_DIR).filter(file => file.endsWith('.pdf'));
    if (pdfFiles.length === 0) {
        console.error(`No PDF files found in ${PDF_DIR}. Please place your NCERT PDFs there.`);
        process.exit(1);
    }

    let allDocs = [];
    for (const file of pdfFiles) {
        const filePath = path.join(PDF_DIR, file);
        console.log(`Loading PDF: ${file}`);

        try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);

            let parsedPdfInfo = null;
            if (pdfData.info) {
                try {
                    parsedPdfInfo = JSON.stringify(pdfData.info);
                } catch (jsonError) {
                    console.warn(`Warning: Could not stringify pdfData.info for ${file}:`, jsonError);
                    parsedPdfInfo = null;
                }
            }
            const numPages = typeof pdfData.numpages === 'number' ? pdfData.numpages : null;

            allDocs.push({
                pageContent: pdfData.text,
                metadata: {
                    source: filePath,
                    pdf_numpages: numPages,
                    pdf_info: parsedPdfInfo
                },
            });
        } catch (error) {
            console.error(`Error processing PDF ${filePath}:`, error);
        }
    }
    console.log(`Loaded ${allDocs.length} documents from PDFs.`);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(allDocs);
    console.log(`Split into ${chunks.length} chunks.`);

    console.log('Creating HNSWLib vector store and adding documents...');
    const vectorStore = await HNSWLib.fromDocuments(
        chunks,
        embeddings
    );

    console.log('HNSWLib in-memory vector store populated.');
    console.log('Data ingestion complete!');

    return vectorStore;
}

module.exports = ingestData;

// --- ADD THESE LINES TO CALL THE FUNCTION WHEN RUN DIRECTLY ---
// Check if the script is being run directly (not imported as a module)
if (require.main === module) {
    ingestData().catch(console.error);
}
// --- END ADDITION ---