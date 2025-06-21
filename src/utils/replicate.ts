import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN ?? ''
})

export async function generateAvatar(selfieUrl: string, abilityPrompt: string) {
  // `blackforestlabs/flux-kontext` expects an input like { image: selfieUrl, prompt: abilityPrompt }
  const output = await replicate.run(
    'blackforestlabs/flux-kontext',
    {
      input: {
        image: selfieUrl,
        prompt: abilityPrompt
      }
    }
  ) as string[]
  // Model may return array of images; pick first
  return Array.isArray(output) ? output[0] : (output as string)
}

export async function scoreImages(prompt: string, aImg: string, bImg: string) {
  const scores = await replicate.run(
    'laion/clip-vit-large-patch14',
    {
      input: {
        prompt,
        images: [aImg, bImg]
      }
    }
  ) as number[]
  return scores
} 