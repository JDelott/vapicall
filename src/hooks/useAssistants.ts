import { useState, useEffect } from 'react';
import { GlobalAssistant, AssistantDomain } from '@/types/assistant';
import AssistantService from '@/services/assistantService';

export function useAssistants() {
  const [assistants, setAssistants] = useState<GlobalAssistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<GlobalAssistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const assistantService = AssistantService.getInstance();

  // Load assistants on mount
  useEffect(() => {
    loadAssistants();
  }, []);

  const loadAssistants = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAssistants = await assistantService.getGlobalAssistants();
      setAssistants(fetchedAssistants);
      
      // Set default assistant (general) if none selected
      if (!selectedAssistant && fetchedAssistants.length > 0) {
        const defaultAssistant = fetchedAssistants.find(a => a.domain === 'general') || fetchedAssistants[0];
        setSelectedAssistant(defaultAssistant);
      }
    } catch (err) {
      setError('Failed to load assistants');
      console.error('Error loading assistants:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAssistant = (assistant: GlobalAssistant | null) => {
    setSelectedAssistant(assistant);
  };

  const selectAssistantByDomain = (domain: AssistantDomain) => {
    const assistant = assistants.find(a => a.domain === domain);
    if (assistant) {
      setSelectedAssistant(assistant);
    }
  };

  const getAssistantsByDomain = (domain: AssistantDomain) => {
    return assistants.filter(a => a.domain === domain);
  };

  return {
    assistants,
    selectedAssistant,
    loading,
    error,
    loadAssistants,
    selectAssistant,
    selectAssistantByDomain,
    getAssistantsByDomain,
  };
}
