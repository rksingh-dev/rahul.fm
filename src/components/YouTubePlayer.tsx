import { useEffect, useRef } from 'react';
import YouTubePlayer from 'youtube-player';

interface YouTubePlayerComponentProps {
  videoId: string;
  isPlaying: boolean;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  seekTo?: number;
}

export const YouTubePlayerComponent = ({ 
  videoId, 
  isPlaying, 
  onReady, 
  onStateChange,
  onProgress,
  seekTo
}: YouTubePlayerComponentProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (containerRef.current && videoId) {
      console.log('Creating YouTube player for video:', videoId);
      
      // Clear any existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Destroy existing player first
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.log('Error destroying previous player:', error);
        }
      }
      
      // Create YouTube player
      playerRef.current = YouTubePlayer(containerRef.current, {
        videoId,
        width: 560,
        height: 315,
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          playsinline: 1,
          start: 0,
        },
      });

      playerRef.current.on('ready', () => {
        console.log('YouTube player ready for video:', videoId);
        if (onReady) onReady();
        
        // Set up progress tracking
        progressIntervalRef.current = setInterval(async () => {
          if (playerRef.current) {
            try {
              const currentTime = await playerRef.current.getCurrentTime();
              const duration = await playerRef.current.getDuration();
              if (onProgress && duration > 0) {
                onProgress(currentTime, duration);
              }
            } catch (error) {
              // Silently handle errors during progress tracking
            }
          }
        }, 1000);
      });

      playerRef.current.on('stateChange', (event: any) => {
        console.log('Player state change:', event.data);
        if (onStateChange) onStateChange(event.data);
      });

      playerRef.current.on('error', (event: any) => {
        console.error('YouTube player error:', event.data);
      });

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (error) {
            console.log('Error destroying player on cleanup:', error);
          }
        }
      };
    }
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current) {
      console.log('Toggling playback:', isPlaying);
      if (isPlaying) {
        playerRef.current.playVideo().catch((error: any) => {
          console.error('Error playing video:', error);
        });
      } else {
        playerRef.current.pauseVideo().catch((error: any) => {
          console.error('Error pausing video:', error);
        });
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && typeof seekTo === 'number' && !isNaN(seekTo)) {
      playerRef.current.seekTo(seekTo, true);
    }
  }, [seekTo]);

  return (
    <div 
      ref={containerRef} 
      className="fixed bottom-20 right-4 w-80 h-48 bg-black border border-gray-600 rounded-lg overflow-hidden opacity-90"
      style={{ zIndex: 1000 }}
    />
  );
};
