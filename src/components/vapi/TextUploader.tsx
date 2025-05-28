"use client";

import { useState } from 'react';
import { Edit3 } from 'lucide-react';

interface TextUploaderProps {
  onTextReady: (text: string) => void;
}

export default function TextUploader({ onTextReady }: TextUploaderProps) {
  const [textContent, setTextContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1 * 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }
    
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError('File must be a text file (.txt, .md, or other text format)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        setTextContent(content);
        onTextReady(content);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setTextContent(content);
    onTextReady(content);
  };

  const handleClearText = () => {
    setTextContent('');
    onTextReady('');
    setError(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1C1D2B] border border-[#2E2D47] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#2E2D47]">
        <div className="flex items-center">
          <Edit3 className="w-4 h-4 text-[#00F5A0] mr-2" />
          <span className="text-xs font-medium text-gray-300">Text Input</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <span className="text-xs text-[#00F5A0] hover:text-[#00E1C7] transition-colors">
              Upload File
            </span>
            <input 
              type="file" 
              accept=".txt,.md,text/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          {textContent && (
            <>
              <span className="text-gray-600">|</span>
              <button
                onClick={handleClearText}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-3">
        <textarea
          placeholder="Type your message or upload a text file..."
          value={textContent}
          onChange={handleTextChange}
          className="w-full h-full bg-transparent border-none text-xs text-gray-300 placeholder-gray-500 focus:outline-none resize-none"
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

      {/* Footer */}
      {(error || textContent) && (
        <div className="px-3 pb-3">
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}
          {textContent && !error && (
            <p className="text-xs text-gray-500">
              {textContent.length} characters
            </p>
          )}
        </div>
      )}
    </div>
  );
}
