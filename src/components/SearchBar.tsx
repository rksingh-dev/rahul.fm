import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Track } from '@/pages/Index';

const YOUTUBE_API_KEYS = [
  'AIzaSyAecTrwCptOUDUtfcKd4_EEec92tts3jxU',
  'AIzaSyDlNlMEHHOU1TlB_frHBvhJlI24d92pzUU',
  'AIzaSyBbHep8gvopy9xgVxlTy653IllFP71Mvhc',
];

interface SearchBarProps {
  onSearch: (results: Track[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

export const SearchBar = ({ onSearch, isSearching, setIsSearching }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const searchMusic = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      let data = null;
      let success = false;
      for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
        const key = YOUTUBE_API_KEYS[i];
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery + ' music')}&type=video&key=${key}`
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
          title: item.snippet.title.replace(/[^-\u007F]+/g, ''),
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          duration: '3:45', // YouTube API v3 doesn't provide duration in search
          videoId: item.id.videoId
        }));
        onSearch(tracks);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMusic(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search for music..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 transition-all"
        disabled={isSearching}
      />
    </form>
  );
};
