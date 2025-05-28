export interface GlobalAssistant {
  id: string;
  name: string;
  description: string;
  domain: AssistantDomain;
  systemPrompt: string;
  voiceSettings?: {
    provider?: string;
    voiceId?: string;
    speed?: number;
    stability?: number;
  };
  model?: {
    provider?: string;
    model?: string;
    temperature?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AssistantDomain = 
  | 'general'
  | 'translator'
  | 'health'
  | 'financial'
  | 'legal'
  | 'education'
  | 'technical'
  | 'creative';

export interface AssistantConfig {
  assistantId?: string;
  globalAssistant?: GlobalAssistant;
  overrides?: {
    systemPrompt?: string;
    voiceSettings?: GlobalAssistant['voiceSettings'];
    model?: GlobalAssistant['model'];
  };
}

export interface CreateGlobalAssistantRequest {
  name: string;
  description: string;
  domain: AssistantDomain;
  systemPrompt: string;
  voiceSettings?: GlobalAssistant['voiceSettings'];
  model?: GlobalAssistant['model'];
}

export interface UpdateGlobalAssistantRequest extends Partial<CreateGlobalAssistantRequest> {
  id: string;
  isActive?: boolean;
}
