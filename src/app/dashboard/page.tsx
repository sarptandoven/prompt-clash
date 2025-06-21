'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/utils/supabase-browser'
import AvatarCard from '@/components/AvatarCard'
import { useRouter } from 'next/navigation'

interface DashboardUser {
  id: string
  name: string | null
  avatarUrl: string | null
  // Add other fields from your User model that you need here
}

export default function Dashboard() {
  const supabase = supabaseBrowser
  const [userData, setUserData] = useState<DashboardUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      const { data, error } = await supabase.from('User').select('*').eq('id', user.id).single()
      if (error) return console.error(error)
      setUserData(data)
    }
    fetchUser()
  }, [router, supabase])

  async function handleBattle() {
    const res = await fetch('/api/battle')
    const { battleId } = await res.json()
    router.push(`/battle/${battleId}`)
  }

  if (!userData) return <p className="text-center mt-20">Loading...</p>

  return (
    <div className="container mx-auto p-8 flex flex-col items-center gap-6">
      <AvatarCard imgUrl={userData.avatarUrl} name={userData.name} />
      <button className="bg-black text-white px-6 py-2 rounded" onClick={handleBattle}>
        Battle Now
      </button>
    </div>
  )
} 