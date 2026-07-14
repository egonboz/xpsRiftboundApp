import type { Player } from '@/entities/player/types'
import { CompactStandingRow } from '@/components/ui/shared'

interface CurrentStandingsProps {
  players: Player[]
}

export function StandingsSection({ players }: CurrentStandingsProps) {
  return (
    <div className="space-y-1">
      {players.map((player) => (
        <CompactStandingRow key={player.id} player={player} />
      ))}
    </div>
  )
}
