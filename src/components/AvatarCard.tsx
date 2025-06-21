import Image from 'next/image'
import { cn } from '@/utils/cn'

type Props = {
  imgUrl: string | null
  name?: string | null
  score?: number
  className?: string
}

export default function AvatarCard({ imgUrl, name, score, className }: Props) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col items-center', className)}>
      {imgUrl ? (
        <Image src={imgUrl} alt={name ?? 'avatar'} width={256} height={256} className="rounded" />
      ) : (
        <div className="w-64 h-64 bg-muted animate-pulse rounded" />
      )}
      {name && <p className="mt-2 font-semibold">{name}</p>}
      {score !== undefined && <p className="text-sm text-muted-foreground">Score {score.toFixed(2)}</p>}
    </div>
  )
} 