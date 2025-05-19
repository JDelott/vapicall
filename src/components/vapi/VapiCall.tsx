"use client";

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';

export default function VapiCall() {
  // Use ref for stable reference to client
  const vapiClientRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [callStatus, setCallStatus] = useState<string>('Ready to call');
  const [currentPhoneme, setCurrentPhoneme] = useState<string>('');

  // Initialize Vapi client once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      console.error("API key is missing");
      setCallStatus('Missing API key');
      return;
    }
    
    try {
      console.log("Initializing Vapi client...");
      const client = new Vapi(apiKey);
      vapiClientRef.current = client;
      
      // Set up event listeners
      const setupEventListeners = () => {
        client.on('call-start', () => {
          console.log("Call started event received");
          setCallStatus('Call connected');
          setIsCallActive(true);
        });
        
        client.on('call-end', () => {
          console.log("Call ended event received");
          setCallStatus('Call ended');
          setIsCallActive(false);
          setIsSpeaking(false);
        });
        
        client.on('speech-start', () => {
          console.log("Speech started event received");
          setCallStatus('Assistant is speaking');
          setIsSpeaking(true);
        });
        
        client.on('speech-end', () => {
          console.log("Speech ended event received");
          setCallStatus('Listening...');
          setIsSpeaking(false);
        });
        
        client.on('message', (msg) => {
          console.log("Message received:", msg);
          if (msg && typeof msg === 'object' && 'type' in msg && msg.type === 'transcript') {
            if ('transcript' in msg && typeof msg.transcript === 'object' && msg.transcript) {
              if ('text' in msg.transcript && typeof msg.transcript.text === 'string') {
                setTranscript(prev => prev + '\n' + msg.transcript.text);
              }
            }
          }
        });
        
        client.on('error', (error) => {
          console.error("Vapi error event:", error);
          setCallStatus('Error occurred');
          setIsCallActive(false);
          setIsSpeaking(false);
        });
      };
      
      setupEventListeners();
      console.log("Vapi client initialized successfully");
      
    } catch (error) {
      console.error("Failed to initialize Vapi client:", error);
      setCallStatus('Failed to initialize');
    }
    
    // Cleanup
    return () => {
      console.log("Component unmounting, cleaning up...");
      if (vapiClientRef.current) {
        try {
          console.log("Stopping call on unmount");
          vapiClientRef.current.stop();
        } catch (error) {
          console.error("Error stopping call during cleanup:", error);
        }
        // Clear the reference
        vapiClientRef.current = null;
      }
    };
  }, []); // Empty dependency array to run once

  const handleStartCall = async () => {
    console.log("Start call button clicked");
    if (!vapiClientRef.current) {
      console.error("Cannot start call: client not initialized");
      setCallStatus('Client not initialized');
      return;
    }
    
    setCallStatus('Connecting...');
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId) {
      console.error("Assistant ID not configured");
      setCallStatus('Assistant ID not configured');
      return;
    }
    
    try {
      console.log("Starting call with assistant ID:", assistantId);
      await vapiClientRef.current.start(assistantId);
      console.log("Call started successfully");
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus('Failed to start call');
    }
  };

  const handleStopCall = async () => {
    console.log("Stop call button clicked");
    if (!vapiClientRef.current) {
      console.error("Cannot stop call: client not initialized");
      return;
    }
    
    try {
      console.log("Stopping call...");
      
      // Force a manual state update before attempting to stop
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallStatus('Ending call...');
      
      // Delay slightly to ensure UI updates
      setTimeout(async () => {
        try {
          // Use the stable ref for stopping the call
          await vapiClientRef.current?.stop();
          console.log("Call stopped successfully");
          
          // Force another state update
          setCallStatus('Call ended');
        } catch (stopError) {
          console.error("Error stopping call:", stopError);
          setCallStatus('Error ending call');
        }
      }, 100);
    } catch (error) {
      console.error("Failed in stop call handler:", error);
      // Still update UI state
      setIsCallActive(false);
      setIsSpeaking(false);
      setCallStatus('Call ended (with errors)');
    }
  };

  const handleToggleMute = () => {
    console.log("Toggle mute button clicked");
    if (!vapiClientRef.current) {
      console.error("Cannot toggle mute: client not initialized");
      return;
    }
    
    try {
      console.log("Setting muted state to:", !isMuted);
      vapiClientRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  };

  // Add a safety cleanup for call when component re-renders
  useEffect(() => {
    return () => {
      if (isCallActive && vapiClientRef.current) {
        console.log("Safety cleanup: Detected active call during component update");
        try {
          vapiClientRef.current.stop();
          console.log("Safety cleanup: Successfully stopped call");
        } catch (error) {
          console.error("Safety cleanup: Failed to stop call:", error);
        }
      }
    };
  }, [isCallActive]);

  return (
    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg p-4 flex flex-col">
      {/* Avatar takes the main focus - much larger */}
      <div className="w-full h-[500px]">
        <Avatar3D isSpeaking={isSpeaking} currentPhoneme={currentPhoneme} />
      </div>
      
      {/* Controls overlaid at the bottom */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-[#00F5A0] animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <span className="text-white">{callStatus}</span>
          </div>
          
          {/* Minimalist transcript popup that appears only when there's content */}
          {transcript && (
            <div className="text-xs text-gray-400 truncate max-w-[200px]">
              {transcript.split('\n').pop()}
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          {!isCallActive ? (
            <Button 
              onClick={handleStartCall}
              className="flex-1 bg-[#1C1D2B] hover:bg-[#00F5A0] hover:text-[#14152A] text-[#00F5A0]"
            >
              <Phone className="mr-2 h-4 w-4" />
              Start Call
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleStopCall}
                className="flex-1 bg-[#1C1D2B] hover:bg-[#B83280] hover:text-white text-[#B83280] relative z-20"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
              
              <Button 
                onClick={handleToggleMute}
                className={`flex-1 bg-[#1C1D2B] ${isMuted ? 'text-[#B83280]' : 'text-[#00F5A0]'} relative z-20`}
              >
                {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </>
          )}
        </div>
        
        {/* Full transcript available in a collapsible section */}
        {transcript && (
          <div className="mt-4 overflow-hidden transition-all duration-300 hover:max-h-40 max-h-0 group">
            <div className="text-xs text-white/60 group-hover:text-white transition-colors">
              Click to expand transcript
            </div>
            <div className="bg-[#0A0B14] border border-[#2E2D47] rounded-md p-3 max-h-40 overflow-y-auto text-xs text-gray-300 whitespace-pre-line mt-2">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
