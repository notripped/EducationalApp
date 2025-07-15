// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// --- NEW: GLOBAL DEBUG MIDDLEWARE ---
app.use((req, res, next) => {
    console.log(`GLOBAL DEBUG: Incoming Request - Method: ${req.method}, Path: ${req.originalUrl}, Body: ${JSON.stringify(req.body || {})}`);
    next(); // Pass control to the next middleware/route handler
});
// --- END GLOBAL DEBUG MIDDLEWARE ---

// Enable CORS for all routes (allows requests from your frontend)
app.use(cors());

// Enable JSON body parsing for all incoming requests
app.use(express.json());

// --- MongoDB Connection ---
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// --- Import and Use Your Routes ---
const videoRoutes = require('./routes/videoroutes');
const conceptRoutes = require('./routes/conceptRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
app.use('/api/video', videoRoutes);
app.use('/api', conceptRoutes); // This means /api/map will be accessible at http://localhost:3000/api/map
app.use('/api/youtube', youtubeRoutes); // All routes in youtubeRoutes will be prefixed with /api/youtube
// --- END NEW ---
// Basic test route
app.get('/', (req, res) => {
  res.send('Educational Backend is running!');
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err.stack);
    res.status(500).json({ message: 'An unexpected server error occurred.', error: err.message });
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});