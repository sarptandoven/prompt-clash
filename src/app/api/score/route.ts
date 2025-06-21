import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'Replicate API token not found' }, { status: 500 });
  }

  const { imageUrl, prompt } = await req.json();

  if (!imageUrl || !prompt) {
    return NextResponse.json({ error: 'Image URL and prompt are required' }, { status: 400 });
  }

  try {
    const output = await replicate.run(
      "methexis-inc/clip-interrogator-2:009633c152a5b285a8542d244a6757b65345755b41295781a7cd58ac01e40348",
      {
        input: {
          image: imageUrl,
          prompt: prompt,
        },
      }
    );
    // The model returns a single string like "score: 0.87". We need to parse it.
    if (typeof output === 'string' && output.includes('score:')) {
        const score = parseFloat(output.split('score:')[1].trim());
        return NextResponse.json({ score });
    }

    const score = (output as number[])[0]

    return NextResponse.json({ score });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred during scoring' }, { status: 500 });
  }
} 