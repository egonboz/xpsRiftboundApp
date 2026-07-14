import type { Player } from '@/entities/player/types'
import { LeaderboardRow, SectionCard } from '@/components/ui/shared'

interface GroupLeaderboardProps {
  players: Player[]
}

export function GroupLeaderboard({ players }: GroupLeaderboardProps) {
  const sorted = [...players].sort((a, b) => {
    const rankA = a.currentRank
    const rankB = b.currentRank
    if (rankA !== rankB) return rankA - rankB
    if (b.statistics.winRate !== a.statistics.winRate) return b.statistics.winRate - a.statistics.winRate
    return a.statistics.averageRank - b.statistics.averageRank
  })

  return (
    <SectionCard title="Group Leaderboard">
      <div className="space-y-0.5">
        {sorted.map((player, index) => (
          <LeaderboardRow
            key={player.id}
            position={index + 1}
            player={{
              id: player.id,
              displayName: player.displayName,
              avatar: player.avatar,
              winRate: player.statistics.winRate,
              averageRank: player.statistics.averageRank,
            }}
          />
        ))}
      </div>
    </SectionCard>
  )
}
