// Client-side utility for calling our API route
export async function generateSummaryWithClaude(transcript: string): Promise<string> {
  try {
   
    
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Summary API error:', errorData);
      return `Failed to generate summary: ${errorData.error || response.statusText}`;
    }
    
    const data = await response.json();
    
    
    if (!data.summary) {
      return 'No summary was generated';
    }
    
    return data.summary;
  } catch (error) {
    console.error('Error calling summary API:', error);
    return 'Error connecting to summary service';
  }
}
