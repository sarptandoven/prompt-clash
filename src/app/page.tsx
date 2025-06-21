'use client'
import { useState } from 'react'
import AvatarCard from '@/components/AvatarCard' // Assuming this component exists and can display an image

const GODOT_SCRIPT_TEMPLATE = (params: any) => `
extends Node

@onready var http_request = $HTTPRequest

func _ready():
    generate_character()

func generate_character():
    var url = "http://localhost:3000/api/generate"
    var headers = ["Content-Type: application/json"]
    var body = ${JSON.stringify(params, null, 4)
      .replace(/"/g, '""')
      .split('\n')
      .map((l, i) => (i === 0 ? l : `    ${l}`))
      .join('\n')}

    var error = http_request.request(url, headers, HTTPClient.METHOD_POST, JSON.stringify(body))
    if error != OK:
        print("An error occurred in the HTTP request.")

func _on_request_completed(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        if json:
            print("Image generated successfully!")
            print("URL: ", json.imageUrl)
            # You can now download the image from the URL
            # and apply it as a texture in your game.
        else:
            print("Failed to parse JSON response.")
    else:
        print("Request failed with code: ", response_code)
        print("Response: ", body.get_string_from_utf8())
`;

export default function Home() {
  const [prompt, setPrompt] = useState('A viking warrior, horned helmet, braided beard, cinematic');
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, bad anatomy, worst quality');
  const [seed, setSeed] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setLastResponse(null);

    const params: any = {
      prompt,
      negative_prompt: negativePrompt,
    };
    if (seed) {
      params.seed = seed;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setImageUrl(data.imageUrl);
      setLastResponse(data);

    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
    setIsGenerating(false);
  }

  const getGodotScript = () => {
    const params: any = { prompt, negative_prompt: negativePrompt };
    if (seed) params.seed = seed;
    return GODOT_SCRIPT_TEMPLATE(params);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8 flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Godot Character Generator
          </h1>
          <p className="text-xl text-gray-400">
            Use this dashboard to test prompts and generate characters for your Godot project.
          </p>
        </div>
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">Generation Parameters</h2>
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-300">Prompt</label>
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A futuristic cyborg with glowing red eyes"
                className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                rows={4}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-300">Negative Prompt</label>
                <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g., blurry, deformed, bad anatomy"
                className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                rows={3}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-300">Seed (Optional)</label>
                <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter a number for reproducible results"
                className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                />
            </div>
            <button 
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 self-start">Result</h2>
                <AvatarCard imgUrl={imageUrl} name="Generated Character" />
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Godot Integration</h3>
              <div className="bg-gray-900 rounded-md p-4 max-h-96 overflow-auto">
                <pre><code>{getGodotScript()}</code></pre>
              </div>
            </div>

          </div>
        </div>
        
        {lastResponse && (
            <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Last API Response</h3>
                <div className="bg-gray-900 rounded-md p-4 max-h-60 overflow-auto">
                    <pre><code>{JSON.stringify(lastResponse, null, 2)}</code></pre>
                </div>
            </div>
        )}

      </div>
    </div>
  )
}
