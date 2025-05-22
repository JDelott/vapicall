"use client";

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { processImageWithClaude } from '@/utils/imageProcessor';

interface ImageUploaderProps {
  onDescriptionGenerated: (description: string) => void;
}

export default function ImageUploader({ onDescriptionGenerated }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleProcessImage = async () => {
    if (!imagePreview) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processImageWithClaude(imagePreview);
      onDescriptionGenerated(result);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    onDescriptionGenerated(''); // Clear description in parent component
    setError(null);
  };

  return (
    <div className="w-full">
      {!imagePreview ? (
        <div className="border-2 border-dashed border-[#2E2D47] rounded-lg p-4 flex flex-col items-center justify-center bg-[#14152A]/50">
          <Upload className="w-6 h-6 text-[#00F5A0] mb-2" />
          <p className="text-xs text-gray-400 mb-2">
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
        <div>
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 bg-black rounded-md overflow-hidden border border-[#2E2D47] flex items-center justify-center">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="object-contain max-w-full max-h-full"
              />
            </div>
            <div className="flex-grow">
              <div className="mb-2">
                <p className="text-xs text-gray-300">
                  {isProcessing ? 'Processing image...' : 'Image ready to process'}
                </p>
                {error && (
                  <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
              </div>
              <div className="flex gap-2">
                {!isProcessing && (
                  <Button
                    onClick={handleProcessImage}
                    className="text-xs py-1 px-2 bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/90 transition-colors border-none"
                  >
                    Process with AI
                  </Button>
                )}
                {isProcessing && (
                  <Button
                    disabled
                    className="text-xs py-1 px-2 bg-[#00F5A0]/50 text-[#14152A] cursor-not-allowed border-none"
                  >
                    Processing...
                  </Button>
                )}
                <Button
                  onClick={handleClearImage}
                  variant="outline"
                  className="text-xs py-1 px-2 bg-transparent border border-[#2E2D47] text-gray-300 hover:bg-[#1C1D2B] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3 mr-1" />
                  Upload New
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
