# RahulVerse - Music Streaming Platform

A modern music streaming platform built with React, TypeScript, and Tailwind CSS. Features include music search, playlist management, and collaborative jam sessions.

## Features

### 🎵 Core Features
- **Music Search**: Search and discover music from YouTube
- **Playlist Management**: Create and manage your playlists
- **Music Player**: Full-featured music player with play/pause and next track functionality
- **Responsive Design**: Beautiful, modern UI that works on all devices

### 🎸 Jam Room (New!)
- **Collaborative Listening**: Create rooms where multiple people can listen to music together
- **Room Sharing**: Generate shareable links for friends to join your jam session
- **Queue Management**: Add tracks to a shared queue that everyone can see
- **Real-time Updates**: See who's in the room and what's currently playing
- **Host Controls**: Room creator has special privileges for managing the session

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rahul.fm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Music Streaming
1. Use the search bar to find your favorite music
2. Click the play button on any track to start listening
3. Use the player bar at the bottom to control playback
4. Add tracks to your playlists using the dropdown menu

### Jam Room Sessions
1. Click "Start Jam" in the sidebar to create a new room
2. Share the generated link with friends
3. Search for music and add it to the shared queue
4. Everyone in the room can see what's playing and what's queued
5. The host can manage the queue and control playback

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **State Management**: React hooks
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── JamRoom.tsx     # Jam room functionality
│   ├── PlayerBar.tsx   # Music player controls
│   ├── SearchBar.tsx   # Music search interface
│   └── Sidebar.tsx     # Navigation sidebar
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube Music API for music data
- shadcn/ui for beautiful components
- Lucide React for icons
