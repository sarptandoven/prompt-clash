import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseServer } from '@/utils/supabase-server'
import { generateAvatar, scoreImages } from '@/utils/replicate'
import { calculateNewElo } from '@/utils/elo'

async function getRandomArena() {
  const arenas = [
    'Ancient Colosseum at sunset',
    'Cyberpunk neon alley',
    'Floating sky temple',
    'Post-apocalyptic wasteland',
    'Crystal cavern arena'
  ]
  return arenas[Math.floor(Math.random() * arenas.length)]
}

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseServer()
    const {
      data: { user: me }
    } = await supabase.auth.getUser()
    if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch me from DB
    const meDb = await prisma.user.findUnique({ where: { id: me.id } })
    if (!meDb || !meDb.avatarUrl || !meDb.ability)
      return NextResponse.json({ error: 'User not onboarded' }, { status: 400 })

    // Pick random opponent
    const opponent = await prisma.$queryRaw`SELECT * FROM "User" WHERE id != ${me.id} ORDER BY RANDOM() LIMIT 1` as any[]
    if (!opponent.length)
      return NextResponse.json({ error: 'No opponents found' }, { status: 404 })
    const opp = opponent[0]

    // Generate arena prompt
    const arena = await getRandomArena()

    // Score images via CLIP using arena prompt as context
    const [aScore, bScore] = await scoreImages(arena, meDb.avatarUrl!, opp.avatarUrl)

    const meWin = aScore > bScore
    const winnerId = meWin ? me.id : opp.id

    // Elo update
    const { newRa, newRb } = calculateNewElo(meDb.elo, opp.elo, meWin ? 1 : 0, meWin ? 0 : 1)

    // Save battle and update elo in transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const battle = await prisma.$transaction(async (tx: any) => {
      const b = await tx.battle.create({
        data: {
          arena,
          aId: me.id,
          bId: opp.id,
          aImg: meDb.avatarUrl!,
          bImg: opp.avatarUrl,
          aScore,
          bScore,
          winnerId
        }
      })
      await tx.user.update({ where: { id: me.id }, data: { elo: newRa } })
      await tx.user.update({ where: { id: opp.id }, data: { elo: newRb } })
      return b
    })

    return NextResponse.json({ battleId: battle.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 