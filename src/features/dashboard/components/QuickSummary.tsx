import type { Player } from '@/entities/player/types'
import { StatCard, SectionCard } from '@/components/ui/shared'
import { Crown, TrendingUp, Target, WalletCards } from 'lucide-react'
import { formatPercentage } from '@/lib/utils'

interface QuickSummaryProps {
  players: Player[]
}

export function QuickSummary({ players }: QuickSummaryProps) {
  const bestRanked = players.reduce((best, p) =>
    p.currentRank < best.currentRank ? p : best
  )

  const highestWinRate = players.reduce((best, p) =>
    p.statistics.winRate > best.statistics.winRate ? p : best
  )

  const bestAvgRank = players.reduce((best, p) =>
    p.statistics.averageRank < best.statistics.averageRank ? p : best
  )

  const favoriteDecks = players.map((p) => p.statistics.favoriteDeck)
  const deckCounts = favoriteDecks.reduce<Record<string, number>>((acc, deck) => {
    acc[deck] = (acc[deck] ?? 0) + 1
    return acc
  }, {})
  const topDeck = Object.entries(deckCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <SectionCard title="Quick Summary">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Group Leader"
          value={bestRanked.displayName}
          icon={<Crown className="h-5 w-5" />}
          variant="gold"
        />
        <StatCard
          label="Highest Win Rate"
          value={formatPercentage(highestWinRate.statistics.winRate)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="blue"
        />
        <StatCard
          label="Best Avg Rank"
          value={`#${Math.round(bestAvgRank.statistics.averageRank)}`}
          icon={<Target className="h-5 w-5" />}
          variant="purple"
        />
        <StatCard
          label="Top Deck"
          value={topDeck}
          icon={<WalletCards className="h-5 w-5" />}
          variant="default"
        />
      </div>
    </SectionCard>
  )
}
