import { TrendingSection } from './TrendingSection';
import { SearchResults } from './SearchResults';
import { Track, Playlist } from '@/pages/Index';

interface MainContentProps {
  searchResults: Track[];
  onPlayTrack: (track: Track) => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  playlists: Playlist[];
  isSearching: boolean;
}

export const MainContent = ({ 
  searchResults, 
  onPlayTrack, 
  onAddToPlaylist, 
  playlists,
  isSearching 
}: MainContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-black animate-fade-in">
      {searchResults.length > 0 ? (
        <SearchResults 
          results={searchResults}
          onPlayTrack={onPlayTrack}
          onAddToPlaylist={onAddToPlaylist}
          playlists={playlists}
        />
      ) : (
        !isSearching && (
          <TrendingSection 
            onPlayTrack={onPlayTrack}
            onAddToPlaylist={onAddToPlaylist}
            playlists={playlists}
          />
        )
      )}
      
      {isSearching && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};
