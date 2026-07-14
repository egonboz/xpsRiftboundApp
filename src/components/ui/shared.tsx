import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useTournamentSearch } from '@/lib/useTournamentSearch'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'gold' | 'blue' | 'purple' | 'success' | 'danger' | 'warning' | 'default'
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  gold: 'bg-accent-gold/15 text-accent-gold border-accent-gold/20',
  blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  purple: 'bg-accent-purple/15 text-accent-purple-light border-accent-purple/20',
  success: 'bg-success/15 text-success border-success/20',
  danger: 'bg-danger/15 text-danger border-danger/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  default: 'bg-surface-lighter text-gray-300 border-white/5',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

interface TrendBadgeProps {
  trend: 'up' | 'down' | 'same'
  className?: string
}

export function TrendBadge({ trend, className }: TrendBadgeProps) {
  const config = {
    up: { icon: '▲', label: 'Climbing', variant: 'success' as const },
    down: { icon: '▼', label: 'Dropping', variant: 'danger' as const },
    same: { icon: '■', label: 'Holding', variant: 'default' as const },
  }

  const { icon, label, variant } = config[trend]

  return (
    <Badge variant={variant} size="sm" className={cn('gap-1', className)}>
      <span className="text-[10px]">{icon}</span>
      {label}
    </Badge>
  )
}

interface StatusBadgeProps {
  status: 'playing' | 'eliminated' | 'qualified'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    playing: { label: 'Playing', variant: 'success' as const },
    eliminated: { label: 'Eliminated', variant: 'danger' as const },
    qualified: { label: 'Qualified', variant: 'blue' as const },
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} size="sm" className={className}>
      <span className="relative flex h-2 w-2">
        {status === 'playing' && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            status === 'playing' && 'bg-success',
            status === 'eliminated' && 'bg-danger',
            status === 'qualified' && 'bg-accent-blue',
          )}
        />
      </span>
      {label}
    </Badge>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  variant?: 'gold' | 'blue' | 'purple' | 'default'
  className?: string
}

export function StatCard({ label, value, icon, variant = 'default', className }: StatCardProps) {
  const gradientClasses = {
    gold: 'from-accent-gold/20 to-accent-gold/5',
    blue: 'from-accent-blue/20 to-accent-blue/5',
    purple: 'from-accent-purple/20 to-accent-purple/5',
    default: 'from-surface-light to-surface',
  }

  const iconClasses = {
    gold: 'text-accent-gold',
    blue: 'text-accent-blue',
    purple: 'text-accent-purple-light',
    default: 'text-gray-400',
  }

  return (
    <div
      className={cn(
        'glass rounded-2xl p-4 bg-gradient-to-br',
        gradientClasses[variant],
        className,
      )}
    >
      <div className={cn('mb-2', iconClasses[variant])}>{icon}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-gray-400">{label}</div>
    </div>
  )
}

interface SectionCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export function SectionCard({ title, subtitle, children, action, className }: SectionCardProps) {
  return (
    <section className={cn('glass rounded-3xl p-4', className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-200">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

interface CompactStandingRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  player: {
    id: string
    displayName: string
    avatar: string
    currentRank: number
    matchesWon: number
    matchesLost: number
    matchesDrawn: number
    matchPoints: number
    deckName: string
    trend: 'up' | 'down' | 'same'
  }
}

export function CompactStandingRow({ player, className, ...props }: CompactStandingRowProps) {
  const rankColor =
    player.currentRank <= 3 ? 'text-accent-gold' : player.currentRank <= 8 ? 'text-accent-blue' : 'text-gray-300'
  const { getTo } = useTournamentSearch()

  return (
    <Link
      to={getTo(`/player/${player.id}`)}
      className={cn(
        'flex items-center gap-3 rounded-2xl p-3 transition-all duration-200',
        'hover:bg-white/[0.03] active:bg-white/[0.05] card-press',
        className,
      )}
      {...props}
    >
      <div className="relative shrink-0">
        <img
          src={player.avatar}
          alt={player.displayName}
          className="h-10 w-10 rounded-full bg-surface-lighter"
          loading="lazy"
        />
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-accent-gold ring-1 ring-accent-gold/30">
          {player.currentRank}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">{player.displayName}</span>
          <TrendBadge trend={player.trend} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
          <span>{player.deckName}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className={cn('text-xs font-bold', rankColor)}>#{player.currentRank}</div>
        <div className="mt-0.5 font-mono text-[11px] text-gray-400">
          {player.matchesWon}-{player.matchesLost}-{player.matchesDrawn}
        </div>
        <div className="mt-0.5 text-[10px] font-semibold text-accent-gold">{player.matchPoints} pts</div>
      </div>
    </Link>
  )
}

interface LeaderboardRowProps {
  position: number
  player: {
    id: string
    displayName: string
    avatar: string
    winRate: number
    averageRank: number
  }
}

export function LeaderboardRow({ position, player }: LeaderboardRowProps) {
  const medalColor =
    position === 1 ? 'text-accent-gold' : position === 2 ? 'text-gray-300' : position === 3 ? 'text-amber-700' : 'text-gray-500'

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.02]">
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          medalColor,
          position <= 3 ? 'bg-white/5' : 'bg-transparent',
        )}
      >
        {position}
      </div>

