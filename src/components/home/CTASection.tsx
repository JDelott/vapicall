import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Clock, MessageSquare, Image, Send, Activity, VolumeX } from "lucide-react";
import useTranscriptSummary from "@/services/vapiTranscriptService";
import ImageUploader from "@/components/vapi/ImageUploader";
import VapiCall, { VapiCallRefType } from "@/components/vapi/VapiCall";
import Button from "@/components/ui/Button";

export default function CTASection() {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showImageProcessing, setShowImageProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { transcript, summary, updateTranscript, endCall, isSummarizing, reset } = useTranscriptSummary();
  const [copied, setCopied] = useState(false);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isInjectingDescription, setIsInjectingDescription] = useState(false);
  const vapiCallRef = useRef<VapiCallRefType>(null);
  
  // Add state for call status and duration
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format duration as mm:ss
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Set up and clear the duration timer
  useEffect(() => {
    if (isCallActive) {
      durationTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
    
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, [isCallActive]);
  
  // Function to handle transcript updates
  const handleTranscriptUpdate = (text: string) => {
    console.log("Received transcript update:", text);
    updateTranscript(text);
  };
  
  // Function to handle call ending
  const handleCallEnd = () => {
    console.log('Call ended, final transcript length:', transcript.length);
    setIsCallActive(false);
    endCall();
  };
  
  // Function to handle call start
  const handleCallStart = () => {
    // Reset the transcript service when a new call starts
    reset();
    setIsCallActive(true);
    setCallDuration(0);
  };
  
  // Function to copy summary to clipboard
  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle image description from AI
  const handleImageDescription = (description: string) => {
    setImageDescription(description);
    if (description) {
      console.log("Image processed by AI:", description.substring(0, 100) + "...");
    } else {
      setImageDescription(null);
    }
  };
  
  // Function to send image description to the conversation
  const handleSendImageToConversation = async () => {
    if (!imageDescription || !vapiCallRef.current) {
      return;
    }
    
    setIsInjectingDescription(true);
    
    if (!vapiCallRef.current.isCallActive()) {
      console.log("Call is not active, cannot send image description");
      setIsInjectingDescription(false);
      return;
    }
    
    try {
      await vapiCallRef.current.injectImageDescription(imageDescription);
      setImageDescription(null);
    } catch (error) {
      console.error("Error sending image to conversation:", error);
    } finally {
      setIsInjectingDescription(false);
    }
  };
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  
  const handleSendSummaryViaSMS = async () => {
    if (!summary || !phoneNumber) {
      setSmsStatus("Please provide a phone number and ensure there is a summary.");
      return;
    }

    setIsSendingSMS(true);
    setSmsStatus(null);

    try {
      const response = await fetch('/api/send-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, summary }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSmsStatus("Summary sent to your phone!");
        setPhoneNumber("");
      } else {
        setSmsStatus(`Error: ${data.error || 'Failed to send SMS'}`);
      }
    } catch {
      setSmsStatus("Error connecting to SMS service");
    } finally {
      setIsSendingSMS(false);
    }
  };
  
  return (
    <section className="w-full py-20 sm:py-28 md:py-32 relative z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            AI Assistant Dashboard
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto md:mx-0">
            Experience natural voice conversation with our AI assistant through your browser or phone.
          </p>
        </div>
        
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 gap-5">
          {/* AI Assistant Card with Image Processing dropdown */}
          <div className="bg-[#14152A]/80 backdrop-blur-sm border border-[#2E2D47] rounded-xl shadow-lg">
            <div className="p-3 border-b border-[#2E2D47] bg-[#1C1D2B]/90">
              {/* Responsive Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <h3 className="text-white font-semibold flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-[#00F5A0]" />
                  AI Voice Assistant
                </h3>
                
                {/* Status Indicators - Redesigned for better mobile handling */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Status pill */}
                  <div className="inline-flex items-center bg-[#14152A] px-2 py-1 rounded-full border border-[#2E2D47]">
                    <Activity className="w-3 h-3 text-[#00F5A0] mr-1" />
                    <span className="text-xs text-white">
                      {isCallActive ? "In Progress" : (callDuration > 0 ? "Completed" : "No calls yet")}
                    </span>
                  </div>
                  
                  {/* Duration pill */}
                  <div className="inline-flex items-center bg-[#14152A] px-2 py-1 rounded-full border border-[#2E2D47]">
                    <Clock className="w-3 h-3 text-[#00F5A0] mr-1" />
                    <span className="text-xs text-white">
                      {callDuration > 0 ? formatDuration(callDuration) : "--:--"}
                    </span>
                  </div>
                  
                  {/* Voice Status pill */}
                  <div className="inline-flex items-center bg-[#14152A] px-2 py-1 rounded-full border border-[#2E2D47]">
                    {isCallActive ? (
                      <span className="w-2 h-2 bg-[#00F5A0] rounded-full mr-1"></span>
                    ) : (
                      <VolumeX className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <span className="text-xs text-white">Voice {isCallActive ? "Active" : "Ended"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <VapiCall 
                ref={vapiCallRef}
                onTranscriptUpdate={handleTranscriptUpdate} 
                onCallEnd={handleCallEnd}
                onCallStart={handleCallStart}
              />
              
              {/* Image Processing Toggle Button */}
              <div className="mt-4 border-t border-[#2E2D47] pt-3">
                <button
                  onClick={() => setShowImageProcessing(!showImageProcessing)}
                  className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-[#00F5A0] transition-colors p-2 rounded-md hover:bg-[#1C1D2B]"
                >
                  <span className="flex items-center">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="w-4 h-4 mr-2 text-[#00F5A0]" aria-hidden="true" />
                    Image Processing
                  </span>
                  {showImageProcessing ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Collapsible Image Processing Section */}
              {showImageProcessing && (
                <div className="mt-3 p-4 bg-[#1C1D2B] rounded-lg border border-[#2E2D47] transition-all duration-300 ease-in-out">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side - Uploader - fixed height */}
                    <div className="h-[180px] flex items-center">
                      <ImageUploader onDescriptionGenerated={handleImageDescription} />
                    </div>
                    
                    {/* Right side - Description & Controls - fixed height */}
                    <div className="h-[180px] flex flex-col">
                      {imageDescription ? (
                        <div className="h-full flex flex-col">
                          <div className="p-3 bg-[#14152A] border border-[#2E2D47] rounded-md mb-2 flex-grow overflow-hidden">
                            <h4 className="text-xs font-medium text-[#00F5A0] mb-1">Image Analysis</h4>
                            <div className="text-xs text-gray-300 overflow-y-auto pr-1 h-[115px]">
                              {imageDescription}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-1">
                            <Button
                              onClick={handleSendImageToConversation}
                              disabled={isInjectingDescription || !vapiCallRef.current?.isCallActive()}
                              className={`w-full ${
                                isInjectingDescription || !vapiCallRef.current?.isCallActive()
                                  ? 'bg-[#14152A] text-gray-500 border border-[#2E2D47] cursor-not-allowed'
                                  : 'bg-[#14152A] text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                              } flex items-center justify-center py-1 text-xs transition-colors`}
                            >
                              <Send className="w-2.5 h-2.5 mr-1" />
                              {isInjectingDescription ? 'Sending...' : 'Send to Conversation'}
                            </Button>
                            {!vapiCallRef.current?.isCallActive() && (
                              <p className="text-[10px] text-gray-500 text-center italic">
                                Start a call first to send
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full p-6 text-center bg-[#14152A] border border-[#2E2D47] rounded-md">
                          <p className="text-sm text-gray-500">
                            Upload and process an image to see its analysis here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Conversation Summary Toggle Button */}
              <div className="mt-4 border-t border-[#2E2D47] pt-3">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-[#00F5A0] transition-colors p-2 rounded-md hover:bg-[#1C1D2B]"
                >
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-[#00F5A0]" />
                    Conversation Summary
                  </span>
                  {showSummary ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Collapsible Conversation Summary Section */}
              {showSummary && (
                <div className="mt-3 p-4 bg-[#1C1D2B] rounded-lg border border-[#2E2D47] transition-all duration-300 ease-in-out">
                  {isSummarizing ? (
                    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-4 h-[100px] flex flex-col justify-center items-center">
                      <p className="text-xs font-semibold text-[#00F5A0] mb-3">Generating Summary...</p>
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-75"></div>
                        <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-[#00F5A0]">AI Generated Summary</p>
                        <button 
                          onClick={copyToClipboard}
                          className="text-xs flex items-center text-gray-400 hover:text-[#00F5A0] transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="whitespace-pre-line text-sm text-gray-300 max-h-[150px] overflow-y-auto">
                        {summary}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-4 h-[100px] flex items-center justify-center">
                      <p className="text-sm text-gray-500">No summary available yet</p>
                    </div>
                  )}
                  
                  {/* Transcript Toggle */}
                  <div className="flex justify-between items-center mb-2 mt-4">
                    <p className="text-xs font-medium text-gray-300">Full Conversation Transcript</p>
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="flex items-center text-xs text-gray-400 hover:text-[#00F5A0] transition-colors"
                    >
                      {showTranscript ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          <span>Show</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Transcript Content */}
                  {showTranscript && (
                    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-4">
                      {transcript ? (
                        <div className="whitespace-pre-line text-xs text-gray-300 max-h-[200px] overflow-y-auto">
                          {transcript}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No conversation recorded yet.</p>
                      )}
                    </div>
                  )}
                  
                  {summary && (
                    <div className="mt-4 border-t border-[#2E2D47] pt-3">
                      <p className="text-xs font-medium text-gray-300 mb-2">Send summary to your phone:</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="p-2 bg-[#14152A] border border-[#2E2D47] rounded-md text-sm text-gray-300 flex-grow"
                        />
                        <button
                          onClick={handleSendSummaryViaSMS}
                          disabled={isSendingSMS || !phoneNumber || !summary}
                          className={`py-2 px-3 text-xs rounded-md transition-colors ${
                            isSendingSMS || !phoneNumber || !summary
                              ? 'bg-[#14152A] text-gray-500 border border-[#2E2D47] cursor-not-allowed'
                              : 'bg-[#14152A] text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                          }`}
                        >
                          {isSendingSMS ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                      {smsStatus && (
                        <p className={`text-xs mt-2 ${smsStatus?.includes('Error') ? 'text-red-400' : 'text-[#00F5A0]'}`}>
                          {smsStatus}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
