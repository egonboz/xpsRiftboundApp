const LAST_TOURNAMENT_KEY = 'last_tournament'

interface LastTournament {
  id: string
}

export function getLastTournament(): LastTournament | null {
  try {
    const raw = localStorage.getItem(LAST_TOURNAMENT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setLastTournament(tournament: LastTournament): void {
  localStorage.setItem(LAST_TOURNAMENT_KEY, JSON.stringify(tournament))
}
