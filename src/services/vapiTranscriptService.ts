import { useEffect, useState, useRef } from 'react';
import { generateSummaryWithClaude } from '@/utils/anthropic';

// Service to handle transcript and summary
export default function useTranscriptSummary() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  // Add flags to prevent loops
  const hasSummarized = useRef(false);
  const finalTranscriptRef = useRef('');

  // Generate summary when call ends - with additional safeguards
  useEffect(() => {
    const generateSummary = async () => {
      // Only proceed if call has ended, we have transcript, not already summarizing, 
      // and haven't already summarized this call
      if (callEnded && transcript && !isSummarizing && !hasSummarized.current) {
        // Set flag to prevent future summarization attempts for this call
        hasSummarized.current = true;
        
        // Store the transcript we're working with
        finalTranscriptRef.current = transcript;
        
        setIsSummarizing(true);
        
        try {
          // Get summary from Claude
          const result = await generateSummaryWithClaude(finalTranscriptRef.current);
          setSummary(result);
        } catch (error) {
          console.error('Error generating summary:', error);
          setSummary('Failed to generate summary. Please try again.');
        } finally {
          setIsSummarizing(false);
        }
      }
    };
    
    generateSummary();
  }, [callEnded, transcript, isSummarizing]);

  // Update transcript only if call hasn't ended
  const updateTranscript = (newTranscript: string) => {
    if (!callEnded) {
      setTranscript(newTranscript);
    }
  };

  // Mark call as ended, which triggers summary generation
  const endCall = () => {
    if (!callEnded) {
      // Reset the summarization flag for a new call
      hasSummarized.current = false;
      setCallEnded(true);
    }
  };

  // Reset everything for a new call
  const reset = () => {
    setCallEnded(false);
    setSummary('');
    setTranscript('');
    hasSummarized.current = false;
    finalTranscriptRef.current = '';
  };

  return {
    transcript,
    summary,
    updateTranscript,
    endCall,
    reset,
    isSummarizing
  };
}
