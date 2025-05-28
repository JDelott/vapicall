import { NextRequest, NextResponse } from 'next/server';
import { CreateGlobalAssistantRequest } from '@/types/assistant';
import { AssistantStore } from '@/lib/assistantStore';

export async function GET() {
  try {
    const store = AssistantStore.getInstance();
    const assistants = store.getAll();
    return NextResponse.json({ assistants });
  } catch (error) {
    console.error('Error fetching assistants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assistants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateGlobalAssistantRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.domain || !body.systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, domain, systemPrompt' },
        { status: 400 }
      );
    }

    const store = AssistantStore.getInstance();
    const newAssistant = store.create({
      name: body.name,
      description: body.description,
      domain: body.domain,
      systemPrompt: body.systemPrompt,
      voiceSettings: body.voiceSettings || {
        provider: 'elevenlabs',
        voiceId: 'default',
        speed: 1.0,
        stability: 0.5
      },
      model: body.model || {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
      },
      isActive: true
    });

    return NextResponse.json({ assistant: newAssistant }, { status: 201 });
  } catch (error) {
    console.error('Error creating assistant:', error);
    return NextResponse.json(
      { error: 'Failed to create assistant' },
      { status: 500 }
    );
  }
}
