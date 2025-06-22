import { useState } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
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
      </nav>
    </div>
  );
};
