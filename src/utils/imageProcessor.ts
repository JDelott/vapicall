// Client-side utility for calling our image processing API route
export async function processImageWithClaude(imageBase64: string): Promise<string> {
  try {
    console.log('Sending image to process API...');
    
    const response = await fetch('/api/processImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image processing API error:', errorData);
      return `Failed to process image: ${errorData.error || response.statusText}`;
    }
    
    const data = await response.json();
    console.log('Description received from API');
    
    if (!data.description) {
      return 'No description was generated';
    }
    
    return data.description;
  } catch (error) {
    console.error('Error calling image processing API:', error);
    return 'Error connecting to image processing service';
  }
}
