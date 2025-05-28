import { NextRequest, NextResponse } from 'next/server';
import { UpdateGlobalAssistantRequest } from '@/types/assistant';
import { AssistantStore } from '@/lib/assistantStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = AssistantStore.getInstance();
    const assistant = store.getById(params.id);
    
    if (!assistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ assistant });
  } catch (error) {
    console.error('Error fetching assistant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assistant' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateGlobalAssistantRequest = await request.json();
    
    const store = AssistantStore.getInstance();
    const updatedAssistant = store.update(params.id, body);
    
    if (!updatedAssistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ assistant: updatedAssistant });
  } catch (error) {
    console.error('Error updating assistant:', error);
    return NextResponse.json(
      { error: 'Failed to update assistant' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = AssistantStore.getInstance();
    const success = store.deactivate(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Assistant deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating assistant:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate assistant' },
      { status: 500 }
    );
  }
}
