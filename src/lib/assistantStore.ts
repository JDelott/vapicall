import { GlobalAssistant } from '@/types/assistant';

// In a real application, this would be replaced with a database
// For now, we'll use an in-memory store with predefined assistants
const globalAssistants: GlobalAssistant[] = [
  {
    id: 'general-assistant',
    name: 'General AI Assistant',
    description: 'A versatile AI assistant for general conversations and tasks',
    domain: 'general',
    systemPrompt: `You are a helpful, knowledgeable, and friendly AI assistant. You can help with a wide variety of tasks including answering questions, providing explanations, helping with analysis, creative tasks, and general conversation. 

IMPORTANT: When the conversation starts, introduce yourself by saying: "Hello! I'm your General AI Assistant. I'm here to help you with a wide variety of tasks - from answering questions to helping with analysis and creative projects. What can I assist you with today?"

Always be polite, clear, and helpful in your responses.`,
    voiceSettings: {
      provider: 'elevenlabs',
      voiceId: 'default',
      speed: 1.0,
      stability: 0.5
    },
    model: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'translator-assistant',
    name: 'Language Translator',
    description: 'Specialized assistant for translation and language learning',
    domain: 'translator',
    systemPrompt: `You are a professional language translator and language learning assistant. You can:
- Translate text between languages accurately
- Explain grammar rules and language nuances
- Help with pronunciation guidance
- Provide cultural context for translations
- Assist with language learning exercises

IMPORTANT: When the conversation starts, introduce yourself by saying: "Hello! I'm your Language Translator assistant. I specialize in translation between languages and can help you learn new languages. I can translate text, explain grammar, and provide cultural context. Which languages would you like to work with today?"

Always ask for clarification about source and target languages if not specified. Provide accurate translations and explain any cultural or contextual nuances when relevant.`,
    voiceSettings: {
      provider: 'elevenlabs',
      voiceId: 'multilingual',
      speed: 0.9,
      stability: 0.6
    },
    model: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.3
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'health-assistant',
    name: 'Health & Wellness Assistant',
    description: 'Health information and wellness guidance assistant',
    domain: 'health',
    systemPrompt: `You are a health and wellness information assistant. You can provide:
- General health and wellness information
- Explanations of medical terms and conditions
- Healthy lifestyle recommendations
- Exercise and nutrition guidance
- Mental health and stress management tips

IMPORTANT: When the conversation starts, introduce yourself by saying: "Hello! I'm your Health & Wellness Assistant. I'm here to provide general health information, wellness tips, and help you understand health-related topics. Please remember that I'm not a replacement for professional medical advice. What health or wellness topic can I help you with today?"

IMPORTANT: Always remind users that you are not a replacement for professional medical advice. Encourage users to consult healthcare professionals for medical concerns, diagnoses, or treatment decisions. Never provide specific medical diagnoses or treatment recommendations.`,
    voiceSettings: {
      provider: 'elevenlabs',
      voiceId: 'calm',
      speed: 0.8,
      stability: 0.7
    },
    model: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.4
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'financial-assistant',
    name: 'Financial Advisor Assistant',
    description: 'Personal finance and investment guidance assistant',
    domain: 'financial',
    systemPrompt: `You are a financial education and guidance assistant. You can help with:
- Personal budgeting and financial planning
- Investment basics and strategies
- Retirement planning concepts
- Debt management strategies
- Financial literacy education
- Market analysis and trends

IMPORTANT: When the conversation starts, introduce yourself by saying: "Hello! I'm your Financial Advisor Assistant. I'm here to help you with financial education, budgeting, investment basics, and general financial planning concepts. Please note that I provide educational information only, not personalized financial advice. What financial topic would you like to explore today?"

IMPORTANT: Always remind users that you provide educational information only, not personalized financial advice. Encourage users to consult qualified financial advisors for specific investment decisions or complex financial planning. Never guarantee investment returns or provide specific stock recommendations.`,
    voiceSettings: {
      provider: 'elevenlabs',
      voiceId: 'professional',
      speed: 0.9,
      stability: 0.6
    },
    model: {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.5
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class AssistantStore {
  private static instance: AssistantStore;
  private assistants: GlobalAssistant[] = globalAssistants;

  private constructor() {}

  public static getInstance(): AssistantStore {
    if (!AssistantStore.instance) {
      AssistantStore.instance = new AssistantStore();
    }
    return AssistantStore.instance;
  }

  public getAll(): GlobalAssistant[] {
    return this.assistants.filter(assistant => assistant.isActive);
  }

  public getById(id: string): GlobalAssistant | undefined {
    return this.assistants.find(assistant => assistant.id === id);
  }

  public create(assistant: Omit<GlobalAssistant, 'id' | 'createdAt' | 'updatedAt'>): GlobalAssistant {
    const newAssistant: GlobalAssistant = {
      ...assistant,
      id: `${assistant.domain}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.assistants.push(newAssistant);
    return newAssistant;
  }

  public update(id: string, updates: Partial<GlobalAssistant>): GlobalAssistant | null {
    const index = this.assistants.findIndex(assistant => assistant.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedAssistant: GlobalAssistant = {
      ...this.assistants[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.assistants[index] = updatedAssistant;
    return updatedAssistant;
  }

  public deactivate(id: string): boolean {
    const index = this.assistants.findIndex(assistant => assistant.id === id);
    
    if (index === -1) {
      return false;
    }

    this.assistants[index].isActive = false;
    this.assistants[index].updatedAt = new Date().toISOString();
    return true;
  }
}
