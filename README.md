# AI Interview Assistant

A React-based web application that simulates a technical interview using AI. The application features real-time voice recognition, webcam integration, and AI-powered interview questions using Google's Gemini API.

## Features

- 🎥 Webcam integration for video recording
- 🎤 Real-time voice recognition and transcription
- 🤖 AI-powered interview questions using Gemini API
- 💬 Chat-like interface for the interview conversation
- ⏱️ Interview timer
- 🎯 Technical interview focus (React-related questions)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Google Gemini API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interview-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm start
```

## Usage

1. Click the "Start Interview" button to begin a new interview session.
2. Allow camera and microphone access when prompted.
3. The AI interviewer will ask React-related questions.
4. Use the voice recognition feature to answer questions.
5. Click "Submit Answer" when you're ready to send your response.
6. The AI will provide feedback and ask follow-up questions.
7. Click "End Interview" when you want to finish the session.

## Technologies Used

- React
- TypeScript
- Material-UI
- react-webcam
- Web Speech API
- Google Gemini API

## Browser Support

The application requires a modern browser with support for:
- WebRTC (for camera access)
- Web Speech API
- Modern JavaScript features

## Security Notes

- The application requires camera and microphone permissions
- All API calls are made directly from the client
- The Gemini API key is stored in the environment variables
- No data is stored permanently

## License

MIT 