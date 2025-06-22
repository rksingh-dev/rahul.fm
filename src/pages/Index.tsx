import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Sidebar } from '@/components/Sidebar';
import { PlayerBar } from '@/components/PlayerBar';
import { MainContent } from '@/components/MainContent';
import { useToast } from '@/hooks/use-toast';
import { fetchRecommendedTracksBySearch } from '@/lib/utils';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  thumbnail?: string;
}

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Initialize with some default playlists
  useEffect(() => {
    setPlaylists([
      {
        id: '1',
        name: 'Liked Songs',
        tracks: [],
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      },
      {
        id: '2',
        name: 'Recently Played',
        tracks: [],
        thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'
      }
    ]);
  }, []);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // toast({
    //   title: "Now Playing",
    //   description: `${track.title} by ${track.artist}`,
    // });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));
    toast({
      title: "Added to Playlist",
      description: `${track.title} added successfully`,
    });
  };

  const handleNextTrack = async () => {
    if (!currentTrack) return;
    const recommendations = await fetchRecommendedTracksBySearch(currentTrack.title, currentTrack.artist);
    // Avoid picking the same track as current
    const nextTrack = recommendations.find(track => track.videoId !== currentTrack.videoId);
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    } else {
      toast({
        title: 'No recommendations found',
        description: 'Could not find a recommended track for this song.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Search */}
          <header className="p-6 bg-black border-b border-black">
            <SearchBar 
              onSearch={setSearchResults}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
            />
          </header>

          {/* Main Content Area */}
          <MainContent 
            searchResults={searchResults}
            onPlayTrack={playTrack}
            onAddToPlaylist={addToPlaylist}
            playlists={playlists}
            isSearching={isSearching}
          />
        </div>
      </div>

      {/* Player Bar */}
      {currentTrack && (
        <PlayerBar 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlayPause}
          onNextTrack={handleNextTrack}
        />
      )}
    </div>
  );
};

export default Index;
