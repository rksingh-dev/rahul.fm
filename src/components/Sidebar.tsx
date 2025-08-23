import { useState } from 'react';
import { Home, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleStartJam = () => {
    // Generate a random room ID
    const roomId = Math.random().toString(36).substring(2, 15);
    navigate(`/jam/${roomId}`);
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <a href="/" className="text-2xl font-bold text-white cursor-pointer block" style={{ textDecoration: 'none' }}>
          RahulVerse
        </a>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-black"
          onClick={() => window.location.href = '/'}
        >
          <Home className="mr-3 h-4 w-4" />
          Home
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-black"
          onClick={handleStartJam}
        >
          <Music className="mr-3 h-4 w-4" />
          Start Jam
        </Button>
      </nav>
    </div>
  );
};
