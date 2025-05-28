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
        
        // Add debugging
        console.log('Starting summary generation...');
        console.log('Transcript length:', transcript.length);
        console.log('Transcript preview:', transcript.substring(0, 200) + '...');
        
        setIsSummarizing(true);
        
        try {
          // Check if transcript has meaningful content
          if (transcript.trim().length < 10) {
            console.warn('Transcript too short for meaningful summary');
            setSummary('The conversation was too brief to generate a meaningful summary.');
            return;
          }
          
          // Get summary from Claude
          const result = await generateSummaryWithClaude(finalTranscriptRef.current);
          console.log('Summary generated successfully');
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
      console.log('Transcript updated:', newTranscript.length, 'characters');
      setTranscript(newTranscript);
    }
  };

  // Mark call as ended, which triggers summary generation
  const endCall = () => {
    if (!callEnded) {
      console.log('Call ended, final transcript length:', transcript.length);
      // Add a small delay to ensure we have the final transcript
      setTimeout(() => {
        setCallEnded(true);
      }, 1000);
    }
  };

  // Reset everything for a new call
  const reset = () => {
    console.log('Resetting transcript service for new call');
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
