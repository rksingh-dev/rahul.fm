import { useState, useEffect } from 'react';
import { TrackCard } from './TrackCard';
import { Track, Playlist } from '@/pages/Index';

const YOUTUBE_API_KEYS = [
  'AIzaSyAecTrwCptOUDUtfcKd4_EEec92tts3jxU',
  'AIzaSyDlNlMEHHOU1TlB_frHBvhJlI24d92pzUU',
  'AIzaSyBbHep8gvopy9xgVxlTy653IllFP71Mvhc'
];

interface TrendingSectionProps {
  onPlayTrack: (track: Track) => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  playlists: Playlist[];
}

export const TrendingSection = ({ onPlayTrack, onAddToPlaylist, playlists }: TrendingSectionProps) => {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMusic();
  }, []);

  const fetchTrendingMusic = async () => {
    try {
      const queries = ['trending latest release music video 2025 '];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      let data = null;
      let success = false;
      for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
        const key = YOUTUBE_API_KEYS[i];
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=16&q=${encodeURIComponent(randomQuery)}&type=video&key=${key}&order=viewCount`
        );
        if (response.status === 403) {
          // Try next key
          continue;
        }
        data = await response.json();
        success = true;
        break;
      }
      if (success && data && data.items) {
        const tracks: Track[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title.replace(/[^ -]+/g, ''),
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          duration: '3:45',
          videoId: item.id.videoId
        }));
        setTrendingTracks(tracks);
      }
    } catch (error) {
      console.error('Error fetching trending music:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in animate-slide-in-up">
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Good evening</h1>
          <p className="text-gray-400">Discover trending music and your favorites</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {trendingTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={() => onPlayTrack(track)}
                onAddToPlaylist={onAddToPlaylist}
                playlists={playlists}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
