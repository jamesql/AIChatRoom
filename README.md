# AI Chat Room Game

## Description
This is a real-time chat room game where players must determine which participant is an AI. The system is built using TypeScript with a React (Next.js) frontend, an Express API server, a WebSocket server, and a Redis server for state management and pub/sub.

## Features
- Real-time chat using WebSockets
- AI-powered chatbot disguised as a human player
- Multiplayer support with role-based interactions
- Redis caching for fast game state management
- Secure authentication with JWT

## Tech Stack
- **Frontend:** React with Next.js
- **Backend API:** Express.js
- **WebSockets:** ws (npm package)
- **Database & State Management:** Redis

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/jamesql/AIChatRoom.git
   cd ai-chat-room-game
   ```
2. Install dependencies in all directories:
   ```sh
   npm install
   ```
3. Start Redis server (if not running):
   ```sh
   redis-server
   ```
4. Start the API and WebSocket server:
   ```sh
   ts-node ./API
   ts-node ./WS
   ```
5. Start react server:
   ```sh
   npx next dev
   ```
5. Open the app in your browser:
   ```sh
   http://localhost:3000
   ```

## API Endpoints
- `POST /api/login` – Authenticate user
- `POST /api/start-game` – Start a new game session
- `GET /api/game-state` – Retrieve current game state
- `POST /api/submit-guess` – Submit a guess for the AI player

## License
This project is licensed under the GPU-3 License.
