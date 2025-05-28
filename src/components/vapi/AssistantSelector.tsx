"use client";

import { useState } from 'react';
import { ChevronDown, Bot, Globe, Heart, DollarSign, Scale, GraduationCap, Code, Palette } from 'lucide-react';
import { GlobalAssistant, AssistantDomain } from '@/types/assistant';

interface AssistantSelectorProps {
  assistants: GlobalAssistant[];
  selectedAssistant: GlobalAssistant | null;
  onSelectAssistant: (assistant: GlobalAssistant) => void;
  disabled?: boolean;
}

const domainIcons: Record<AssistantDomain, React.ComponentType<{ className?: string }>> = {
  general: Bot,
  translator: Globe,
  health: Heart,
  financial: DollarSign,
  legal: Scale,
  education: GraduationCap,
  technical: Code,
  creative: Palette,
};

const domainColors: Record<AssistantDomain, string> = {
  general: 'text-[#00F5A0]',
  translator: 'text-blue-400',
  health: 'text-red-400',
  financial: 'text-green-400',
  legal: 'text-purple-400',
  education: 'text-yellow-400',
  technical: 'text-orange-400',
  creative: 'text-pink-400',
};

export default function AssistantSelector({ 
  assistants, 
  selectedAssistant, 
  onSelectAssistant, 
  disabled = false 
}: AssistantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAssistant = (assistant: GlobalAssistant) => {
    onSelectAssistant(assistant);
    setIsOpen(false);
  };

  const getDomainIcon = (domain: AssistantDomain) => {
    const IconComponent = domainIcons[domain];
    return IconComponent;
  };

  const getDomainColor = (domain: AssistantDomain) => {
    return domainColors[domain];
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 bg-[#1C1D2B] border border-[#2E2D47] rounded-lg text-left transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-[#00F5A0]/30 hover:bg-[#1C1D2B]/80'
        }`}
      >
        <div className="flex items-center space-x-3">
          {selectedAssistant && (
            <>
              {(() => {
                const IconComponent = getDomainIcon(selectedAssistant.domain);
                return <IconComponent className={`w-4 h-4 ${getDomainColor(selectedAssistant.domain)}`} />;
              })()}
              <div>
                <p className="text-sm font-medium text-white">{selectedAssistant.name}</p>
                <p className="text-xs text-gray-400 capitalize">{selectedAssistant.domain}</p>
              </div>
            </>
          )}
          {!selectedAssistant && (
            <div className="flex items-center space-x-3">
              <Bot className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-400">Select Assistant</p>
                <p className="text-xs text-gray-500">Choose a specialized assistant</p>
              </div>
            </div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {assistants.map((assistant) => {
            const IconComponent = getDomainIcon(assistant.domain);
            return (
              <button
                key={assistant.id}
                onClick={() => handleSelectAssistant(assistant)}
                className={`w-full flex items-center space-x-3 p-3 text-left hover:bg-[#14152A] transition-colors border-b border-[#2E2D47] last:border-b-0 ${
                  selectedAssistant?.id === assistant.id ? 'bg-[#14152A]' : ''
                }`}
              >
                <IconComponent className={`w-4 h-4 ${getDomainColor(assistant.domain)}`} />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-white truncate">{assistant.name}</p>
                  <p className="text-xs text-gray-400 truncate">{assistant.description}</p>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">{assistant.domain}</p>
                </div>
                {selectedAssistant?.id === assistant.id && (
                  <div className="w-2 h-2 bg-[#00F5A0] rounded-full flex-shrink-0"></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
