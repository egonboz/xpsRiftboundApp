const LAST_PLAYER_KEY = 'last_viewed_player'

interface LastPlayer {
  id: string
  name: string
  tournamentId: string
}

export function getLastPlayer(): LastPlayer | null {
  try {
    const raw = localStorage.getItem(LAST_PLAYER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setLastPlayer(player: LastPlayer): void {
  localStorage.setItem(LAST_PLAYER_KEY, JSON.stringify(player))
}
