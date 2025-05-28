import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    console.log('Summarize API called with transcript length:', transcript?.length || 0);
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    // Check if transcript is meaningful
    if (transcript.trim().length < 10) {
      return NextResponse.json(
        { summary: 'The conversation was too brief to generate a meaningful summary.' }
      );
    }

    // Make sure we have an API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('Server: Claude API key missing');
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    console.log('Server: Calling Claude API');
    
    // Call the Anthropic Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Please provide a concise, clear summary of this conversation transcript. 
            Format it with sections like "Main Topics", "Key Points", and "Conclusion".
            Keep your summary factual and based only on what was discussed in the transcript.
            
            Here is the complete conversation transcript:
            
            ${transcript}`
          }
        ]
      })
    });
    
    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'Claude API error: ' + claudeResponse.statusText },
        { status: claudeResponse.status }
      );
    }
    
    const claudeData = await claudeResponse.json();
    console.log('Server: Claude API call successful');
    
    if (!claudeData.content || !claudeData.content[0] || !claudeData.content[0].text) {
      console.error('Claude response missing content:', claudeData);
      return NextResponse.json(
        { error: 'Invalid response from Claude API' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ summary: claudeData.content[0].text });
  } catch (error) {
    console.error('Server error in /api/summarize:', error);
    return NextResponse.json(
      { error: 'Server error processing request' },
      { status: 500 }
    );
  }
}
