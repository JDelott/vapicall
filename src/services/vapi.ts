import Vapi from "@vapi-ai/web";
import type { AddMessageMessage } from "@vapi-ai/web";

// Define the event names since they're not properly exported
type VapiEventName = 'call-end' | 'call-start' | 'volume-level' | 'speech-start' | 
                     'speech-end' | 'message' | 'video' | 'error' | 'daily-participant-updated';

// Define event listener functions - we define specific callbacks without an index signature
type EventListenerMap = {
  'call-end': () => void;
  'call-start': () => void;
  'volume-level': (volume: number) => void;
  'speech-start': () => void;
  'speech-end': () => void;
  'message': (message: unknown) => void;
  'error': (error: unknown) => void;
  'video': (track: MediaStreamTrack) => void;
  'daily-participant-updated': (participant: unknown) => void;
};

class VapiService {
  private static instance: VapiService;
  private client: Vapi | null = null;
  private assistantId: string;
  private isInitialized: boolean = false;

  private constructor() {
    this.assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    
    if (typeof window !== 'undefined' && apiKey) {
      try {
        this.client = new Vapi(apiKey);
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize Vapi client:', error);
      }
    }
  }

  public static getInstance(): VapiService {
    if (!VapiService.instance) {
      VapiService.instance = new VapiService();
    }
    return VapiService.instance;
  }

  /**
   * Start a call with the Vapi assistant
   */
  public async startCall() {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return null;
    }

    try {
      const call = await this.client.start(this.assistantId);
      return call;
    } catch (error) {
      console.error('Failed to start Vapi call:', error);
      return null;
    }
  }

  /**
   * Stop an ongoing call
   */
  public stopCall() {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return;
    }

    try {
      this.client.stop();
    } catch (error) {
      console.error('Failed to stop Vapi call:', error);
    }
  }

  /**
   * Send a message during an active call
   */
  public sendMessage(content: string, role: 'system' | 'user' = 'system') {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return;
    }

    const message: AddMessageMessage = {
      type: "add-message",
      message: {
        role,
        content,
      }
    };

    try {
      this.client.send(message);
    } catch (error) {
      console.error('Failed to send Vapi message:', error);
    }
  }

  /**
   * Toggle mute status
   */
  public toggleMute(muted?: boolean) {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return;
    }

    try {
      if (typeof muted === 'boolean') {
        this.client.setMuted(muted);
      } else {
        this.client.setMuted(!this.client.isMuted());
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  }

  /**
   * Check if user is muted
   */
  public isMuted() {
    if (!this.isInitialized || !this.client) {
      return false;
    }
    return this.client.isMuted();
  }

  /**
   * Add event listener for Vapi events
   */
  public on<E extends VapiEventName>(eventName: E, callback: EventListenerMap[E]) {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return;
    }

    try {
      // Need to use type assertions due to API limitations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client.on(eventName as any, callback as unknown as (...args: unknown[]) => void);
    } catch (error) {
      console.error(`Failed to add event listener for ${eventName}:`, error);
    }
  }

  /**
   * Remove event listener for Vapi events
   */
  public off<E extends VapiEventName>(eventName: E, callback: EventListenerMap[E]) {
    if (!this.isInitialized || !this.client) {
      console.error('Vapi client not initialized');
      return;
    }

    try {
      // Check if the client has an off method
      if (typeof this.client.off === 'function') {
        // Need to use type assertions due to API limitations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.client.off(eventName as string, callback as unknown as (...args: unknown[]) => void);
      }
    } catch (error) {
      console.error(`Failed to remove event listener for ${eventName}:`, error);
    }
  }
}

export default VapiService;
