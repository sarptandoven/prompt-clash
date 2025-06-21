import { prisma } from '@/lib/prisma'
import AvatarCard from '@/components/AvatarCard'
import { notFound } from 'next/navigation'

type BattlePageProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BattlePage({ params }: BattlePageProps) {
  const battle = await prisma.battle.findUnique({ where: { id: params.id } })
  if (!battle) return notFound()
  const winnerA = battle.winnerId === battle.aId

  return (
    <div className="container mx-auto p-8 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">Arena: {battle.arena}</h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <AvatarCard imgUrl={battle.aImg} name="Player A" score={battle.aScore} className={winnerA ? 'ring-4 ring-green-500' : ''} />
        <AvatarCard imgUrl={battle.bImg} name="Player B" score={battle.bScore} className={!winnerA ? 'ring-4 ring-green-500' : ''} />
      </div>
    </div>
  )
} 