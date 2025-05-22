import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Clock, MessageSquare, Image, Send,  } from "lucide-react";
import useTranscriptSummary from "@/services/vapiTranscriptService";
import ImageUploader from "@/components/vapi/ImageUploader";
import VapiCall, { VapiCallRefType } from "@/components/vapi/VapiCall";
import Button from "@/components/ui/Button";

export default function CTASection() {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showImageProcessing, setShowImageProcessing] = useState(false);
  const { transcript, summary, updateTranscript, endCall, isSummarizing, reset } = useTranscriptSummary();
  const [copied, setCopied] = useState(false);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isInjectingDescription, setIsInjectingDescription] = useState(false);
  const vapiCallRef = useRef<VapiCallRefType>(null);
  
  // Function to handle transcript updates
  const handleTranscriptUpdate = (text: string) => {
    console.log("Received transcript update:", text);
    updateTranscript(text);
  };
  
  // Function to handle call ending
  const handleCallEnd = () => {
    console.log('Call ended, final transcript length:', transcript.length);
    endCall();
  };
  
  // Function to handle call start
  const handleCallStart = () => {
    // Reset the transcript service when a new call starts
    reset();
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
  
  return (
    <section className="w-full py-12 sm:py-16 bg-[#0A0B14]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Assistant Dashboard
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto md:mx-0">
            Experience natural voice conversation with our AI assistant through your browser or phone.
          </p>
        </div>
        
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* AI Assistant Card with Image Processing dropdown */}
          <div className="md:col-span-3 bg-[#14152A] border border-[#2E2D47] rounded-xl shadow-lg">
            <div className="p-3 border-b border-[#2E2D47] bg-[#1C1D2B]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-[#00F5A0]" />
                  AI Voice Assistant
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#1C1D2B] px-2 py-1 rounded-md text-xs border border-[#2E2D47]">
                      <div className="text-gray-400">Status: <span className="text-white">{transcript ? "Completed" : "No calls yet"}</span></div>
                    </div>
                    <div className="bg-[#1C1D2B] px-2 py-1 rounded-md text-xs border border-[#2E2D47]">
                      <div className="text-gray-400">Duration: <span className="text-white flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-[#00F5A0]" inline-size="12" />
                        {transcript ? "2:35" : "--:--"}
                      </span></div>
                    </div>
                  </div>
                  <div className="bg-[#0A0B14] px-2 py-1 rounded-md text-xs text-gray-400">
                    Voice Enabled
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
                    <Image className="w-4 h-4 mr-2 text-[#00F5A0]" />
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
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="md:col-span-3 bg-[#14152A] border border-[#2E2D47] rounded-xl shadow-lg">
            <div className="p-3 border-b border-[#2E2D47] bg-[#1C1D2B]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-[#00F5A0]" />
                  Conversation Summary
                </h3>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center text-xs text-gray-400 hover:text-[#00F5A0] transition-colors bg-[#0A0B14] px-2 py-1 rounded-md"
                >
                  {showTranscript ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Transcript
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Transcript
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {isSummarizing ? (
                <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4 h-24">
                  <p className="text-xs font-semibold text-[#00F5A0] mb-2">Generating Summary...</p>
                  <div className="flex justify-center p-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-75"></div>
                      <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              ) : summary ? (
                <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4 mb-4">
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
                  <div className="whitespace-pre-line text-sm text-gray-300">
                    {summary}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4 h-24 flex items-center justify-center">
                  <p className="text-sm text-gray-500">No summary available yet</p>
                </div>
              )}
              
              {showTranscript && (
                <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4">
                  <p className="text-xs font-semibold text-[#00F5A0] mb-2">Full Conversation Transcript</p>
                  {transcript ? (
                    <div className="whitespace-pre-line text-xs text-gray-300">
                      {transcript}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No conversation recorded yet.</p>
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
