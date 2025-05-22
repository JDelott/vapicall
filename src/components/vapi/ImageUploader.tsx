"use client";

import { useState } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { processImageWithClaude } from '@/utils/imageProcessor';

interface ImageUploaderProps {
  onDescriptionGenerated: (description: string) => void;
}

export default function ImageUploader({ onDescriptionGenerated }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setDescription(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
    
    // Create a preview
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
      setDescription(result);
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
    setDescription(null);
    setError(null);
  };

  return (
    <div className="w-full bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
        <ImageIcon className="w-4 h-4 mr-2" />
        Image Processing
      </h3>
      
      {!imagePreview ? (
        <>
          <div className="border-2 border-dashed border-[#2E2D47] rounded-lg p-6 flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-[#00F5A0] mb-2" />
            <p className="text-sm text-gray-400 mb-3">Upload an image for Claude to process</p>
            <label className="cursor-pointer">
              <span className="bg-[#00F5A0] text-[#14152A] text-sm py-2 px-4 rounded-md hover:bg-[#00F5A0]/80 transition-colors">
                Choose Image
              </span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </>
      ) : (
        <div>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-black rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              {description ? (
                <div className="bg-[#14152A] p-3 rounded-md text-sm text-gray-300 max-h-48 overflow-y-auto mb-3">
                  <div className="flex items-center gap-1 mb-1 text-[#00F5A0]">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Claude&apos;s description</span>
                  </div>
                  {description}
                </div>
              ) : (
                <div className="mb-3">
                  <p className="text-sm text-gray-300">Image ready to process</p>
                  {error && (
                    <p className="text-red-400 text-sm mt-1">{error}</p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                {!description && (
                  <Button
                    onClick={handleProcessImage}
                    disabled={isProcessing}
                    className={`text-xs py-1.5 px-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? 'Processing...' : 'Process with Claude'}
                  </Button>
                )}
                <Button
                  onClick={handleClearImage}
                  variant="outline"
                  className="text-xs py-1.5 px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  {description ? 'Upload New Image' : 'Cancel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
