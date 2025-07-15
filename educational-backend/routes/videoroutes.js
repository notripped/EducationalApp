// educational-backend/routes/videoroutes.js
const express = require('express');
const router = express.Router();
const Video = require('../models/Video'); // Assuming you have a Video model in models/Video.js

// Middleware specific to this router (optional)
// router.use((req, res, next) => {
//   console.log('Video Routes middleware triggered!');
//   next();
// });

// GET all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        // Log the error for debugging, but don't expose too much detail to client
        console.error('Error fetching videos:', err);
        res.status(500).json({ message: 'Failed to retrieve videos.' });
    }
});

// POST a new video (example: saving basic video metadata)
// This is just a placeholder; actual video upload would be more complex
router.post('/upload', async (req, res) => {
    const { videoId, title, duration, thumbnailUrl, transcript } = req.body;

    if (!videoId || !title) {
        return res.status(400).json({ message: "Missing required video fields (videoId, title)." });
    }

    const newVideo = new Video({
        videoId,
        title,
        duration,
        thumbnailUrl,
        transcript,
        // concepts will be added later, perhaps via your /api/map endpoint logic
    });

    try {
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo); // 201 Created
    } catch (err) {
        // Handle duplicate videoId errors specifically if unique: true
        if (err.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: "Video with this ID already exists." });
        }
        console.error('Error uploading video:', err);
        res.status(500).json({ message: 'Failed to upload video.' });
    }
});

// GET a single video by ID
router.get('/:id', async (req, res) => {
    try {
        // Assuming 'id' here is the MongoDB _id. If it's videoId, use Video.findOne({ videoId: req.params.id })
        const video = await Video.findById(req.params.id);
        if (video == null) {
            return res.status(404).json({ message: 'Video not found.' });
        }
        res.json(video);
    } catch (err) {
        console.error('Error fetching video by ID:', err);
        res.status(500).json({ message: 'Failed to retrieve video.' });
    }
});

// You can add more routes here for updating, deleting, or searching videos

// IMPORTANT: This line is crucial! It exports the router for server.js to use.
module.exports = router;