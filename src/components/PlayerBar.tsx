import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Track } from '@/pages/Index';
import { YouTubePlayerComponent } from './YouTubePlayer';

interface PlayerBarProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStateChange?: (isPlaying: boolean) => void;
  onNextTrack?: () => void;
}

export const PlayerBar = ({ currentTrack, isPlaying, onTogglePlay, onStateChange, onNextTrack }: PlayerBarProps) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    setCurrentTime(newTime);
    setProgress(value[0]);
    setPendingSeek(newTime);
  };

  const handleProgress = (current: number, total: number) => {
    setCurrentTime(current);
    setDuration(total);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handlePlayerReady = () => {
    console.log('Player ready, enabling controls');
    setPlayerReady(true);
  };

  const handleYouTubeStateChange = (state: number) => {
    if (onStateChange) {
      if (state === 1) onStateChange(true);
      else if (state === 2 || state === 0 || state === 3 || state === 5) onStateChange(false);
    }
  };

  return (
    <>
      <YouTubePlayerComponent
        videoId={currentTrack.videoId}
        isPlaying={isPlaying}
        onReady={handlePlayerReady}
        onProgress={handleProgress}
        seekTo={pendingSeek !== null ? pendingSeek : undefined}
        onStateChange={handleYouTubeStateChange}
      />
      
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 animate-fade-in animate-slide-in-up">
        <div className="flex items-center justify-center max-w-full">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 min-w-0">
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate text-sm">{currentTrack.title}</h4>
              <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8 w-8 p-0">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                className="rounded-full bg-white text-black hover:bg-black-200 h-10 w-10 p-0"
                onClick={onTogglePlay}
                disabled={!playerReady}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8 w-8 p-0" onClick={onNextTrack} disabled={!playerReady}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(currentTime)}</span>
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
