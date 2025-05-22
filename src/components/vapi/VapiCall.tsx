"use client";

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';
import ImageUploader from './ImageUploader';

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

export default function VapiCall({ 
  onTranscriptUpdate, 
  onCallEnd,
  onCallStart 
}: { 
  onTranscriptUpdate?: (text: string) => void,
  onCallEnd?: () => void,
  onCallStart?: () => void 
}) {
  const vapiClientRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Ready to start call');
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isInjectingDescription, setIsInjectingDescription] = useState(false);
  const isInitializedRef = useRef(false);

  // Handle image description from Claude
  const handleImageDescription = (description: string) => {
    setImageDescription(description);
  };

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

  // Use add-message type instead of say for injecting image description
  const injectImageDescription = async () => {
    if (!imageDescription || !vapiClientRef.current || !isCallActive) return;
    
    setIsInjectingDescription(true);
    
    try {
      // Use add-message instead of say command
      vapiClientRef.current.send({
        type: "add-message" as const,
        message: {
          role: "user",
          content: `I'm looking at an image and here's what it shows: ${imageDescription}`
        }
      });
      
      // Clear the description
      setImageDescription(null);
      
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
        } finally {
          setIsInjectingDescription(false);
        }
      }, 500);
    } catch (error) {
      console.error('Failed to inject image description:', error);
      setIsInjectingDescription(false);
    }
  };

  // Desktop layout
  return (
    <div className="mx-auto w-full max-w-4xl bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg p-4 flex flex-col">
      {/* Image uploader section - always visible */}
      <div className="mb-4">
        <div className="border border-[#2E2D47] rounded-lg p-4 bg-[#1A1B2E]">
          <h3 className="text-white text-sm font-medium mb-3">Image Processing (Claude)</h3>
          <ImageUploader onDescriptionGenerated={handleImageDescription} />
        </div>
        
        {/* Show inject button if there's a description and call is active */}
        {imageDescription && isCallActive && (
          <div className="mt-3">
            <Button
              onClick={injectImageDescription}
              disabled={isInjectingDescription}
              className="w-full bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/80 flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {isInjectingDescription ? 'Sending to VAPI...' : 'Send Image Description to VAPI'}
            </Button>
            <p className="text-xs text-gray-400 mt-1 text-center">
              After sending, you can speak normally to continue the conversation
            </p>
          </div>
        )}
      </div>
      
      {/* Avatar container */}
      <div className="w-full h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] relative bg-gradient-to-b from-[#1C1D2B] to-[#0A0B14] rounded-lg overflow-hidden">
        <Avatar3D isSpeaking={isSpeaking} upperBodyOnly={false} />
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center bg-[#14152A]/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            <div className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-[#00F5A0] animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <span className="text-white text-sm">{callStatus}</span>
          </div>
          
          {isSpeaking && (
            <div className="bg-[#00F5A0]/90 backdrop-blur-sm text-[#14152A] text-xs py-1 px-3 rounded-full shadow-md animate-pulse">
              Speaking
            </div>
          )}
        </div>
      </div>
      
      {/* Controls section */}
      <div className="mt-5">
        {/* Call controls */}
        <div className="flex space-x-4">
          {!isCallActive ? (
            <Button 
              onClick={handleStartCall}
              className="flex-1 bg-[#1C1D2B] hover:bg-[#00F5A0] hover:text-[#14152A] text-[#00F5A0] py-3 font-medium rounded-lg shadow-sm"
            >
              <Phone className="mr-2 h-4 w-4" />
              Start Call
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleStopCall}
                className="flex-1 bg-[#1C1D2B] hover:bg-[#B83280] hover:text-white text-[#B83280] py-3 font-medium rounded-lg shadow-sm"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
              
              <Button 
                onClick={handleToggleMute}
                className={`flex-1 bg-[#1C1D2B] ${isMuted ? 'text-[#B83280]' : 'text-[#00F5A0]'} py-3 font-medium rounded-lg shadow-sm`}
              >
                {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
