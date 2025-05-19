"use client";

import { useState, useEffect } from "react";
import { Phone, Mic, MicOff, X } from "lucide-react";
import Button from "@/components/ui/Button";

type CallStatus = "connecting" | "active" | "ended";

interface CallInterfaceProps {
  onEnd: () => void;
}

export default function CallInterface({ onEnd }: CallInterfaceProps) {
  const [status, setStatus] = useState<CallStatus>("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("active");
      addMessage("VAPI", "Hello! How can I assist you today?");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const addMessage = (sender: string, text: string) => {
    setTranscript(prev => [...prev, `${sender}: ${text}`]);
  };

  const handleUserMessage = (message: string) => {
    addMessage("You", message);
    
    // Simulate AI response
    setTimeout(() => {
      if (message.toLowerCase().includes("weather")) {
        addMessage("VAPI", "The weather today is sunny with a high of 75°F.");
      } else if (message.toLowerCase().includes("reminder")) {
        addMessage("VAPI", "I've set a reminder for you. Is there anything else you need?");
      } else {
        addMessage("VAPI", "I understand. How else can I help you today?");
      }
    }, 1000);
  };

  const handleEndCall = () => {
    setStatus("ended");
    setTimeout(onEnd, 1000);
  };

  return (
    <div className="w-full rounded-lg bg-dark-700 border border-dark-600 p-6 shadow-lg relative overflow-hidden">
      {/* Background tech pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235bbdff' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-600 border border-dark-500">
              <Phone className="h-5 w-5 text-neon-blue" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-white text-lg">VAPI Assistant</h3>
              <p className="text-sm text-gray-400 flex items-center">
                {status === "connecting" ? (
                  <>
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    Establishing secure connection...
                  </> 
                ) : status === "active" ? (
                  <>
                    <span className="w-2 h-2 bg-neon-green rounded-full mr-2"></span>
                    Secure connection active
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Connection terminated
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="rounded-full p-2 bg-dark-600 hover:bg-dark-500 text-gray-300"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={handleEndCall}
              className="rounded-full p-2 bg-dark-600 hover:bg-red-900 text-red-500 hover:text-red-400"
              aria-label="End call"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Transcript */}
        <div className="mb-6 h-72 overflow-y-auto rounded-lg border border-dark-600 bg-dark-800 p-4">
          {status === "connecting" ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="relative h-16 w-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-neon-blue opacity-20"></div>
                  <div className="absolute inset-3 rounded-full border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-6 rounded-full bg-neon-blue opacity-30 animate-pulse"></div>
                </div>
                <p className="mt-4 text-sm text-gray-400 font-mono">Initializing secure protocol...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transcript.map((message, index) => {
                const [sender, ...textParts] = message.split(": ");
                const text = textParts.join(": ");
                return (
                  <div 
                    key={index} 
                    className={`rounded-lg p-3 shadow-sm max-w-[85%] ${
                      sender === "You" 
                        ? "ml-auto bg-dark-600 border border-dark-500" 
                        : "bg-neon-blue bg-opacity-10 border border-neon-blue border-opacity-30"
                    }`}
                  >
                    <p className={`text-xs mb-1 ${sender === "You" ? "text-gray-400" : "text-neon-blue"}`}>
                      {sender}
                    </p>
                    <p className="text-sm text-gray-200">{text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Input */}
        {status === "active" && (
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow rounded-md border border-dark-600 bg-dark-800 px-4 py-3 text-sm text-gray-200 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue focus:outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleUserMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.querySelector("input");
                if (input && input.value.trim()) {
                  handleUserMessage(input.value);
                  input.value = "";
                }
              }}
              className="rounded-md px-4 py-3 bg-neon-blue hover:bg-blue-400 text-dark-900"
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
