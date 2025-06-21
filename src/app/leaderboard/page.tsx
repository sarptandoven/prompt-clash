import { prisma } from '@/lib/prisma'
import AvatarCard from '@/components/AvatarCard'

interface UserRow {
  id: string
  avatarUrl: string | null
  name: string | null
  elo: number
}

export default async function Leaderboard() {
  const top = (await prisma.user.findMany({ orderBy: { elo: 'desc' }, take: 10 })) as UserRow[]
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Gladiators</h1>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
        {top.map((u: UserRow, i: number) => (
          <div key={u.id} className="flex flex-col items-center">
            <span className="text-lg font-semibold">#{i + 1}</span>
            <AvatarCard imgUrl={u.avatarUrl} name={u.name} />
            <span className="mt-1 text-sm text-muted-foreground">Elo {u.elo}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 