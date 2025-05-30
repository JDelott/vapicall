"use client";

import { useState } from 'react';
import { Upload, X, Settings, Sparkles } from 'lucide-react';
import { processImageWithClaude } from '@/utils/imageProcessor';

interface ImageUploaderProps {
  onDescriptionGenerated: (description: string) => void;
}

export default function ImageUploader({ onDescriptionGenerated }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
        // Auto-show instructions when image is uploaded
        setShowInstructions(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleProcessImage = async () => {
    if (!imagePreview) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processImageWithClaude(imagePreview, customInstructions);
      setAiDescription(result);
      onDescriptionGenerated(result);
      setShowInstructions(false); // Hide instructions after processing
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomInstructions(e.target.value);
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    setAiDescription('');
    setCustomInstructions('');
    setShowInstructions(false);
    onDescriptionGenerated('');
    setError(null);
  };

  const handleReprocess = () => {
    setAiDescription('');
    setShowInstructions(true);
    onDescriptionGenerated('');
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!imagePreview ? (
        <div className="border-2 border-dashed border-[#2E2D47] rounded-lg p-4 flex flex-col items-center justify-center bg-[#14152A]/50 h-full">
          <Upload className="w-6 h-6 text-[#00F5A0] mb-2" />
          <p className="text-xs text-gray-400 mb-2 text-center">
            Upload an image for AI processing
          </p>
          <label className="cursor-pointer">
            <span className="bg-[#1C1D2B] text-[#00F5A0] border border-[#00F5A0] text-xs py-1.5 px-3 rounded-md hover:bg-[#00F5A0]/10 transition-colors inline-block">
              Choose Image
            </span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </label>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Image preview and controls */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-16 h-16 bg-black rounded-md overflow-hidden border border-[#2E2D47] flex items-center justify-center flex-shrink-0">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="object-contain max-w-full max-h-full"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="mb-2">
                <p className="text-xs text-gray-300">
                  {isProcessing ? 'Processing...' : (aiDescription ? 'Complete - see result on right →' : 'Ready')}
                </p>
                {error && (
                  <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
              </div>
              
              {/* Button container with better mobile layout */}
              <div className="flex items-center gap-2">
                {/* Left side buttons - fixed width container */}
                <div className="flex gap-2 flex-1 min-w-0">
                  {!aiDescription && !isProcessing && (
                    <>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-xs px-2.5 py-1.5 bg-[#1C1D2B] text-gray-300 hover:text-[#00F5A0] hover:bg-[#1C1D2B]/80 border border-[#2E2D47] hover:border-[#00F5A0]/30 rounded-md transition-all duration-200 flex items-center whitespace-nowrap"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        {showInstructions ? 'Hide' : 'Setup'}
                      </button>
                      <button
                        onClick={handleProcessImage}
                        className="text-xs px-2.5 py-1.5 bg-[#00F5A0] text-[#14152A] hover:bg-[#00E1C7] rounded-md transition-all duration-200 flex items-center font-medium shadow-sm whitespace-nowrap"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Process
                      </button>
                    </>
                  )}
                  
                  {isProcessing && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        disabled
                        className="text-xs px-2.5 py-1.5 bg-[#00F5A0]/50 text-[#14152A] cursor-not-allowed rounded-md flex items-center whitespace-nowrap"
                      >
                        <div className="w-3 h-3 mr-1 border border-[#14152A] border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </button>
                    </div>
                  )}
                  
                  {aiDescription && (
                    <button
                      onClick={handleReprocess}
                      className="text-xs px-2.5 py-1.5 bg-[#1C1D2B] text-gray-300 hover:text-[#00F5A0] hover:bg-[#1C1D2B]/80 border border-[#2E2D47] hover:border-[#00F5A0]/30 rounded-md transition-all duration-200 flex items-center whitespace-nowrap"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Reprocess
                    </button>
                  )}
                </div>
                
                {/* X button - always positioned consistently */}
                <button
                  onClick={handleClearImage}
                  className="text-xs p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all duration-200 flex items-center flex-shrink-0 ml-auto"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Instructions input section - more space from bottom border */}
          {showInstructions && !aiDescription && (
            <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-md p-4 pb-6 flex-grow overflow-hidden">
              <h4 className="text-xs font-medium text-[#00F5A0] mb-3">Processing Instructions</h4>
              <textarea
                placeholder="What do you want to know about this image?"
                value={customInstructions}
                onChange={handleInstructionsChange}
                className="w-full h-12 bg-[#14152A] border border-[#2E2D47] rounded-md px-3 py-2 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00F5A0] focus:border-[#00F5A0] resize-none"
                style={{
                  fontSize: '16px', // Prevents zoom on iOS
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onBlur={() => {
                  // Force viewport reset on blur for mobile
                  if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                  }
                }}
              />
            </div>
          )}

          {/* Simple completion message when processing is done */}
          {aiDescription && !showInstructions && (
            <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-md p-3 flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-[#00F5A0]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-4 h-4 text-[#00F5A0]" />
                </div>
                <p className="text-xs text-gray-300 mb-1">Processing Complete!</p>
                <p className="text-xs text-gray-500">View result and send to conversation on the right →</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
