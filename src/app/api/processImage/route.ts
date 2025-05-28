import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, customInstructions } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
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

    console.log('Server: Calling Claude API for image processing');
    
    // Extract the correct mime type from the base64 string
    const mediaTypeMatch = image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (!mediaTypeMatch) {
      return NextResponse.json(
        { error: 'Invalid image format or encoding' },
        { status: 400 }
      );
    }
    
    const mediaType = mediaTypeMatch[1];
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Create the prompt based on whether custom instructions are provided
    let promptText = 'Please describe this image in detail. Include all important visual elements, objects, people, settings, colors, and text you can see.';
    
    if (customInstructions && customInstructions.trim()) {
      promptText = `${customInstructions.trim()}

Please analyze this image with the above context in mind. Provide a detailed and relevant response based on what you see in the image.`;
    }
    
    // Call the Anthropic Claude API with the image
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              }
            ]
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
    
    return NextResponse.json({ description: claudeData.content[0].text });
  } catch (error) {
    console.error('Server error in /api/processImage:', error);
    return NextResponse.json(
      { error: 'Server error processing request' },
      { status: 500 }
    );
  }
}
