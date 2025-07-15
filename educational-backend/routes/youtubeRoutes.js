// educational-backend/routes/youtubeRoutes.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const fetch = require('node-fetch'); // Import node-fetch

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Middleware to check if YouTube API key is present
router.use((req, res, next) => {
    if (!YOUTUBE_API_KEY) {
        console.error("YOUTUBE_API_KEY is not set in .env!");
        return res.status(500).json({ error: "Server configuration error: YouTube API key missing." });
    }
    next();
});

// Helper function to format YouTube video data for frontend
const formatVideoData = (item) => {
    // Different YouTube API endpoints return slightly different structures
    const videoId = item.id.videoId || item.id; // For search vs videos.list

    return {
        id: videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelName: item.snippet.channelTitle,
        description: item.snippet.description, // Added for completeness if needed
        publishedAt: item.snippet.publishedAt,
    };
};

// Route to fetch popular videos
router.get('/popular', async (req, res) => {
    console.log('Backend: Fetching popular YouTube videos...');
    try {
        const response = await fetch(
            `${YOUTUBE_BASE_URL}/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=10&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('YouTube API error (popular):', response.status, errorText);
            return res.status(response.status).json({ error: `Failed to fetch popular videos: ${errorText}` });
        }

        const data = await response.json();
        const videos = data.items.map(formatVideoData);
        res.json(videos);
    } catch (error) {
        console.error('Error in /popular route:', error);
        res.status(500).json({ error: 'Internal server error while fetching popular videos.' });
    }
});

// Route to fetch videos for a specific channel
router.get('/channel/:channelId/videos', async (req, res) => {
    const { channelId } = req.params;
    console.log(`Backend: Fetching videos for channel ${channelId}...`);
    try {
        const response = await fetch(
            `${YOUTUBE_BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=10&type=video&key=${YOUTUBE_API_KEY}&order=date`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`YouTube API error (channel ${channelId}):`, response.status, errorText);
            return res.status(response.status).json({ error: `Failed to fetch channel videos: ${errorText}` });
        }

        const data = await response.json();
        const videos = data.items.map(formatVideoData);
        res.json(videos);
    } catch (error) {
        console.error(`Error in /channel/${channelId}/videos route:`, error);
        res.status(500).json({ error: 'Internal server error while fetching channel videos.' });
    }
});

// Route to fetch details for a specific video
router.get('/video/:videoId/details', async (req, res) => {
    const { videoId } = req.params;
    console.log(`Backend: Fetching details for video ${videoId}...`);
    try {
        const response = await fetch(
            `${YOUTUBE_BASE_URL}/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`YouTube API error (video ${videoId} details):`, response.status, errorText);
            return res.status(response.status).json({ error: `Failed to fetch video details: ${errorText}` });
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            res.json(formatVideoData(data.items[0]));
        } else {
            res.status(404).json({ error: 'Video details not found.' });
        }
    } catch (error) {
        console.error(`Error in /video/${videoId}/details route:`, error);
        res.status(500).json({ error: 'Internal server error while fetching video details.' });
    }
});


// NOTE: For 'fetchOtherChannelVideos', you might need a search route,
// or adapt the /channel/:channelId/videos if you have the channel ID.
// For now, it will be handled by the frontend calling the channel videos route.

module.exports = router;