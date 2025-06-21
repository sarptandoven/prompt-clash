import AvatarCard from '@/components/AvatarCard'

// Fake leaderboard data
const fakeLeaderboard = [
  {
    id: '1',
    name: 'ShadowMaster',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face',
    elo: 1850,
    ability: 'Shadow Manipulation'
  },
  {
    id: '2',
    name: 'FireLord',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face',
    elo: 1780,
    ability: 'Inferno Control'
  },
  {
    id: '3',
    name: 'IceQueen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=face',
    elo: 1720,
    ability: 'Frost Mastery'
  },
  {
    id: '4',
    name: 'ThunderBolt',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=face',
    elo: 1680,
    ability: 'Lightning Strike'
  },
  {
    id: '5',
    name: 'EarthShaker',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face',
    elo: 1650,
    ability: 'Seismic Power'
  },
  {
    id: '6',
    name: 'WindWalker',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face',
    elo: 1620,
    ability: 'Air Control'
  },
  {
    id: '7',
    name: 'Gladiator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=face',
    elo: 1200,
    ability: 'Fire Mastery'
  },
  {
    id: '8',
    name: 'CrystalKnight',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=face',
    elo: 1150,
    ability: 'Crystal Armor'
  }
]

export default function Leaderboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Gladiators</h1>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
        {fakeLeaderboard.map((user, i) => (
          <div key={user.id} className="flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">#{i + 1}</span>
            <AvatarCard imgUrl={user.avatarUrl} name={user.name} />
            <span className="mt-2 text-sm text-gray-600">Elo {user.elo}</span>
            <span className="text-xs text-gray-500">{user.ability}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 