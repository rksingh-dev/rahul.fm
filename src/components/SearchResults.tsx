import { TrackCard } from './TrackCard';
import { Track, Playlist } from '@/pages/Index';

interface SearchResultsProps {
  results: Track[];
  onPlayTrack: (track: Track) => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  playlists?: Playlist[];
  showAddToPlaylist?: boolean;
  onAddToQueue?: (track: Track) => void;
}

export const SearchResults = ({ 
  results, 
  onPlayTrack, 
  onAddToPlaylist, 
  playlists = [],
  showAddToPlaylist = true,
  onAddToQueue
}: SearchResultsProps) => {
  return (
    <div className="animate-fade-in animate-slide-in-up">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() => onPlayTrack(track)}
            onAddToPlaylist={onAddToPlaylist}
            playlists={playlists}
            showAddToPlaylist={showAddToPlaylist}
            onAddToQueue={onAddToQueue}
          />
        ))}
      </div>
    </div>
  );
};
