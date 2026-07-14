import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Home, User, Trophy, BarChart3 } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/', icon: Trophy, label: 'Tournaments' },
  { to: '/', icon: BarChart3, label: 'Stats' },
  { to: '/', icon: User, label: 'Profile' },
]

export function BottomNavigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-strong mx-auto flex max-w-lg items-center justify-around rounded-t-3xl px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-3 transition-colors',
                isActive
                  ? 'text-accent-gold'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
