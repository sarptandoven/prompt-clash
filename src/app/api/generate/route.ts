import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Replicate API token not found" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { 
    prompt, 
    input_image, 
    negative_prompt = "blurry, deformed, bad anatomy, worst quality",
    width = 1024,
    height = 1024,
    num_inference_steps = 30,
    guidance_scale = 7.5,
    seed = null
  } = body;

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required" }, 
      { status: 400 }
    );
  }

  const input: any = {
    prompt,
    negative_prompt,
    width,
    height,
    num_inference_steps,
    guidance_scale,
  };

  if (input_image) {
    input.input_image = input_image;
  }
  
  if (seed) {
    input.seed = parseInt(seed, 10);
  }

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-kontext-pro:3c3fd5f8c61633a04e84b2d1748348d348a21f786a347b4d13f9cb97449b6b90",
      { input }
    );

    let imageUrl;
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
    
    return NextResponse.json({
        imageUrl,
        input,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "An error occurred while generating the image" }, 
        { status: 500 }
    );
  }
} 