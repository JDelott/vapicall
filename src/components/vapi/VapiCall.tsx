"use client";

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";
import Avatar3D from './Avatar3D';

export default function VapiCall() {
  const vapiClientRef = useRef<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [callStatus, setCallStatus] = useState<string>('Ready to call');
  const [showTranscript, setShowTranscript] = useState(false);
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

  // Initialize Vapi client
  useEffect(() => {
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
            if (msg && typeof msg === 'object' && 'type' in msg && msg.type === 'transcript') {
              if ('transcript' in msg && typeof msg.transcript === 'object' && msg.transcript) {
                if ('text' in msg.transcript && typeof msg.transcript.text === 'string') {
                  setTranscript(prev => prev + '\n' + msg.transcript.text);
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
  }, []);

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
    if (!vapiClientRef.current) return;
    
    try {
      vapiClientRef.current.stop();
      console.log("Call stop requested");
    } catch (error) {
      console.error("Failed to stop call:", error);
    }
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
      <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg flex flex-col w-full">
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
        
        {/* Avatar - Only upper body view for mobile */}
        <div className="w-full h-[240px] relative overflow-hidden">
          <Avatar3D 
            isSpeaking={isSpeaking} 
            upperBodyOnly={true} 
          />
        </div>
        
        {/* Controls bar - fixed at bottom */}
        <div className="p-3 bg-[#181A33]">
          {!isCallActive ? (
            <Button 
              onClick={handleStartCall}
              className="w-full bg-[#1C1D2B] hover:bg-[#00F5A0] hover:text-[#14152A] text-[#00F5A0] py-2.5"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span>Start Call</span>
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleStopCall}
                className="bg-[#1C1D2B] hover:bg-[#B83280] text-[#B83280] py-2.5"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                <span>End Call</span>
              </Button>
              
              <Button 
                onClick={handleToggleMute}
                className={`bg-[#1C1D2B] ${isMuted ? 'text-[#B83280]' : 'text-[#00F5A0]'} py-2.5`}
              >
                {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>
            </div>
          )}
          
          {/* Latest transcript - compact version */}
          {transcript && isCallActive && (
            <div className="mt-2 text-xs text-gray-400 truncate bg-[#0A0B14]/70 rounded p-1.5">
              {transcript.split('\n').pop()}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg p-4 flex flex-col w-full">
      {/* Avatar container */}
      <div className="w-full h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] relative">
        <Avatar3D isSpeaking={isSpeaking} upperBodyOnly={false} />
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center bg-[#14152A]/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-[#00F5A0] animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <span className="text-white text-sm">{callStatus}</span>
          </div>
          
          {isSpeaking && (
            <div className="bg-[#00F5A0]/90 backdrop-blur-sm text-[#14152A] text-xs py-1 px-3 rounded-full animate-pulse">
              Speaking
            </div>
          )}
        </div>
      </div>
      
      {/* Controls section */}
      <div className="mt-4">
        {/* Call controls */}
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
                className="flex-1 bg-[#1C1D2B] hover:bg-[#B83280] hover:text-white text-[#B83280]"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
              
              <Button 
                onClick={handleToggleMute}
                className={`flex-1 bg-[#1C1D2B] ${isMuted ? 'text-[#B83280]' : 'text-[#00F5A0]'}`}
              >
                {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </>
          )}
        </div>
        
        {/* Transcript section */}
        {transcript && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold text-white">Transcript</div>
              <button 
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs text-gray-400 hover:text-white"
              >
                {showTranscript ? 'Hide' : 'Show full transcript'}
              </button>
            </div>
            
            {showTranscript ? (
              <div className="bg-[#0A0B14] border border-[#2E2D47] rounded-md p-3 max-h-40 overflow-y-auto text-xs text-gray-300 whitespace-pre-line">
                {transcript}
              </div>
            ) : (
              <div className="bg-[#0A0B14] border border-[#2E2D47] rounded-md p-3 text-xs text-gray-300 truncate">
                {transcript.split('\n').pop()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
