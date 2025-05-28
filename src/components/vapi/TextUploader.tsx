"use client";
import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import Button from '@/components/ui/Button';

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
    
    if (file.size > 1 * 1024 * 1024) { // 1MB limit for text files
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
    <div className="w-full h-full flex flex-col">
      {!textContent ? (
        <div className="border-2 border-dashed border-[#2E2D47] rounded-lg p-4 flex flex-col items-center justify-center bg-[#14152A]/50 h-full">
          <FileText className="w-6 h-6 text-[#00F5A0] mb-2" />
          <p className="text-xs text-gray-400 mb-2 text-center">
            Upload a text file or type your message
          </p>
          <label className="cursor-pointer mb-3">
            <span className="bg-[#1C1D2B] text-[#00F5A0] border border-[#00F5A0] text-xs py-1.5 px-3 rounded-md hover:bg-[#00F5A0]/10 transition-colors inline-block">
              Choose File
            </span>
            <input 
              type="file" 
              accept=".txt,.md,text/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          
          <div className="w-full border-t border-[#2E2D47] pt-3">
            <textarea
              placeholder="Or type your message here..."
              value={textContent}
              onChange={handleTextChange}
              className="w-full h-16 bg-[#1C1D2B] border border-[#2E2D47] rounded-md px-3 py-2 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00F5A0] focus:border-[#00F5A0] resize-none"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="bg-[#14152A] border border-[#2E2D47] rounded-md p-3 mb-3 flex-grow overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-[#00F5A0]">Text Content</h4>
              <span className="text-xs text-gray-500">{textContent.length} characters</span>
            </div>
            <div className="text-xs text-gray-300 max-h-[100px] overflow-y-auto">
              {textContent}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleClearText}
              variant="outline"
              className="text-xs py-1 px-2 bg-transparent border border-[#2E2D47] text-gray-300 hover:bg-[#1C1D2B] hover:text-white transition-colors"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
