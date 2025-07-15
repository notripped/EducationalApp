# Educational App (AI-Powered Video Learning)

This project is an educational mobile application designed to enhance learning through videos by providing AI-powered insights and mapping video content to NCERT concepts. It consists of a React Native frontend and a Node.js backend that acts as an API proxy for YouTube and a RAG (Retrieval Augmented Generation) system powered by the Google Gemini API.

## 🌟 Features

* **Video Browse:** Explore popular educational videos and browse content from specific channels (e.g., Veritasium, Kurzgesagt, Physics Wallah).
* **Video Playback:** Seamless playback of selected YouTube videos within the app.
* **AI-Powered Concept Mapping:** Get relevant NCERT concepts and explanations linked to video content (currently based on hardcoded transcript segments for demonstration).
* **User-Friendly Interface:** Intuitive navigation for an engaging learning experience.

## 🚀 Technologies Used

### Frontend (Mobile Application)

* **React Native:** For cross-platform mobile development (Android & iOS).
* **React Navigation:** For managing app navigation.
* **`react-native-video`:** For video playback.
* **`@react-navigation/native`**, **`@react-navigation/stack`**, **`@react-navigation/bottom-tabs`**: For robust navigation.

### Backend (API & RAG System)

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web framework for building the API.
* **Google Gemini API:** Powers the RAG system for mapping content to NCERT concepts.
* **YouTube Data API v3:** Used to fetch video information (popular videos, channel videos, video details).
* **`node-fetch`:** For making HTTP requests to external APIs.
* **`dotenv`:** For managing environment variables (API keys).

## ⚙️ Architecture / How it Works

The application follows a client-server architecture:

1.  **Frontend (React Native):**
    * Displays video lists and playback UI.
    * Sends requests for video data (popular, channel-specific) to the **Backend Proxy**.
    * Sends a "transcript segment" (currently hardcoded for demonstration) along with the video ID to the **Backend RAG System** when a user interacts with a video (e.g., to get concepts).

2.  **Backend (Node.js/Express.js):**
    * **YouTube API Proxy:** Receives requests from the frontend for video data, securely makes calls to the official YouTube Data API (using a hidden API key), processes the responses, and sends relevant video data back to the frontend.
    * **RAG System:** Receives transcript segments/queries from the frontend. It then uses the Google Gemini API to process these inputs and generate/retrieve relevant NCERT concepts and their explanations, which are then sent back to the frontend.
    * **Environment Variables:** Securely stores sensitive API keys (Google Gemini API Key, YouTube Data API Key) using `.env` files.

## 🛠️ Setup and Installation

Follow these steps to get the app running on your local machine.

### Prerequisites

* Git
* Node.js (LTS version recommended) & npm (or Yarn)
* Android Studio (for Android Emulator) or Xcode (for iOS Simulator)
* A Google Cloud Project with:
    * **Google Gemini API** enabled.
    * **YouTube Data API v3** enabled.
    * API Keys generated for both services.

### 1. Clone the Repository

Open your terminal or command prompt and clone the monorepo:

```bash
git clone [https://github.com/notripped/EducationalApp.git](https://github.com/your-username/EducationalAppNew.git)

# Educational App

A React Native educational application that leverages Google Gemini AI and YouTube Data API to provide interactive learning experiences with video content and concept extraction.

## Features

- **Video Browsing**: Browse popular educational videos through a proxy backend
- **Channel Exploration**: Explore content from specific educational channels
- **Video Player**: Built-in video player for seamless learning experience
- **Concept Extraction**: AI-powered NCERT concept extraction from video content
- **Cross-Platform**: Supports both Android and iOS platforms

## Tech Stack

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Google Gemini AI**: For concept extraction and AI features
- **YouTube Data API v3**: For fetching video content

### Frontend
- **React Native**: Cross-platform mobile development
- **Metro Bundler**: React Native development server
- **JavaScript/TypeScript**: Programming languages

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Google Gemini API Key**
- **YouTube Data API v3 Key**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EducationalAppNew
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd educational-backend
npm install
```

#### Configure Environment Variables (`.env`)

Create a file named `.env` in the `educational-backend` directory:

