import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not found' }, { status: 500 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a creative assistant for a fantasy battle game. Your task is to generate two distinct items in JSON format: an "arenaTheme" and an "aiAbilityPrompt". The arena theme should be a short, imaginative setting (e.g., "A floating market in a nebula"). The AI ability prompt should be exactly 5 words describing a magical power (e.g., "Summons vines from the earth"). Respond only with the JSON object.`,
        },
        {
          role: 'user',
          content: 'Generate a new arena and AI ability.',
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 1.2,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    // Parse the JSON content
    const data = JSON.parse(content);

    if (!data.arenaTheme || !data.aiAbilityPrompt) {
        return NextResponse.json({ error: 'Failed to generate valid prompts from OpenAI' }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error generating prompts from OpenAI:', error);
    return NextResponse.json({ error: 'An error occurred while generating the prompts' }, { status: 500 });
  }
} 