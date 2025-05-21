"use client";

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';

// Add proper type for conversation entries
interface ConversationEntry {
  role: string;
  content: string;
}

export default function VapiCall({ onTranscriptUpdate }: { onTranscriptUpdate?: (text: string) => void }) {
  const vapiClientRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [callStatus, setCallStatus] = useState<string>('Ready to call');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Update parent component when transcript changes
  useEffect(() => {
    if (onTranscriptUpdate) {
      onTranscriptUpdate(transcript);
    }
  }, [transcript, onTranscriptUpdate]);

  // Initialize Vapi client
  useEffect(() => {
    // Clean up previous client if exists
    if (vapiClientRef.current) {
      try {
        vapiClientRef.current.stop();
      } catch (e) {
        console.error("Failed to clean up previous client:", e);
      }
      vapiClientRef.current = null;
    }

    if (typeof window !== 'undefined') {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (apiKey) {
        try {
          console.log("Initializing Vapi client");
          const client = new Vapi(apiKey);
          vapiClientRef.current = client;
          
          // Basic event handlers
          client.on('call-start', () => {
            console.log("Call started");
            setCallStatus('Call connected');
            setIsCallActive(true);
          });
          
          client.on('call-end', () => {
            console.log("Call ended");
            setCallStatus('Call ended');
            setIsCallActive(false);
            setIsSpeaking(false);
          });
          
          client.on('speech-start', () => {
            console.log("Speech started");
            setCallStatus('Assistant is speaking');
            setIsSpeaking(true);
          });
          
          client.on('speech-end', () => {
            console.log("Speech ended");
            setCallStatus('Listening...');
            setIsSpeaking(false);
          });
          
          client.on('message', (msg) => {
            console.log("Vapi message received:", msg);
            
            if (msg && typeof msg === 'object') {
              // Handle conversation updates which contain the transcript
              if (msg.type === 'conversation-update' && Array.isArray(msg.conversation)) {
                // Filter out system messages and only keep user/assistant exchanges
                const filteredConversation = msg.conversation
                  .filter((entry: ConversationEntry) => entry.role !== 'system')
                  .map((entry: ConversationEntry) => `${entry.role}: ${entry.content}`)
                  .join('\n\n');
                
                // Update the transcript
                setTranscript(filteredConversation);
                
                // Also pass to parent component if callback exists
                if (onTranscriptUpdate) {
                  onTranscriptUpdate(filteredConversation);
                }
              }
            }
          });
          
          client.on('error', (error) => {
            console.error("Vapi error:", error);
            setCallStatus('Error occurred');
            setIsCallActive(false);
            setIsSpeaking(false);
          });
          
        } catch (error) {
          console.error("Failed to initialize Vapi client:", error);
        }
      }
    }

    // Cleanup function
    return () => {
      if (vapiClientRef.current) {
        try {
          console.log("Cleaning up Vapi client");
          vapiClientRef.current.stop();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, []); // Empty dependency array to only initialize once

  // Start call function
  const handleStartCall = async () => {
    if (!vapiClientRef.current) {
      setCallStatus('Client not initialized');
      return;
    }
    
    setCallStatus('Connecting...');
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      setCallStatus('Assistant ID not configured');
      return;
    }
    
    try {
      await vapiClientRef.current.start(assistantId);
      console.log("Call start requested");
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus('Failed to start call');
    }
  };

  // Stop call function
  const handleStopCall = () => {
    console.log("Stop call requested, client ref:", vapiClientRef.current);
    
    // First attempt - standard way
    if (vapiClientRef.current) {
      try {
        vapiClientRef.current.stop();
        console.log("Call stop requested via standard method");
      } catch (error) {
        console.error("Failed to stop call via standard method:", error);
      }
    } else {
      console.error("Client reference is null");
    }
    
    // Second attempt - force reinitialize the client
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (apiKey) {
      try {
        console.log("Attempting to create new client and stop");
        const tempClient = new Vapi(apiKey);
        tempClient.stop();
        console.log("Call stop requested via temp client");
      } catch (error) {
        console.error("Failed to stop via temp client:", error);
      }
    }
    
    // Force UI update to show call ended
    setIsCallActive(false);
    setIsSpeaking(false);
    setCallStatus('Call ended (forced)');
    
    // Keep transcript in state - don't reset it
    // DO NOT RESET THE TRANSCRIPT HERE
  };

  // Toggle mute function
  const handleToggleMute = () => {
    if (!vapiClientRef.current) return;
    
    try {
      vapiClientRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  };

  // Mobile-optimized layout
  if (isMobile) {
    return (
      <div className="w-full bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg flex flex-col">
        {/* Status bar */}
        <div className="bg-[#181A33] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-[#00F5A0] animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <span className="text-white text-xs">{callStatus}</span>
          </div>
          
          {isSpeaking && (
            <div className="bg-[#00F5A0]/90 text-[#14152A] text-xs py-0.5 px-2 rounded-full animate-pulse">
              Speaking
            </div>
          )}
        </div>
        
        {/* Avatar - centered container for mobile */}
        <div className="w-full h-[260px] relative overflow-hidden bg-gradient-to-b from-[#1C1D2B] to-[#0A0B14]">
          <Avatar3D 
            isSpeaking={isSpeaking} 
            upperBodyOnly={true} 
          />
        </div>
        
        {/* Controls bar - improved styling */}
        <div className="p-4 bg-[#181A33]">
          {!isCallActive ? (
            <Button 
              onClick={handleStartCall}
              className="w-full bg-[#1C1D2B] hover:bg-[#00F5A0] hover:text-[#14152A] text-[#00F5A0] py-3 font-medium rounded-lg shadow-sm"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span>Start Call</span>
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleStopCall}
                className="bg-[#1C1D2B] hover:bg-[#B83280] text-[#B83280] hover:text-white py-3 font-medium rounded-lg shadow-sm"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                <span>End Call</span>
              </Button>
              
              <Button 
                onClick={handleToggleMute}
                className={`bg-[#1C1D2B] ${isMuted ? 'text-[#B83280]' : 'text-[#00F5A0]'} py-3 font-medium rounded-lg shadow-sm`}
              >
                {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="mx-auto w-full max-w-4xl bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg p-4 flex flex-col">
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
