import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseServer } from '@/utils/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { avatarUrl, ability } = await req.json()
    const supabase = supabaseServer()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.upsert({
      where: { id: user.id },
      update: { avatarUrl, ability, name: user.user_metadata?.name, email: user.email, googlePic: user.user_metadata?.avatar_url },
      create: { id: user.id, avatarUrl, ability, name: user.user_metadata?.name, email: user.email!, googlePic: user.user_metadata?.avatar_url }
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 