import { GlobalAssistant, CreateGlobalAssistantRequest, UpdateGlobalAssistantRequest, AssistantConfig } from '@/types/assistant';

class AssistantService {
  private static instance: AssistantService;
  private baseUrl = '/api/assistants';

  private constructor() {}

  public static getInstance(): AssistantService {
    if (!AssistantService.instance) {
      AssistantService.instance = new AssistantService();
    }
    return AssistantService.instance;
  }

  /**
   * Fetch all active global assistants
   */
  public async getGlobalAssistants(): Promise<GlobalAssistant[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch assistants');
      }
      const data = await response.json();
      return data.assistants;
    } catch (error) {
      console.error('Error fetching global assistants:', error);
      throw error;
    }
  }

  /**
   * Get a specific global assistant by ID
   */
  public async getGlobalAssistant(id: string): Promise<GlobalAssistant> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assistant');
      }
      const data = await response.json();
      return data.assistant;
    } catch (error) {
      console.error('Error fetching global assistant:', error);
      throw error;
    }
  }

  /**
   * Create a new global assistant
   */
  public async createGlobalAssistant(assistant: CreateGlobalAssistantRequest): Promise<GlobalAssistant> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistant),
      });

      if (!response.ok) {
        throw new Error('Failed to create assistant');
      }

      const data = await response.json();
      return data.assistant;
    } catch (error) {
      console.error('Error creating global assistant:', error);
      throw error;
    }
  }

  /**
   * Update a global assistant
   */
  public async updateGlobalAssistant(assistant: UpdateGlobalAssistantRequest): Promise<GlobalAssistant> {
    try {
      const response = await fetch(`${this.baseUrl}/${assistant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistant),
      });

      if (!response.ok) {
        throw new Error('Failed to update assistant');
      }

      const data = await response.json();
      return data.assistant;
    } catch (error) {
      console.error('Error updating global assistant:', error);
      throw error;
    }
  }

  /**
   * Deactivate a global assistant
   */
  public async deactivateGlobalAssistant(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate assistant');
      }
    } catch (error) {
      console.error('Error deactivating global assistant:', error);
      throw error;
    }
  }

  /**
   * Get assistant configuration for Vapi
   * This will either return the default assistant ID or create a dynamic assistant
   */
  public getAssistantConfig(globalAssistant?: GlobalAssistant): AssistantConfig {
    if (!globalAssistant) {
      // Return default assistant configuration
      return {
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      };
    }

    // Return configuration with global assistant overrides
    return {
      globalAssistant,
      overrides: {
        systemPrompt: globalAssistant.systemPrompt,
        voiceSettings: globalAssistant.voiceSettings,
        model: globalAssistant.model,
      },
    };
  }
}

export default AssistantService;