```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
YOUTUBE_API_KEY=YOUR_YOUTUBE_DATA_API_KEY_HERE
```

**API Keys Setup:**
- `YOUR_GEMINI_API_KEY_HERE`: Replace with your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `YOUR_YOUTUBE_DATA_API_KEY_HERE`: Replace with your YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)

#### Run the Backend

Start the Node.js backend server:

```bash
npm start
```

The server should start on port `3001` (e.g., `http://localhost:3001`). Keep this terminal window open.

### 3. Frontend Setup

Open a **new** terminal or command prompt window. Navigate to the frontend directory:

```bash
cd .. # Go back to the root EducationalAppNew folder first
cd educational-frontend
npm install
```

#### Configure API Base URL (`api.js`)

Open `educational-frontend/api.js`. Ensure the `API_BASE_URL` is correctly set for your emulator/device:

```javascript
const API_BASE_URL = 'http://10.0.2.2:3001/api'; // For Android Emulator
// const API_BASE_URL = 'http://localhost:3001/api'; // For iOS Simulator or Web
```

**Platform-specific URLs:**
- **Android Emulator**: Use `http://10.0.2.2:3001/api`
- **iOS Simulator**: Use `http://localhost:3001/api`

#### Run the Frontend

Start the React Native development server (Metro Bundler):

```bash
npm start
```

Once the Metro Bundler is running, you can launch the app on your emulator or device:
- **Android Emulator**: Press `a` in the Metro Bundler terminal
- **iOS Simulator**: Press `i` in the Metro Bundler terminal

## Project Structure

```
EducationalAppNew/
├── educational-backend/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── server.js
├── educational-frontend/
│   ├── node_modules/
│   ├── api.js
│   ├── package.json
│   └── src/
└── README.md
```

## Usage

### 🎥 Browse Videos
The home screen displays popular educational videos fetched via your backend proxy. Scroll horizontally to discover more content.

### 📚 Explore Channels
Different sections showcase videos from specific educational channels, organized for easy navigation.

### ▶️ Watch Videos
Tap on any video thumbnail to open the integrated video player screen for an immersive learning experience.

### 🧠 Get Concepts
On the video player screen, the app extracts and displays relevant NCERT concepts related to the video content using AI-powered analysis.

## Development

### Running on Different Platforms

#### Android
1. Ensure Android Studio is installed and configured
2. Start Android emulator or connect physical device
3. Run `npm start` in the frontend directory
4. Press `a` when prompted

#### iOS (macOS only)
1. Ensure Xcode is installed
2. Start iOS Simulator
3. Run `npm start` in the frontend directory
4. Press `i` when prompted

### Debugging

- **Metro Bundler**: Check the terminal running `npm start` for any JavaScript errors
- **Backend Logs**: Monitor the backend terminal for API errors
- **Device/Emulator**: Use React Native debugging tools and device logs

## Environment Variables

### Backend (`.env`)
```env
GOOGLE_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
PORT=3001
```

### Frontend (`api.js`)
```javascript
// Configure based on your development environment
const API_BASE_URL = 'http://10.0.2.2:3001/api'; // Android
// const API_BASE_URL = 'http://localhost:3001/api'; // iOS
```

## API Endpoints

The backend provides the following endpoints:
- `GET /api/videos` - Fetch popular videos
- `GET /api/channels` - Get channel information
- `POST /api/concepts` - Extract concepts from video content

## Troubleshooting

### Common Issues

1. **Metro Bundler not starting**: Clear cache with `npx react-native start --reset-cache`
2. **API connection failed**: Verify backend is running and API_BASE_URL is correct
3. **Android emulator issues**: Ensure `http://10.0.2.2:3001/api` is used
4. **iOS simulator issues**: Ensure `http://localhost:3001/api` is used

### Error Logs
- Check Metro Bundler terminal for JavaScript errors
- Monitor backend terminal for API request errors
- Use device developer tools for runtime debugging

## Contributing

Contributions are welcome! If you find a bug or have an idea for a new feature:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for concept extraction capabilities
- YouTube Data API for video content access
- React Native community for excellent documentation and support
cd EducationalAppNew
