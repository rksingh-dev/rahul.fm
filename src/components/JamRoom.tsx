import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Music, 
  Share2,
  X,
  Loader2
} from 'lucide-react';
import { Track } from '@/pages/Index';
import { useJamRoom } from '@/hooks/useJamRoom';

export const JamRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);

  const {
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
  } = useJamRoom(roomId!);

  // Initialize room state
  useEffect(() => {
    if (!roomId) return;

    // Check if user is joining or creating the room
    const urlParams = new URLSearchParams(window.location.search);
    const joining = urlParams.get('join');
    
    if (joining) {
      // Joining existing room
      setIsHost(false);
    } else {
      // Creating new room
      setIsHost(true);
      setShowJoinModal(false);
    }
  }, [roomId]);

  // Handle leaving room when component unmounts
  useEffect(() => {
    return () => {
      if (participantId) {
        leaveRoom(participantId);
      }
    };
  }, [participantId, leaveRoom]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleJoinRoom = async () => {
    if (!participantName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the jam",
        variant: "destructive"
      });
      return;
    }

    if (isHost) {
      // Initialize room as host
      await initializeRoom(participantName);
      setParticipantId('host-1'); // Host ID is set in the hook
    } else {
      // Join existing room
      const id = await joinRoom(participantName);
      if (id) {
        setParticipantId(id);
      }
    }
    
    setShowJoinModal(false);
    toast({
      title: "Joined Jam Room",
      description: `Welcome to the jam, ${participantName}!`,
    });
  };

  const copyRoomLink = async () => {
    const roomLink = `${window.location.origin}/jam/${roomId}?join=true`;
    try {
      await navigator.clipboard.writeText(roomLink);
      toast({
        title: "Link copied!",
        description: "Share this link with your friends to join the jam",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleAddToQueue = async (track: Track) => {
    await addToQueue(track);
    toast({
      title: "Added to Queue",
      description: `${track.title} added to the jam queue`,
    });
  };

  const handleRemoveFromQueue = async (index: number) => {
    await removeFromQueue(index);
  };

  const handlePlayTrack = async (track: Track) => {
    await playTrack(track);
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist}`,
    });
  };

  const handleTogglePlayPause = async () => {
    await togglePlayPause();
  };

  const handlePlayNextTrack = async () => {
    await playNextTrack();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Connecting to jam room...</p>
        </div>
      </div>
    );
  }

  if (showJoinModal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-96 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center">
              {isHost ? 'Create Jam Room' : 'Join Jam Room'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Name</label>
              <Input
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Button 
              onClick={handleJoinRoom}
              className="w-full"
            >
              {isHost ? 'Create Jam' : 'Join Jam'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert Firebase object to array for participants and queue
  const participants = roomState.participants ? Object.values(roomState.participants) : [];
  const queue = roomState.queue ? Object.values(roomState.queue) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="p-6 bg-black border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Jam Room</h1>
                <p className="text-gray-400">Room ID: {roomId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {participants.length} participants
                </Badge>
                <Button onClick={copyRoomLink} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <SearchBar 
              onSearch={setSearchResults}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
            />
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left side - Search Results */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add Music to Jam</h2>
              {searchResults.length > 0 && (
                <SearchResults 
                  results={searchResults}
                  onPlayTrack={handlePlayTrack}
                  onAddToPlaylist={() => {}} // Not used in jam room
                  showAddToPlaylist={false}
                  onAddToQueue={handleAddToQueue}
                />
              )}
              {!isSearching && searchResults.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Search for music to add to your jam session</p>
                </div>
              )}
            </div>

            {/* Right side - Queue and Participants */}
            <div className="w-80 bg-gray-900 p-6 overflow-y-auto">
              {/* Current Track */}
              {roomState.currentTrack && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Now Playing</h3>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={roomState.currentTrack.thumbnail} 
                          alt={roomState.currentTrack.title}
                          className="w-12 h-12 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{roomState.currentTrack.title}</p>
                          <p className="text-sm text-gray-400 truncate">{roomState.currentTrack.artist}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Queue */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Queue ({queue.length})</h3>
                {queue.length > 0 ? (
                  <div className="space-y-2">
                    {queue.map((track, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={track.thumbnail} 
                              alt={track.title}
                              className="w-10 h-10 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{track.title}</p>
                              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromQueue(index)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No tracks in queue</p>
                )}
              </div>

              {/* Participants */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Participants</h3>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2 p-2 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{participant.name}</span>
                      {participant.isHost && (
                        <Badge variant="outline" className="text-xs">Host</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      {roomState.currentTrack && (
        <PlayerBar 
          currentTrack={roomState.currentTrack}
          isPlaying={roomState.isPlaying}
          onTogglePlay={handleTogglePlayPause}
          onNextTrack={handlePlayNextTrack}
        />
      )}
    </div>
  );
};
