'use client'
import { useState, useEffect } from 'react'
import AvatarCard from '@/components/AvatarCard'
import { useSearchParams } from 'next/navigation';

// Helper to call our image generation API
const generateImage = async (prompt: string, image: string) => {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image }),
    });
    if (!res.ok) throw new Error(`Failed to generate image for prompt: ${prompt}`);
    const { imageUrl } = await res.json();
    return imageUrl;
};

// Helper to call our scoring API
const scoreImage = async (imageUrl: string, prompt: string) => {
    const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, prompt }),
    });
    if (!res.ok) throw new Error(`Failed to score image for prompt: ${prompt}`);
    const { score } = await res.json();
    return score;
}

export default function BattlePage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const playerAvatar = searchParams.get('playerAvatar')!;
    const playerName = searchParams.get('playerName')!;
    const playerPrompt = searchParams.get('playerPrompt')!;
    const playerAbility = searchParams.get('playerAbility')!;

    const [status, setStatus] = useState('Setting the stage...');
    const [arenaTheme, setArenaTheme] = useState('');
    const [playerImage, setPlayerImage] = useState(playerAvatar);
    const [aiImage, setAiImage] = useState<string | null>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [winner, setWinner] = useState<'Player' | 'AI' | null>(null);

    useEffect(() => {
        async function startBattle() {
            try {
                // 1. Get Arena and AI prompts
                setStatus('Summoning a new challenger...');
                const promptRes = await fetch('/api/generate-prompt');
                if (!promptRes.ok) throw new Error("Failed to get AI prompt");
                const { arenaTheme, aiAbilityPrompt } = await promptRes.json();
                setArenaTheme(arenaTheme);

                // --- Player Image Generation ---
                // First, place player in the arena
                setStatus(`Placing ${playerName} in the ${arenaTheme}...`);
                const playerInArena = await generateImage(`${playerPrompt} in a ${arenaTheme}`, playerAvatar);
                setPlayerImage(playerInArena);

                // Second, apply player's ability
                setStatus(`Unleashing ${playerAbility}...`);
                const playerFinalImage = await generateImage(`${playerAbility}`, playerInArena);
                setPlayerImage(playerFinalImage);

                // --- AI Image Generation ---
                const baseAiAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face';
                
                // First, place AI in the arena
                setStatus(`An AI appears in the ${arenaTheme}!`);
                const aiInArena = await generateImage(`A worthy opponent in a ${arenaTheme}`, baseAiAvatar);
                setAiImage(aiInArena);
                
                // Second, apply AI's ability
                setStatus(`AI is using ${aiAbilityPrompt}...`);
                const aiFinalImage = await generateImage(aiAbilityPrompt, aiInArena);
                setAiImage(aiFinalImage);

                // --- Scoring ---
                setStatus('The referee is judging the results...');
                const playerScoringPrompt = `${playerPrompt} in a ${arenaTheme}, ${playerAbility}`;
                const aiScoringPrompt = `A worthy opponent in a ${arenaTheme}, ${aiAbilityPrompt}`;
                
                const finalPlayerScore = await scoreImage(playerFinalImage, playerScoringPrompt);
                const finalAiScore = await scoreImage(aiFinalImage, aiScoringPrompt);

                setPlayerScore(finalPlayerScore);
                setAiScore(finalAiScore);

                // --- Declare Winner ---
                setStatus('And the winner is...');
                if (finalPlayerScore > finalAiScore) {
                    setWinner('Player');
                } else {
                    setWinner('AI');
                }

            } catch (error) {
                console.error("Battle failed:", error);
                setStatus(`The battle was cancelled due to a cosmic error!`);
            }
        }

        startBattle();
    }, []);

    return (
        <div className="container mx-auto p-8 flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold text-center">Arena: {arenaTheme || '...'}</h1>

            <div className="text-center">
                <p className="text-lg font-semibold">{status}</p>
                {!winner && (
                    <div className="animate-pulse mt-2">The battle is raging...</div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <AvatarCard
                    imgUrl={playerImage}
                    name={playerName}
                    score={playerScore}
                    className={winner === 'Player' ? 'ring-4 ring-green-500' : ''}
                />
                <div className="text-center">
                    <div className="text-4xl font-bold mb-2">VS</div>
                    {winner && (
                        <div className={`text-2xl font-bold p-2 rounded-md ${winner === 'Player' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {winner} Wins!
                        </div>
                    )}
                </div>
                <AvatarCard
                    imgUrl={aiImage}
                    name="AI Opponent"
                    score={aiScore}
                    className={winner === 'AI' ? 'ring-4 ring-green-500' : ''}
                />
            </div>

            <div className="mt-8">
                <a
                    href="/"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Play Again
                </a>
            </div>
        </div>
    )
} 