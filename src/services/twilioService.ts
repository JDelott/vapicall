import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSummarySMS(phoneNumber: string, summaryText: string): Promise<{
  success: boolean;
  messageSid?: string;
  error?: string;
}> {
  try {
    const message = await client.messages.create({
      body: summaryText,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    return { success: true, messageSid: message.sid };
  } catch (error: unknown) {
    console.error('Error sending SMS:', error);
    // Handle the error properly with type checking
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}
