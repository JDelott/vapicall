"use client";

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Vapi from "@vapi-ai/web";

export default function VapiCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [callStatus, setCallStatus] = useState<string>('Ready to call');
  const [vapiClient, setVapiClient] = useState<Vapi | null>(null);

  // Initialize Vapi client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (apiKey) {
        try {
          const client = new Vapi(apiKey);
          setVapiClient(client);
          
          // Set up event listeners
          client.on('call-start', () => {
            setCallStatus('Call connected');
            setIsCallActive(true);
          });
          
          client.on('call-end', () => {
            setCallStatus('Call ended');
            setIsCallActive(false);
          });
          
          client.on('speech-start', () => {
            setCallStatus('Assistant is speaking');
          });
          
          client.on('speech-end', () => {
            setCallStatus('Listening...');
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
            console.error('Error:', error);
            setCallStatus('Error occurred');
            setIsCallActive(false);
          });
          
        } catch (error) {
          console.error('Failed to initialize Vapi client:', error);
        }
      }
    }
    
    // Cleanup
    return () => {
      if (vapiClient) {
        try {
          vapiClient.stop();
        } catch (error) {
          console.error('Error stopping call:', error);
        }
      }
    };
  }, []);

  const handleStartCall = async () => {
    if (!vapiClient) {
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
      await vapiClient.start(assistantId);
      // Events will handle status updates
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('Failed to start call');
    }
  };

  const handleStopCall = () => {
    if (!vapiClient) return;
    
    try {
      vapiClient.stop();
      // Events will handle status updates
    } catch (error) {
      console.error('Failed to stop call:', error);
    }
  };

  const handleToggleMute = () => {
    if (!vapiClient) return;
    
    try {
      vapiClient.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  return (
    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden shadow-lg p-4">
      <div className="text-white mb-4">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-[#00F5A0] animate-pulse' : 'bg-gray-500'} mr-2`}></div>
          <span>{callStatus}</span>
        </div>
      </div>
      
      <div className="flex space-x-3 mb-4">
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
      
      {transcript && (
        <div className="mt-2">
          <div className="text-sm font-semibold text-white mb-1">Transcript</div>
          <div className="bg-[#0A0B14] border border-[#2E2D47] rounded-md p-3 max-h-40 overflow-y-auto text-xs text-gray-300 whitespace-pre-line">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
}
