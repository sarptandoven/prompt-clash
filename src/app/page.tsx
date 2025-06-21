import { redirect } from 'next/navigation'
import { supabaseServer } from '@/utils/supabase-server'

export default async function Home() {
  const supabase = supabaseServer()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  // @ts-ignore Supabase types allow string but immaterial here
  const { data } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${appUrl}/onboard` } })

  return (
    <div className="min-h-screen flex items-center justify-center">
      <a href={data?.url ?? '#'} className="bg-black text-white px-6 py-3 rounded">
        Sign in with Google
      </a>
    </div>
  )
}
