import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, remove, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Track } from '@/pages/Index';

export interface JamParticipant {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface JamRoomState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  participants: JamParticipant[];
  createdAt: number;
  hostId: string;
}

export const useJamRoom = (roomId: string) => {
  const [roomState, setRoomState] = useState<JamRoomState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    participants: [],
    createdAt: Date.now(),
    hostId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to room changes in real-time
  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomState(data);
      } else {
        // Room doesn't exist, create it
        setRoomState({
          currentTrack: null,
          isPlaying: false,
          queue: [],
          participants: [],
          createdAt: Date.now(),
          hostId: ''
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error listening to room:', error);
      setError('Failed to connect to room');
      setIsLoading(false);
    });

    return () => {
      off(roomRef);
    };
  }, [roomId]);

  // Initialize room (called by host)
  const initializeRoom = useCallback(async (hostName: string) => {
    const hostId = `host-${Date.now()}`;
    const host: JamParticipant = {
      id: hostId,
      name: hostName,
      isHost: true,
      joinedAt: Date.now()
    };

    const initialRoomState: JamRoomState = {
      currentTrack: null,
      isPlaying: false,
      queue: [],
      participants: [host],
      createdAt: Date.now(),
      hostId
    };

    try {
      await set(ref(database, `rooms/${roomId}`), initialRoomState);
    } catch (error) {
      console.error('Error initializing room:', error);
      setError('Failed to create room');
    }
  }, [roomId]);

  // Join room
  const joinRoom = useCallback(async (participantName: string) => {
    const participantId = `participant-${Date.now()}`;
    const participant: JamParticipant = {
      id: participantId,
      name: participantName,
      isHost: false,
      joinedAt: Date.now()
    };

    try {
      const participantsRef = ref(database, `rooms/${roomId}/participants`);
      await push(participantsRef, participant);
      return participantId;
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room');
      return null;
    }
  }, [roomId]);

  // Leave room
  const leaveRoom = useCallback(async (participantId: string) => {
    try {
      const participantsRef = ref(database, `rooms/${roomId}/participants`);
      const snapshot = await onValue(participantsRef, (snapshot) => {
        const participants = snapshot.val();
        if (participants) {
          Object.keys(participants).forEach((key) => {
            if (participants[key].id === participantId) {
              remove(ref(database, `rooms/${roomId}/participants/${key}`));
            }
          });
        }
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }, [roomId]);

  // Add track to queue
  const addToQueue = useCallback(async (track: Track) => {
    try {
      const queueRef = ref(database, `rooms/${roomId}/queue`);
      await push(queueRef, track);
    } catch (error) {
      console.error('Error adding to queue:', error);
      setError('Failed to add track to queue');
    }
  }, [roomId]);

  // Remove track from queue
  const removeFromQueue = useCallback(async (index: number) => {
    try {
      const queueRef = ref(database, `rooms/${roomId}/queue`);
      const snapshot = await onValue(queueRef, (snapshot) => {
        const queue = snapshot.val();
        if (queue) {
          const keys = Object.keys(queue);
          if (keys[index]) {
            remove(ref(database, `rooms/${roomId}/queue/${keys[index]}`));
          }
        }
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  }, [roomId]);

  // Play track
  const playTrack = useCallback(async (track: Track) => {
    try {
      await set(ref(database, `rooms/${roomId}/currentTrack`), track);
      await set(ref(database, `rooms/${roomId}/isPlaying`), true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }, [roomId]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    try {
      await set(ref(database, `rooms/${roomId}/isPlaying`), !roomState.isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, [roomId, roomState.isPlaying]);

  // Play next track
  const playNextTrack = useCallback(async () => {
    try {
      const queueRef = ref(database, `rooms/${roomId}/queue`);
      const snapshot = await onValue(queueRef, (snapshot) => {
        const queue = snapshot.val();
        if (queue) {
          const keys = Object.keys(queue);
          if (keys.length > 0) {
            const nextTrack = queue[keys[0]];
            // Remove the first track from queue
            remove(ref(database, `rooms/${roomId}/queue/${keys[0]}`));
            // Play the next track
            set(ref(database, `rooms/${roomId}/currentTrack`), nextTrack);
            set(ref(database, `rooms/${roomId}/isPlaying`), true);
          }
        }
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error playing next track:', error);
    }
  }, [roomId]);

  return {
    roomState,
    isLoading,
    error,
    initializeRoom,
    joinRoom,
    leaveRoom,
    addToQueue,
    removeFromQueue,
    playTrack,
    togglePlayPause,
    playNextTrack
  };
};
