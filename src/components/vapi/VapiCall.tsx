"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';

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
      
      // Call the onCallEnd prop if provided
      if (onCallEnd) {
        onCallEnd();
      }
    };
    
    const handleSpeechStart = () => {
      setCallStatus('Assistant is speaking');
      setIsSpeaking(true);
    };
    
    const handleSpeechEnd = () => {
      setCallStatus('Listening...');
      setIsSpeaking(false);
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
    };
    
    // Add event listeners
    const client = vapiClientRef.current;
    client.on('call-start', handleCallStart);
    client.on('call-end', handleCallEnd);
    client.on('speech-start', handleSpeechStart);
    client.on('speech-end', handleSpeechEnd);
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
    <div className="w-full bg-[#14152A] border border-[#2E2D47] rounded-xl overflow-hidden shadow-md">
      <div className="flex flex-col h-full">
        {/* Status indicator */}
        <div className="mb-4 flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isCallActive ? (isSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-[#00F5A0]') : 'bg-gray-500'
          }`}></div>
          <p className="text-sm text-gray-400">{callStatus}</p>
        </div>
        
        {/* Avatar container with fixed height */}
        <div className="flex-grow flex items-center justify-center h-[300px]">
          <Avatar3D isSpeaking={isSpeaking} />
        </div>
        
        {/* Control buttons */}
        <div className="mt-auto">
          {!isCallActive ? (
            <Button
              onClick={handleStartCall}
              className="w-full bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/90 transition-colors flex items-center justify-center py-3 font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Start Call
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={handleToggleMute}
                variant="outline"
                className={`flex-1 py-2 ${
                  isMuted 
                    ? 'bg-[#1C1D2B] text-gray-400 border-gray-500' 
                    : 'bg-[#1C1D2B] text-[#00F5A0] border-[#00F5A0]'
                } hover:bg-[#1C1D2B] transition-colors flex items-center justify-center`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-4 h-4 mr-1.5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-1.5" />
                    Mute
                  </>
                )}
              </Button>
              <Button
                onClick={handleStopCall}
                className="flex-1 py-2 bg-red-500/90 hover:bg-red-500 text-white transition-colors flex items-center justify-center"
              >
                <PhoneOff className="w-4 h-4 mr-1.5" />
                End
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

VapiCall.displayName = "VapiCall";

export default VapiCall;
