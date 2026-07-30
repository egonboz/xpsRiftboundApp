import type { Match } from '@/services/pairings/types'
import { SectionCard } from '@/components/ui/shared'
import { cn } from '@/lib/cn'

interface PairingsSectionProps {
  matches: Match[]
}

export function PairingsSection({ matches }: PairingsSectionProps) {
  if (matches.length === 0) {
    return (
      <SectionCard title="Pairings">
        <p className="py-4 text-center text-sm text-gray-500">
          No pairings available for this round.
        </p>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Pairings">
      <div className="space-y-2">
        {matches.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </div>
    </SectionCard>
  )
}

function MatchRow({ match }: { match: Match }) {
  if (match.match_is_bye) {
    const player = match.players[0]
    return (
      <div className="flex items-center gap-3 rounded-xl bg-surface-lighter/50 px-4 py-3">
        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
            Table
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-xs font-bold text-gray-400">
            {match.table_number}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-300">{player?.name ?? 'Unknown'}</span>
        <span className="ml-auto rounded-md bg-accent-gold/15 px-2 py-0.5 text-[11px] font-semibold text-accent-gold">
          BYE
        </span>
      </div>
    )
  }

  const player1 = match.players[0]
  const player2 = match.players[1]
  const winnerId = match.winning_player

  if (!player1 || !player2) return null

  const isComplete = match.status === 'COMPLETE'

  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-lighter/50 px-4 py-3">
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
          Table
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-xs font-bold text-gray-400">
          {match.table_number}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate text-sm',
              isComplete && winnerId === player1.id
                ? 'font-semibold text-green-400'
                : isComplete
                  ? 'text-gray-400'
                  : 'font-medium text-gray-200',
            )}
          >
            {player1.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate text-sm',
              isComplete && winnerId === player2.id
                ? 'font-semibold text-green-400'
                : isComplete
                  ? 'text-gray-400'
                  : 'font-medium text-gray-200',
            )}
          >
            {player2.name}
          </span>
        </div>
      </div>

      {isComplete ? (
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-bold tabular-nums text-green-400">
            {match.games_won_by_winner}
          </span>
          <span className="text-xs text-gray-500">-</span>
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-bold tabular-nums text-red-400">
            {match.games_won_by_loser}
          </span>
        </div>
      ) : (
        <span className="shrink-0 rounded-md bg-accent-gold/15 px-2 py-0.5 text-[10px] font-semibold text-accent-gold">
          VS
        </span>
      )}
    </div>
  )
}
