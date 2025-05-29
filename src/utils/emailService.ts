export interface EmailData {
  email: string;
  transcript?: string;
  summary?: string;
}

export async function sendConversationEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email API error:', errorData);
      return { 
        success: false, 
        error: errorData.error || 'Failed to send email' 
      };
    }
    
    await response.json(); // Consume response body
    return { success: true };
    
  } catch (error) {
    console.error('Error calling email API:', error);
    return { 
      success: false, 
      error: 'Error connecting to email service' 
    };
  }
}
