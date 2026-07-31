import { useRef, useState, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Home, Trophy, User } from 'lucide-react'
import { getLastPlayer } from '@/lib/lastPlayer'
import { getLastTournament } from '@/lib/lastTournament'

function getTournamentTo(): string {
  const last = getLastTournament()
  return last ? `/tournament/${last.id}` : '/tournament'
}

function getPlayerTo(): string | null {
  const last = getLastPlayer()
  if (!last) return null
  return `/player/${last.id}?tournament=${last.tournamentId}`
}

export function BottomNavigation() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0 })

  const playerTo = getPlayerTo()
  const tournamentTo = getTournamentTo()

  const navItems = [
    { to: '/', icon: Home, label: 'Search', disabled: false },
    { to: tournamentTo, icon: Trophy, label: 'Tournament', disabled: false },
    {
      to: playerTo ?? '#',
      icon: User,
      label: 'Player',
      disabled: !playerTo,
    },
  ]

  const activeIndex = navItems.findIndex((item) => {
    if (item.label === 'Player') return location.pathname.startsWith('/player')
    if (item.disabled) return false
    if (item.label === 'Search') return location.pathname === '/'
    return item.to !== '#' && location.pathname.startsWith(item.to)
  })

  useLayoutEffect(() => {
    const measure = () => {
      const el = linkRefs.current[activeIndex]
      const container = containerRef.current
      if (!el || !container) return
      setIndicatorStyle({
        left: el.offsetLeft + el.offsetWidth / 2,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIndex, location])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        ref={containerRef}
        className="glass-strong relative mx-auto flex max-w-lg items-center justify-around rounded-t-3xl px-3 pb-[env(safe-area-inset-bottom,8px)] pt-2"
      >
        <span
          className="absolute bottom-1 h-0.5 w-8 rounded-full bg-accent-gold transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            transform: 'translateX(-50%)',
            opacity: activeIndex === -1 ? 0 : 1,
          }}
        />

        {navItems.map((item, i) => {
          const isActive = i === activeIndex
          const isDisabled = item.disabled
          const Icon = item.icon

          const linkClasses = cn(
            'flex flex-col items-center gap-1 px-5 py-2',
            'transition-colors duration-300 ease-out',
            isActive
              ? 'text-accent-gold'
              : isDisabled
                ? 'text-gray-700 cursor-default'
                : 'text-gray-500 hover:text-gray-300',
          )

          const iconClasses = cn(
            'transition-all duration-300 ease-out',
            isActive ? 'h-6 w-6' : 'h-5 w-5',
          )

          if (isDisabled) {
            return (
              <span
                key={item.label}
                ref={(el) => { linkRefs.current[i] = el as HTMLAnchorElement | null }}
                className={linkClasses}
                aria-disabled
              >
                <Icon className={iconClasses} />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-all duration-300 ease-out',
                    'opacity-40',
                  )}
                >
                  {item.label}
                </span>
              </span>
            )
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              ref={(el) => { linkRefs.current[i] = el }}
              className={linkClasses}
            >
              <Icon className={iconClasses} />
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-300 ease-out',
                  isActive ? 'opacity-100' : 'opacity-60',
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