      <img
        src={player.avatar}
        alt={player.displayName}
        className="h-8 w-8 rounded-full bg-surface-lighter"
        loading="lazy"
      />

      <div className="min-w-0 flex-1">
        <span className="truncate text-sm font-medium">{player.displayName}</span>
      </div>

      <div className="shrink-0 text-right text-xs">
        <div className="font-semibold text-gray-200">{Math.round(player.winRate * 100)}%</div>
        <div className="text-gray-500">Avg {player.averageRank}{getRankSuffix(player.averageRank)}</div>
      </div>
    </div>
  )
}

function getRankSuffix(rank: number): string {
  const floor = Math.floor(rank)
  if (floor >= 11 && floor <= 13) return 'th'
  switch (floor % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

interface PlayerCardProps {
  player: {
    id: string
    displayName: string
    avatar: string
    currentRank: number
    matchesWon: number
    matchesLost: number
    matchesDrawn: number
    matchPoints: number
    deckName: string
    deckImage: string
    status: 'playing' | 'eliminated' | 'qualified'
    winRate: number
    averageRank: number
    lastUpdated: Date
  }
}

export function PlayerCard({ player }: PlayerCardProps) {
  const { getTo } = useTournamentSearch()

  return (
    <Link
      to={getTo(`/player/${player.id}`)}
      className="glass-strong group relative block overflow-hidden rounded-3xl p-5 card-press transition-all duration-300 hover:border-accent-gold/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="rounded-full bg-gradient-to-br from-accent-gold/20 to-accent-purple/20 p-[2px]">
            <img
              src={player.avatar}
              alt={player.displayName}
              className="h-14 w-14 rounded-full bg-surface"
              loading="lazy"
            />
          </div>
          <StatusBadge
            status={player.status}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold">{player.displayName}</h3>
            <span className="shrink-0 rounded-lg bg-accent-gold/15 px-2 py-0.5 text-[11px] font-bold text-accent-gold">
              #{player.currentRank}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            <span className="font-mono">
              {player.matchesWon}-{player.matchesLost}-{player.matchesDrawn}
            </span>
            <span className="font-semibold text-accent-gold">{player.matchPoints} pts</span>
            <span>{Math.round(player.winRate * 100)}% WR</span>
            <span>Avg #{Math.round(player.averageRank)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-surface-lighter px-2 py-1 text-[11px] text-gray-300">
              {player.deckName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-lg px-4 pb-24 pt-4', className)}>
      {children}
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-surface-lighter', className)}
    />
  )
}

interface DeckCardProps {
  name: string
  image: string
  className?: string
}

export function DeckCard({ name, image, className }: DeckCardProps) {
  return (
    <div className={cn('glass flex items-center gap-3 rounded-xl p-3', className)}>
      <img
        src={image}
        alt={name}
        className="h-10 w-10 rounded-lg bg-surface-lighter"
        loading="lazy"
      />
      <span className="text-sm font-medium text-gray-200">{name}</span>
    </div>
  )
}
