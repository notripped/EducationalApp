// educational-frontend/api.js

// Base URL for your Node.js backend.
// Use 'http://10.0.2.2:3001/api' for Android emulator.
// Use 'http://localhost:3001/api' for iOS Simulator/Web.
const API_BASE_URL = 'http://10.0.2.2:3001/api';

// --- UPDATED: Functions to fetch video data from your Backend Proxy ---

/**
 * Fetches a list of popular videos from the backend proxy.
 * This will hit your Node.js backend's /api/youtube/popular endpoint.
 */
export const fetchRandomVideos = async () => {
  console.log('Frontend: Fetching random videos from backend proxy...');
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/popular`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend Proxy error (popular videos): ${response.status} - ${errorData.error || response.statusText}`);
    }
    const videos = await response.json();
    console.log('Frontend: Received popular videos from proxy:', videos.length);
    return videos; // Backend should return data in the format frontend expects
  } catch (error) {
    console.error('Error fetching random videos from proxy:', error);
    // Fallback to dummy data if backend call fails (optional, but good for dev)
return [
      { id: 'fLeufnY1AwU', title: 'UNITS AND MEASUREMENT in 1 Shot | FULL Chapter Coverage (Concepts + PYQs) | Class-11th Physics', thumbnail: 'https://www.youtube.com/watch?v=brf2OR_GEE0&list=PLv2CP3oLWiWSJLwZmeKlIsATeNnLiIbVv3', channelName: 'Physics Wallah - English' },
      { id: 'vv5aBiAzREk', title: 'WORK, ENERGY AND POWER in 1 Shot || FULL Chapter Coverage (Concepts+PYQs) || Class 11th Physics', thumbnail: 'https://www.youtube.com/watch?v=brf2OR_GEE0&list=PLv2CP3oLWiWSJLwZmeKlIsATeNnLiIbVv4', channelName: 'Physics Wallah - English' },
      { id: 'N_hDDngtdzM', title: 'FORCE AND LAWS OF MOTION in 1 Shot || FULL Chapter Coverage (Concepts+PYQs) || Class 11th Physics', thumbnail: 'https://www.youtube.com/watch?v=brf2OR_GEE0&list=PLv2CP3oLWiWSJLwZmeKlIsATeNnLiIbVv2', channelName: 'Physics Wallah - English' },
      { id: 'YkVZhoLQrMc', title: 'CHEMICAL BONDING in 1 Shot | FULL Chapter Coverage (Concepts+PYQs) | Class 11th Chemistry', thumbnail: 'https://www.youtube.com/watch?v=brf2OR_GEE0&list=PLv2CP3oLWiWSJLwZmeKlIsATeNnLiIbVv5', channelName: 'Physics Wallah - English' },
      { id: 'OSAu4rXK4GE', title: 'BIOLOGICAL CLASSIFICATION in 1 Shot | Full Chapter Coverage (Concepts + PYQs) | Class 11th Biology', thumbnail: 'https://www.youtube.com/watch?v=brf2OR_GEE0&list=PLv2CP3oLWiWSJLwZmeKlIsATeNnLiIbVv6', channelName: 'Physics Wallah - English' },
    ];
  }
};

/**
 * Fetches videos for a specific channel from the backend proxy.
 * This will hit your Node.js backend's /api/youtube/channel/:channelId/videos endpoint.
 */
export const fetchChannelVideos = async (channelId) => {
  console.log(`Frontend: Fetching videos for channel ${channelId} from backend proxy...`);
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/channel/${channelId}/videos`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend Proxy error (channel videos): ${response.status} - ${errorData.error || response.statusText}`);
    }
    const videos = await response.json();
    console.log(`Frontend: Received ${videos.length} videos for channel ${channelId} from proxy.`);
    return videos;
  } catch (error) {
    console.error(`Error fetching channel videos from proxy for ${channelId}:`, error);
    return []; // Return empty array on failure
  }
};

/**
 * Fetches details for a specific video from the backend proxy.
 * This will hit your Node.js backend's /api/youtube/video/:videoId/details endpoint.
 */
export const fetchVideoDetails = async (videoId) => {
  console.log(`Frontend: Fetching details for video ${videoId} from backend proxy...`);
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/video/${videoId}/details`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend Proxy error (video details): ${response.status} - ${errorData.error || response.statusText}`);
    }
    const details = await response.json();
    console.log(`Frontend: Received details for video ${videoId} from proxy.`);
    return details;
  } catch (error) {
    console.error(`Error fetching video details from proxy for ${videoId}:`, error);
    // Fallback to a basic object on failure
    return { id: videoId, title: 'Error Fetching Title', channelName: 'Error Channel' };
  }
};

