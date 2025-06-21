'use client'
import { supabaseBrowser } from '@/utils/supabase-browser'
import { useState } from 'react'
import { generateAvatar } from '@/utils/replicate'
import { redirect } from 'next/navigation'

export default function Onboard() {
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [ability, setAbility] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = supabaseBrowser

  async function handleSubmit() {
    if (!selfieFile || !ability) return
    setLoading(true)

    // Upload selfie to Supabase storage
    const fileExt = selfieFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('selfies').upload(fileName, selfieFile)
    if (uploadError) {
      console.error(uploadError)
      setLoading(false)
      return
    }
    const selfieUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/selfies/${fileName}`

    // Generate avatar via Replicate
    const avatarUrl = await generateAvatar(selfieUrl, ability)

    // Save to DB via API call to internal route
    const resp = await fetch('/api/save-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl, ability })
    })
    if (resp.ok) {
      redirect('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Forge Your Avatar</h1>
      <div className="space-y-4">
        <label className="block">
          <span className="font-medium">Take a selfie (or upload)</span>
          <input type="file" accept="image/*" onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)} className="mt-2" />
        </label>
        <label className="block">
          <span className="font-medium">Ability Prompt (max 5 words)</span>
          <input type="text" value={ability} onChange={(e) => setAbility(e.target.value)} maxLength={40} className="mt-2 w-full border rounded p-2" placeholder="plasma blade slash" />
        </label>
        <button disabled={!selfieFile || !ability || loading} onClick={handleSubmit} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Summoning…' : 'Generate'}
        </button>
      </div>
    </div>
  )
} 