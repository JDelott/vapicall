import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Clock, MessageSquare, Image, Send, Activity, VolumeX, FileText, Mail } from "lucide-react";
import useTranscriptSummary from "@/services/vapiTranscriptService";
import ImageUploader from "@/components/vapi/ImageUploader";
import VapiCall, { VapiCallRefType } from "@/components/vapi/VapiCall";
import Button from "@/components/ui/Button";
import TextUploader from "@/components/vapi/TextUploader";
import AssistantSelector from "@/components/vapi/AssistantSelector";
import { useAssistants } from "@/hooks/useAssistants";
import { sendConversationEmail } from "@/utils/emailService";

export default function CTASection() {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showImageProcessing, setShowImageProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showTextProcessing, setShowTextProcessing] = useState(false);
  const { transcript, summary, updateTranscript, endCall, isSummarizing, reset } = useTranscriptSummary();
  const [copied, setCopied] = useState(false);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isInjectingDescription, setIsInjectingDescription] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isInjectingText, setIsInjectingText] = useState(false);
  const vapiCallRef = useRef<VapiCallRefType>(null);
  
  // Add state for call status and duration
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the assistants hook
  const { assistants, selectedAssistant, selectAssistant, loading: assistantsLoading } = useAssistants();
  
  // Add email-related state
  const [emailAddress, setEmailAddress] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  
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
    updateTranscript(text);
  };
  
  // Function to handle call ending
  const handleCallEnd = () => {
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
      // Image processed successfully
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
  
  // Handle text content from TextUploader
  const handleTextContent = (text: string) => {
    setTextContent(text || null);
  };
  
  // Function to send text content to the conversation
  const handleSendTextToConversation = async () => {
    if (!textContent || !vapiCallRef.current) {
      return;
    }
    
    setIsInjectingText(true);
    
    if (!vapiCallRef.current.isCallActive()) {
      setIsInjectingText(false);
      return;
    }
    
    try {
      await vapiCallRef.current.injectTextMessage(textContent);
      setTextContent(null);
    } catch (error) {
      console.error("Error sending text to conversation:", error);
    } finally {
      setIsInjectingText(false);
    }
  };
  
  // Function to send email
  const handleSendEmail = async () => {
    if (!emailAddress.trim()) {
      setEmailError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!transcript && !summary) {
      setEmailError('No conversation data available to send');
      return;
    }

    setIsEmailSending(true);
    setEmailError('');
    setEmailSent(false);

    try {
      const result = await sendConversationEmail({
        email: emailAddress,
        transcript: transcript || undefined,
        summary: summary || undefined,
      });

      if (result.success) {
        setEmailSent(true);
        setEmailAddress(''); // Clear the email field
        setTimeout(() => setEmailSent(false), 5000); // Reset success message after 5 seconds
      } else {
        console.error('Error sending email:', result.error);
        setEmailError(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('An unexpected error occurred');
    } finally {
      setIsEmailSending(false);
    }
  };

  // Clear email error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };
  
  return (
    <section className="w-full py-20 sm:py-28 md:py-32 relative z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <span className="mr-1.5">⚡</span> DASHBOARD
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            AI Assistant <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] to-[#00F5A0]">Dashboard</span>
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
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
              {/* Assistant Selector */}
              <div className="mb-4">
                <AssistantSelector
                  assistants={assistants}
                  selectedAssistant={selectedAssistant}
                  onSelectAssistant={selectAssistant}
                  disabled={isCallActive || assistantsLoading}
                />
              </div>
              
              <VapiCall 
                ref={vapiCallRef}
                onTranscriptUpdate={handleTranscriptUpdate} 
                onCallEnd={handleCallEnd}
                onCallStart={handleCallStart}
                selectedAssistant={selectedAssistant}
              />
              
              {/* Text Processing Toggle Button */}
              <div className="mt-4 border-t border-[#2E2D47] pt-3">
                <button
                  onClick={() => setShowTextProcessing(!showTextProcessing)}
                  className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-[#00F5A0] transition-colors p-2 rounded-md hover:bg-[#1C1D2B]"
                >
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#00F5A0]" aria-hidden="true" />
                    Text Upload
                  </span>
                  {showTextProcessing ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Collapsible Text Processing Section */}
              {showTextProcessing && (
                <div className="mt-3 p-4 bg-[#1C1D2B] rounded-lg border border-[#2E2D47] transition-all duration-300 ease-in-out">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side - Text Uploader - fixed height */}
                    <div className="h-[180px] flex items-center">
                      <TextUploader onTextReady={handleTextContent} />
                    </div>
                    
                    {/* Right side - Text Content & Controls - fixed height */}
                    <div className="h-[180px] flex flex-col">
                      {textContent ? (
                        <div className="h-full flex flex-col">
                          <div className="p-3 bg-[#14152A] border border-[#2E2D47] rounded-md mb-2 flex-grow overflow-hidden">
                            <h4 className="text-xs font-medium text-[#00F5A0] mb-1">Text Content</h4>
                            <div className="text-xs text-gray-300 overflow-y-auto pr-1 h-[115px]">
                              {textContent}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-1">
                            <Button
                              onClick={handleSendTextToConversation}
                              disabled={isInjectingText || !vapiCallRef.current?.isCallActive()}
                              className={`w-full ${
                                isInjectingText || !vapiCallRef.current?.isCallActive()
                                  ? 'bg-[#14152A] text-gray-500 border border-[#2E2D47] cursor-not-allowed'
                                  : 'bg-[#14152A] text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                              } flex items-center justify-center py-1 text-xs transition-colors`}
                            >
                              <Send className="w-2.5 h-2.5 mr-1" />
                              {isInjectingText ? 'Sending...' : 'Send to Conversation'}
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
                            Upload a text file or type your message to see it here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image Processing Toggle Button */}
              <div className="mt-4 border-t border-[#2E2D47] pt-3">
                <button
                  onClick={() => setShowImageProcessing(!showImageProcessing)}
                  className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-[#00F5A0] transition-colors p-2 rounded-md hover:bg-[#1C1D2B]"
                >
                  <span className="flex items-center">
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
                            <div className="text-xs text-gray-300 overflow-y-auto pr-2 h-[100px]">
                              <div className="pb-12">
                                {imageDescription}
                              </div>
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
                <div className="mt-3 p-6 bg-[#1C1D2B] rounded-lg border border-[#2E2D47] transition-all duration-300 ease-in-out">
                  
                  {/* Section 1: AI Summary */}
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-[#00F5A0]/10 rounded-lg border border-[#00F5A0]/20 mr-3">
                        <MessageSquare className="w-4 h-4 text-[#00F5A0]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">AI Generated Summary</h3>
                        <p className="text-xs text-gray-400">Key insights from your conversation</p>
                      </div>
                      {summary && (
                        <button 
                          onClick={copyToClipboard}
                          className="ml-auto text-xs flex items-center text-gray-400 hover:text-[#00F5A0] transition-colors"
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
                      )}
                    </div>
                    
                    {/* Fixed height container for all states */}
                    <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg h-[150px] flex flex-col">
                      {isSummarizing ? (
                        <div className="flex-1 flex flex-col justify-center items-center p-4">
                          <p className="text-xs font-medium text-[#00F5A0] mb-3">Generating Summary...</p>
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-75"></div>
                            <div className="h-2 w-2 bg-[#00F5A0] rounded-full animate-pulse delay-150"></div>
                          </div>
                        </div>
                      ) : summary ? (
                        <div className="flex-1 min-h-0 p-4">
                          <div className="whitespace-pre-line text-sm text-gray-300 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2E2D47] scrollbar-track-transparent">
                            {summary}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center p-4">
                          <p className="text-sm text-gray-400">No summary available yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Full Transcript */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#00F5A0]/10 rounded-lg border border-[#00F5A0]/20 mr-3">
                          <FileText className="w-4 h-4 text-[#00F5A0]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Full Conversation</h3>
                          <p className="text-xs text-gray-400">Complete transcript of your call</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center text-xs text-gray-400 hover:text-[#00F5A0] transition-colors px-3 py-1.5 rounded-md hover:bg-[#14152A]"
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
                    
                    {showTranscript && (
                      <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-4 h-[200px] flex flex-col">
                        {transcript ? (
                          <div className="flex-1 min-h-0">
                            <div className="whitespace-pre-line text-xs text-gray-300 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2E2D47] scrollbar-track-transparent">
                              {transcript}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-xs text-gray-400">No conversation recorded yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Email Actions - Responsive Subtle CTA */}
                  {(summary || transcript) && (
                    <div className="mt-6 pt-4 border-t border-[#2E2D47]/50">
                      {/* Mobile Layout (xs to sm) */}
                      <div className="block md:hidden">
                        <div className="p-4 bg-[#14152A]/40 border border-[#2E2D47]/30 rounded-lg space-y-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-[#00F5A0] flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">Send to email</p>
                              <p className="text-xs text-gray-400">
                                {summary && transcript ? 'Summary + transcript' : summary ? 'AI summary' : 'Transcript'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="email"
                              placeholder="your@email.com"
                              value={emailAddress}
                              onChange={handleEmailChange}
                              className="w-full px-3 py-2.5 bg-[#0A0B14] border border-[#2E2D47] rounded-md text-sm text-white placeholder-gray-400 focus:border-[#00F5A0]/50 focus:outline-none transition-all duration-200"
                              style={{
                                fontSize: '16px', // Prevents zoom on iOS
                                WebkitAppearance: 'none',
                                WebkitTapHighlightColor: 'transparent'
                              }}
                              disabled={isEmailSending}
                              onFocus={() => {
                                // Force viewport to stay fixed on mobile
                                const viewport = document.querySelector('meta[name=viewport]');
                                if (viewport) {
                                  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                                }
                              }}
                              onBlur={() => {
                                // Keep viewport fixed after blur
                                const viewport = document.querySelector('meta[name=viewport]');
                                if (viewport) {
                                  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                                }
                              }}
                            />
                            
                            <Button
                              onClick={handleSendEmail}
                              disabled={isEmailSending || !emailAddress.trim()}
                              className={`w-full px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                                isEmailSending || !emailAddress.trim()
                                  ? 'bg-transparent text-gray-500 border border-gray-600 cursor-not-allowed'
                                  : 'bg-transparent text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                              } flex items-center justify-center space-x-2`}
                            >
                              {isEmailSending ? (
                                <>
                                  <div className="w-3 h-3 border border-[#00F5A0]/30 border-t-[#00F5A0] rounded-full animate-spin"></div>
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <span>Send Email</span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Tablet Layout (md to lg) */}
                      <div className="hidden md:block lg:hidden">
                        <div className="p-4 bg-[#14152A]/40 border border-[#2E2D47]/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-[#00F5A0]" />
                              <div>
                                <p className="text-sm text-white font-medium">Send to email</p>
                                <p className="text-xs text-gray-400">
                                  {summary && transcript ? 'Summary + transcript' : summary ? 'AI summary' : 'Transcript'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <input
                              type="email"
                              placeholder="your@email.com"
                              value={emailAddress}
                              onChange={handleEmailChange}
                              className="flex-1 px-3 py-2 bg-[#0A0B14] border border-[#2E2D47] rounded-md text-sm text-white placeholder-gray-400 focus:border-[#00F5A0]/50 focus:outline-none transition-all duration-200"
                              style={{
                                fontSize: '16px',
                                WebkitAppearance: 'none',
                                WebkitTapHighlightColor: 'transparent'
                              }}
                              disabled={isEmailSending}
                            />
                            
                            <Button
                              onClick={handleSendEmail}
                              disabled={isEmailSending || !emailAddress.trim()}
                              className={`px-6 py-2 rounded-md text-sm transition-all duration-200 ${
                                isEmailSending || !emailAddress.trim()
                                  ? 'bg-transparent text-gray-500 border border-gray-600 cursor-not-allowed'
                                  : 'bg-transparent text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                              } flex items-center space-x-2 whitespace-nowrap`}
                            >
                              {isEmailSending ? (
                                <>
                                  <div className="w-3 h-3 border border-[#00F5A0]/30 border-t-[#00F5A0] rounded-full animate-spin"></div>
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <span>Send</span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout (lg and xl) */}
                      <div className="hidden lg:block">
                        <div className="flex items-center justify-between p-4 bg-[#14152A]/40 border border-[#2E2D47]/30 rounded-lg hover:bg-[#14152A]/60 transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-[#00F5A0]" />
                            <div>
                              <p className="text-sm text-white font-medium">Send to email</p>
                              <p className="text-xs text-gray-400">
                                {summary && transcript ? 'Summary + transcript' : summary ? 'AI summary' : 'Transcript'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <input
                              type="email"
                              placeholder="your@email.com"
                              value={emailAddress}
                              onChange={handleEmailChange}
                              className="w-48 xl:w-56 px-3 py-2 bg-[#0A0B14] border border-[#2E2D47] rounded-md text-sm text-white placeholder-gray-400 focus:border-[#00F5A0]/50 focus:outline-none transition-all duration-200"
                              style={{
                                fontSize: '16px',
                                WebkitAppearance: 'none',
                                WebkitTapHighlightColor: 'transparent'
                              }}
                              disabled={isEmailSending}
                            />
                            
                            <Button
                              onClick={handleSendEmail}
                              disabled={isEmailSending || !emailAddress.trim()}
                              className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                isEmailSending || !emailAddress.trim()
                                  ? 'bg-transparent text-gray-500 border border-gray-600 cursor-not-allowed'
                                  : 'bg-transparent text-[#00F5A0] border border-[#00F5A0] hover:bg-[#00F5A0]/10'
                              } flex items-center space-x-2 whitespace-nowrap`}
                            >
                              {isEmailSending ? (
                                <>
                                  <div className="w-3 h-3 border border-[#00F5A0]/30 border-t-[#00F5A0] rounded-full animate-spin"></div>
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <span>Send</span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Compact status messages for all screen sizes */}
                      {(emailError || emailSent) && (
                        <div className="mt-2 text-center">
                          {emailError && (
                            <p className="text-xs text-red-400">{emailError}</p>
                          )}
                          {emailSent && (
                            <p className="text-xs text-[#00F5A0] flex items-center justify-center">
                              <Check className="w-3 h-3 mr-1" />
                              Email sent successfully!
                            </p>
                          )}
                        </div>
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
