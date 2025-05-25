"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User, Activity } from 'lucide-react';

import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';
import SoundwaveVisualization from './SoundwaveVisualization';

// Add proper type for conversation entries
interface ConversationEntry {
  role: string;
  content: string;
}

// Define a type for Vapi messages
interface VapiMessage {
  type: string;
  conversation?: ConversationEntry[];
  [key: string]: unknown;
}

// Add a ref type for external access to component methods
export interface VapiCallRefType {
  injectImageDescription: (description: string) => Promise<void>;
  isCallActive: () => boolean;
}

interface VapiCallProps {
  onTranscriptUpdate?: (text: string) => void,
  onCallEnd?: () => void,
  onCallStart?: () => void,
}

const VapiCall = forwardRef<VapiCallRefType, VapiCallProps>(({ 
  onTranscriptUpdate, 
  onCallEnd,
  onCallStart 
}, ref) => {
  const vapiClientRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Ready to start call');
  const isInitializedRef = useRef(false);
  
  // Add new state for display mode and volume
  const [displayMode, setDisplayMode] = useState<'avatar' | 'soundwave'>('soundwave');
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    injectImageDescription: async (description: string) => {
      if (!description || !vapiClientRef.current || !isCallActive) {
        console.log("Cannot inject: description, client, or call inactive");
        return;
      }
      
      try {
        // Use add-message instead of say command
        vapiClientRef.current.send({
          type: "add-message" as const,
          message: {
            role: "user",
            content: `I'm looking at an image and here's what it shows: ${description}`
          }
        });
        
        // Make sure microphone is unmuted
        setTimeout(() => {
          try {
            if (vapiClientRef.current) {
              // Force reconnect the microphone
              vapiClientRef.current.setMuted(true);
              setTimeout(() => {
                if (vapiClientRef.current) {
                  vapiClientRef.current.setMuted(false);
                  setIsMuted(false);
                  console.log("Microphone reconnected and unmuted");
                }
              }, 100);
            }
          } catch (error) {
            console.error("Error restoring microphone:", error);
          }
        }, 500);
      } catch (error) {
        console.error('Failed to inject image description:', error);
      }
    },
    isCallActive: () => isCallActive
  }));

  // Initialize Vapi client - only once on mount
  useEffect(() => {
    // Skip if already initialized
    if (isInitializedRef.current) return;
    
    if (typeof window !== 'undefined') {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (apiKey) {
        try {
          console.log("Initializing Vapi client");
          const client = new Vapi(apiKey);
          vapiClientRef.current = client;
          isInitializedRef.current = true;
          
          // Set up event handlers in a separate useEffect
        } catch (e) {
          console.error("Failed to initialize Vapi client:", e);
        }
      }
    }

    // Cleanup function - only on unmount
    return () => {
      if (vapiClientRef.current) {
        try {
          console.log("Cleaning up Vapi client on unmount");
          vapiClientRef.current.stop();
          vapiClientRef.current = null;
          isInitializedRef.current = false;
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, []); // Empty deps means this only runs on mount/unmount

  // Set up event handlers (can be re-run safely)
  useEffect(() => {
    if (!vapiClientRef.current) return;
    
    // Handler functions
    const handleCallStart = () => {
      setCallStatus('Call connected');
      setIsCallActive(true);
    };
    
    const handleCallEnd = () => {
      setCallStatus('Call ended');
      setIsCallActive(false);
      setIsSpeaking(false);
      setVolumeLevel(0);
      
      // Call the onCallEnd prop if provided
      if (onCallEnd) {
        onCallEnd();
      }
    };
    
    const handleSpeechStart = () => {
      // Don't change status text, just set speaking state
      setIsSpeaking(true);
    };
    
    const handleSpeechEnd = () => {
      // Don't change status text, just set speaking state
      setIsSpeaking(false);
    };
    
    // Add volume level handler
    const handleVolumeLevel = (volume: number) => {
      setVolumeLevel(volume);
    };
    
    const handleMessage = (msg: VapiMessage) => {
      console.log("Vapi message received:", msg);
      
      if (msg && typeof msg === 'object') {
        // Handle conversation updates which contain the transcript
        if (msg.type === 'conversation-update' && Array.isArray(msg.conversation)) {
          // Filter out system messages and only keep user/assistant exchanges
          const filteredConversation = msg.conversation
            .filter((entry: ConversationEntry) => entry.role !== 'system')
            .map((entry: ConversationEntry) => `${entry.role}: ${entry.content}`)
            .join('\n\n');
          
          // Only pass to parent component if callback exists
          if (onTranscriptUpdate) {
            onTranscriptUpdate(filteredConversation);
          }
        }
      }
    };
    
    const handleError = () => {
      setCallStatus('Error occurred');
      setIsCallActive(false);
      setIsSpeaking(false);
      setVolumeLevel(0);
    };
    
    // Add event listeners
    const client = vapiClientRef.current;
    client.on('call-start', handleCallStart);
    client.on('call-end', handleCallEnd);
    client.on('speech-start', handleSpeechStart);
    client.on('speech-end', handleSpeechEnd);
    client.on('volume-level', handleVolumeLevel);
    client.on('message', handleMessage);
    client.on('error', handleError);
    
    // Return cleanup that doesn't destroy the client
    return () => {
      if (client) {
        // Only remove event listeners, don't destroy client
        if (typeof client.off === 'function') {
          client.off('call-start', handleCallStart);
          client.off('call-end', handleCallEnd);
          client.off('speech-start', handleSpeechStart);
          client.off('speech-end', handleSpeechEnd);
          client.off('volume-level', handleVolumeLevel);
          client.off('message', handleMessage);
          client.off('error', handleError);
        }
      }
    };
  }, [onCallEnd, onTranscriptUpdate]);

  // Start call function
  const handleStartCall = async () => {
    if (!vapiClientRef.current) {
      setCallStatus('Client not initialized');
      return;
    }
    
    // Call the onCallStart callback
    if (onCallStart) {
      onCallStart();
    }
    
    setIsCallActive(true);
    setCallStatus('Connecting...');
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      setCallStatus('Assistant ID not configured');
      setIsCallActive(false);
      return;
    }
    
    try {
      await vapiClientRef.current.start(assistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus('Failed to start call');
      setIsCallActive(false);
    }
  };

  // Stop call function
  const handleStopCall = () => {
    if (!vapiClientRef.current) return;
    
    try {
      vapiClientRef.current.stop();
      
      // Force UI update
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallStatus('Call ended');
      
      // Call the onCallEnd prop if provided
      if (onCallEnd) {
        onCallEnd();
      }
    } catch (error) {
      console.error("Error stopping call:", error);
    }
  };

  // Toggle mute function
  const handleToggleMute = () => {
    if (!vapiClientRef.current) return;
    
    try {
      vapiClientRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } catch {
      // Silent catch
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Display Container */}
      <div className="relative bg-[#14152A] rounded-2xl overflow-hidden shadow-inner border border-[#2E2D47] mb-3">
        {/* Status indicator as a subtle badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center bg-[#14152A]/70 backdrop-blur-sm py-1 px-2 rounded-full border border-[#2E2D47]">
          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            isCallActive ? (isSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-[#00F5A0]') : 'bg-gray-500'
          }`}></div>
          <p className="text-xs text-gray-300">{callStatus}</p>
        </div>
        
        {/* Display Mode Toggle - Floating in top-right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-[#14152A]/80 backdrop-blur-sm rounded-lg p-0.5 border border-[#2E2D47]/50">
            <button
              onClick={() => setDisplayMode('avatar')}
              className={`p-1.5 rounded-md transition-all ${
                displayMode === 'avatar'
                  ? 'bg-[#00F5A0]/20 text-[#00F5A0]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Avatar View"
            >
              <User className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('soundwave')}
              className={`p-1.5 rounded-md transition-all ${
                displayMode === 'soundwave'
                  ? 'bg-[#00F5A0]/20 text-[#00F5A0]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Soundwave View"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Content container */}
        <div className="h-[320px] w-full">
          {displayMode === 'avatar' ? (
            <div className="relative h-full w-full flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-[#1C1D2B]/30 backdrop-blur-sm"></div>
              <Avatar3D isSpeaking={isSpeaking} />
              
              {/* Subtle glow effect when speaking */}
              {isSpeaking && (
                <div className="absolute inset-0 bg-gradient-radial from-[#00F5A0]/5 to-transparent opacity-70 pointer-events-none"></div>
              )}
            </div>
          ) : (
            <SoundwaveVisualization 
              isSpeaking={isSpeaking} 
              volumeLevel={volumeLevel}
              isCallActive={isCallActive}
            />
          )}
        </div>
      </div>
      
      {/* Control buttons with improved proportions and layout */}
      <div className="flex justify-center items-center space-x-3">
        {!isCallActive ? (
          <button
            onClick={handleStartCall}
            className="bg-[#00F5A0] text-[#14152A] hover:bg-[#00E1C7] transition-all rounded-md shadow-sm flex items-center justify-center h-9 px-4 font-medium text-xs"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            <span>Start Call</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleToggleMute}
              className={`h-9 px-3 rounded-md flex items-center justify-center transition-colors ${
                isMuted 
                  ? 'bg-[#1C1D2B] text-gray-400 border border-gray-700' 
                  : 'bg-[#1C1D2B] text-[#00F5A0] border border-[#00F5A0]/30 hover:bg-[#1C1D2B]/80'
              }`}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs">Unmute</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs">Mute</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleStopCall}
              className="h-9 px-4 bg-red-500/90 hover:bg-red-600 text-white transition-colors rounded-md shadow-sm flex items-center justify-center"
            >
              <PhoneOff className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">End Call</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
});

VapiCall.displayName = "VapiCall";

export default VapiCall;
