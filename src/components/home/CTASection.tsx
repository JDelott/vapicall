import Link from "next/link";
import VapiCall from "@/components/vapi/VapiCall";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CTASection() {
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Add debugging to see if transcript updates
  useEffect(() => {
    console.log("CTASection transcript:", transcript);
  }, [transcript]);
  
  // Function to handle transcript updates
  const handleTranscriptUpdate = (text: string) => {
    console.log("Received transcript update:", text);
    setTranscript(text);
  };
  
  return (
    <section className="w-full pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-16 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#14152A] border border-[#2E2D47] rounded-xl overflow-hidden">
          {/* Top glow line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#00F5A0] via-[#B83280] to-[#00F5A0]"></div>
          
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left content */}
            <div className="p-5 sm:p-6 md:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                Talk with Our AI Assistant
              </h2>
              
              <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-6 max-w-sm">
                Experience natural voice conversation with our AI through your browser or phone.
              </p>
              
              {/* Feature list - improved mobile spacing */}
              <div className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8">
                {[
                  "Browser-based voice calling",
                  "Natural AI conversation",
                  "No registration needed"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-0.5 flex-shrink-0 h-2.5 w-2.5 rounded-sm bg-[#00F5A0] mr-2 sm:mr-3"></div>
                    <p className="text-gray-300 text-xs sm:text-sm">{item}</p>
                  </div>
                ))}
              </div>
              
              {/* Display VapiCall component - centered with proper margins */}
              <div className="mx-auto max-w-[280px] sm:max-w-sm md:max-w-md w-full">
                <VapiCall onTranscriptUpdate={handleTranscriptUpdate} />
              </div>
              
              {/* Transcription toggle button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="inline-flex items-center text-xs text-gray-400 hover:text-[#00F5A0] transition-colors"
                >
                  {showTranscript ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Transcription
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Transcription
                    </>
                  )}
                </button>
              </div>
              
              {/* Transcription dropdown */}
              {showTranscript && (
                <div className="mt-2 bg-[#0A0B14] border border-[#2E2D47] rounded-md p-3 max-h-40 overflow-y-auto text-xs text-gray-300">
                  <p className="text-xs font-semibold text-gray-400 mb-2">Live Conversation Transcript</p>
                  <div className="whitespace-pre-line">
                    {transcript || "Use the Call button above to start a conversation. The transcript will appear here as you speak with the AI."}
                  </div>
                </div>
              )}
              
              {/* Phone calling option - centered with proper width */}
              <div className="mt-4 sm:mt-6 mx-auto max-w-[280px] sm:max-w-sm md:max-w-md w-full">
                <p className="text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">Prefer to call by phone?</p>
                <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-3 sm:p-4">
                  <div className="font-mono text-[#00F5A0] text-base sm:text-lg mb-1 text-center">+1 (412) 520 8354</div>
                  <p className="text-xs text-gray-500 text-center">
                    Call from any phone to speak with our AI.
                  </p>
                </div>
              </div>
              
              <p className="mt-3 sm:mt-4 text-gray-500 text-xs text-center">
                By using our service, you agree to our Terms of Service.
              </p>
            </div>
            
            {/* Right - Visual element */}
            <div className="relative hidden md:block">
              {/* Full background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1D2B] to-[#0A0B14]"></div>
              
              {/* Circuit pattern */}
              <div className="absolute inset-0 opacity-10"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300F5A0' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                     backgroundSize: '20px 20px'
                   }}>
              </div>
              
              {/* Centered visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-40 w-40">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#2E2D47] animate-[spin_20s_linear_infinite]"></div>
                  
                  {/* Middle ring */}
                  <div className="absolute inset-[15%] rounded-full border-2 border-[#2E2D47] animate-[spin_15s_linear_infinite_reverse]"></div>
                  
                  {/* Inner ring with dots */}
                  <div className="absolute inset-[30%] rounded-full border-2 border-[#2E2D47] animate-[spin_10s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#00F5A0]"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-[#B83280]"></div>
                  </div>
                  
                  {/* Center circle */}
                  <div className="absolute inset-[45%] rounded-full bg-[#00F5A0] animate-pulse"></div>
                  
                  {/* Emanating pulses */}
                  <div className="absolute inset-[35%] rounded-full border-2 border-[#00F5A0] opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </div>
              </div>
              
              {/* Setup link */}
              <div className="absolute bottom-8 inset-x-0 flex justify-center">
                <Link href="/setup">
                  <div className="px-4 py-2 bg-[#1C1D2B] border border-[#2E2D47] rounded-full hover:border-[#00F5A0] transition-colors">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#00F5A0] animate-pulse mr-2"></div>
                      <div className="text-[#00F5A0] text-xs font-mono">SETUP YOUR OWN NUMBER</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logos/Trust section */}
        
      </div>
    </section>
  );
}