/**
 * Fetches other videos from the same channel from the backend proxy.
 * NOTE: This function currently uses hardcoded channel IDs for demonstration.
 * In a real app, you might need a way to dynamically get the channelId from channelName
 * if it's not already available.
 */
export const fetchOtherChannelVideos = async (channelName) => {
  // Map channelName to a known channelId for the purpose of calling the backend proxy.
  // These IDs should match the ones you're using in HomeScreen.js for channel sections.
  let channelIdToFetch;
  if (channelName === 'Veritasium') {
    channelIdToFetch = 'UCRJO5GzE_k-0B_H_C3C_o7w'; // Veritasium's actual ID
  } else if (channelName === 'Kurzgesagt – In a Nutshell') {
    channelIdToFetch = 'UCsXVk37bltHxD1rDPwtNM8Q'; // Kurzgesagt's actual ID
  } else {
    // Fallback or handle unknown channel names
    console.warn(`Frontend: No known channel ID for channel name "${channelName}". Using default.`);
    channelIdToFetch = 'UC_x5XG1OV2P6wXH58JsK_gA'; // Example: A default popular science channel ID if others fail
  }

  console.log(`Frontend: Fetching other videos for channel "${channelName}" (ID: ${channelIdToFetch}) from backend proxy...`);
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/channel/${channelIdToFetch}/videos`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend Proxy error (other channel videos): ${response.status} - ${errorData.error || response.statusText}`);
    }
    const videos = await response.json();
    console.log(`Frontend: Received ${videos.length} other videos for channel ${channelName} from proxy.`);
    return videos;
  } catch (error) {
    console.error(`Error fetching other channel videos from proxy for ${channelName}:`, error);
    return [];
  }
};

// --- This function remains the same, as it already calls your backend's /map endpoint ---
/**
 * Fetches relevant NCERT concepts from your Node.js backend.
 * This will hit your Node.js backend's /api/map endpoint.
 *
 * IMPORTANT: The backend currently expects a 'transcript' string.
 * For real dynamic mapping, you would need to implement logic here
 * to extract a transcript segment from the videoId and currentTime.
 * For now, it uses a hardcoded transcript for demonstration.
 */
export const fetchNCERTConcepts = async (videoId, currentTime = null) => {
  console.log(`Frontend: Fetching NCERT concepts for video ${videoId} at time ${currentTime}`);

  // --- TEMPORARY: Hardcoded transcript for demonstration ---
  // In a real app, you'd fetch the actual transcript based on videoId and currentTime.
  let transcriptSegment = "Explain the fundamental concepts of work, energy, and power as defined in physics, including their units and different forms of energy.";
  if (videoId === 'vv5aBiAzREk') { // Example for the "WORK, ENERGY AND POWER" video
    transcriptSegment = "Define work, energy, and power in physics. What are their units and different forms of energy?";
  } else if (videoId === 'fLeufnY1AwU') { // Example for "UNITS AND MEASUREMENT" video
    transcriptSegment = "What are the fundamental and derived units in physics? Explain the process of dimensional analysis.";
  } else if (videoId === 'N_hDDngtdzM') { // Example for "FORCE AND LAWS OF MOTION" video
    transcriptSegment = "Discuss Newton's laws of motion and their implications on objects in motion and at rest.";
  } else {
    // Default transcript if videoId doesn't match a specific hardcoded one
    transcriptSegment = "Explain core physics concepts related to motion and forces.";
  }
  // --- END TEMPORARY ---

  try {
    const response = await fetch(`${API_BASE_URL}/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript: transcriptSegment }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend API error (NCERT concepts): ${response.status} - ${errorData.message || response.statusText}`);
    }

    const concepts = await response.json();
    console.log(`Frontend: Received ${concepts.length} NCERT concepts.`);

    // Map backend response to frontend's expected format
    return concepts.map(c => ({
      conceptTitle: c.concept,
      conceptText: c.explanation,
      // Attempt to parse reference string into grade, subject, chapter, section, page
      // This regex is a simple example and might need refinement for all your reference formats
      grade: c.reference.match(/Class (\d+)/)?.[1] || 'N/A',
      subject: c.reference.match(/(\w+), Chapter/)?.[1] || 'N/A',
      chapter: c.reference.match(/Chapter (\d+)/)?.[1] || 'N/A',
      section: c.reference.match(/Section (\w+)/)?.[1] || 'N/A', // Assuming "Section X" format
      page: c.reference.match(/Page (\d+)/)?.[1] || 'N/A',
      originalReference: c.reference // Keep original for debugging
    }));

  } catch (error) {
    console.error('Error fetching NCERT concepts:', error);
    return []; // Return empty array on failure
  }
};