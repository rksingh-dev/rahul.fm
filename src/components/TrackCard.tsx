import { useState } from 'react';
import { Play, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Track, Playlist } from '@/pages/Index';

interface TrackCardProps {
  track: Track;
  onPlay: () => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  playlists: Playlist[];
}

export const TrackCard = ({ track, onPlay, onAddToPlaylist, playlists }: TrackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={
        `bg-black rounded-lg p-4 hover:bg-black transition-all duration-300 group cursor-pointer border border-gray-800 
        transform-gpu will-change-transform will-change-opacity 
        hover:scale-105 hover:shadow-2xl 
        animate-fade-in`
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <img 
          src={track.thumbnail} 
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-95'}`} style={{ pointerEvents: isHovered ? 'auto' : 'none' }}>
          <Button
            size="sm"
            className="rounded-full bg-white hover:bg-black text-black h-12 w-12 p-0 shadow-lg transition-transform duration-300"
            onClick={onPlay}
          >
            <Play className="h-5 w-5 ml-1" fill="currentColor" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white truncate text-sm">{track.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-gray-700" align="end">
              {playlists.map((playlist) => (
                <DropdownMenuItem 
                  key={playlist.id}
                  onClick={() => onAddToPlaylist(playlist.id, track)}
                  className="text-white hover:bg-black cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to {playlist.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
