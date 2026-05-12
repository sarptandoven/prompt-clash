import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'Replicate API token not found' }, { status: 500 });
  }

  const replicate = new Replicate({ auth: apiToken });

  const { imageUrl, prompt } = await req.json();

  if (!imageUrl || !prompt) {
    return NextResponse.json({ error: 'Image URL and prompt are required' }, { status: 400 });
  }

  try {
    const output: unknown = await replicate.run(
      "methexis-inc/clip-interrogator-2:009633c152a5b285a8542d244a6757b65345755b41295781a7cd58ac01e40348",
      {
        input: {
          image: imageUrl,
          prompt,
        },
      }
    );

    // The model can return a string like "score: 0.87" or an array with a numeric score.
    if (typeof output === 'string' && output.includes('score:')) {
      const score = parseFloat(output.split('score:')[1].trim());
      return NextResponse.json({ score });
    }

    if (Array.isArray(output) && typeof output[0] === 'number') {
      return NextResponse.json({ score: output[0] });
    }

    return NextResponse.json({ error: 'Unexpected scoring response' }, { status: 502 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred during scoring' }, { status: 500 });
  }
} 