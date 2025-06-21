'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

export default function Navigation() {
  const pathname = usePathname()
  
  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leaderboard', label: 'Leaderboard' }
  ]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          PromptClash
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium',
                pathname === link.href
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 