import type { Player } from '@/entities/player/types'
import { PlayerCard, SectionCard } from '@/components/ui/shared'

interface PlayerCardsProps {
  players: Player[]
}

export function PlayerCardsSection({ players }: PlayerCardsProps) {
  return (
    <SectionCard title="Players">
      <div className="space-y-3">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={{
              id: player.id,
              displayName: player.displayName,
              avatar: player.avatar,
              currentRank: player.currentRank,
              matchesWon: player.matchesWon,
              matchesLost: player.matchesLost,
              matchesDrawn: player.matchesDrawn,
              matchPoints: player.matchPoints,
              deckName: player.deckName,
              deckImage: player.deckImage,
              status: player.status,
              winRate: player.statistics.winRate,
              averageRank: player.statistics.averageRank,
              lastUpdated: player.lastUpdated,
            }}
          />
        ))}
      </div>
    </SectionCard>
  )
}
