// educational-backend/models/Video.js
const mongoose = require('mongoose');

// Define the schema for your Video documents
const VideoSchema = new mongoose.Schema({
    // A unique identifier for the video (e.g., YouTube video ID)
    videoId: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate video entries by ID
        trim: true    // Removes whitespace from beginning/end
    },
    // The title of the video
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Duration of the video in seconds (optional)
    duration: {
        type: Number,
        min: 0, // Duration cannot be negative
        default: 0 // Default to 0 if not provided
    },
    // URL for the video's thumbnail image (optional)
    thumbnailUrl: {
        type: String,
        trim: true
    },
    // The full transcript of the video content
    transcript: {
        type: String,
        required: true
    },
    // Array to store extracted concepts related to the video
    concepts: [{
        concept: {     // The name of the concept (e.g., "Photosynthesis")
            type: String,
            required: true,
            trim: true
        },
        explanation: { // A brief explanation of the concept
            type: String,
            required: true,
            trim: true
        },
        reference: {   // The source from NCERT (e.g., "NCERT Class 10 Science, Chapter 3")
            type: String,
            required: true,
            trim: true
        }
    }],
    // Timestamp for when the video entry was created/uploaded
    uploadedAt: {
        type: Date,
        default: Date.now // Automatically sets the current date/time on creation
    }
}, {
    timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

// Create the Mongoose Model from the schema
// 'Video' will be the name of the collection in MongoDB (pluralized to 'videos')
const Video = mongoose.model('Video', VideoSchema);

// Export the model for use in other parts of your application (e.g., routes)
module.exports = Video;