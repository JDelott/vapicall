import { NextRequest, NextResponse } from 'next/server';
import { sendSummarySMS } from '@/services/twilioService';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, summary } = await request.json();
    
    if (!phoneNumber || !summary) {
      return NextResponse.json(
        { error: 'Phone number and summary are required' },
        { status: 400 }
      );
    }

    const result = await sendSummarySMS(phoneNumber, summary);
    
    if (result.success) {
      return NextResponse.json({ success: true, messageSid: result.messageSid });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send SMS' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
