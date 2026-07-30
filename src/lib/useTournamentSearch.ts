import { useSearchParams, useParams } from 'react-router-dom'

export function useTournamentSearch() {
  const [searchParams] = useSearchParams()
  const { eventId } = useParams<{ eventId?: string }>()

  const tournamentId = searchParams.get('tournament') || eventId || null

  const getTo = (path: string) => {
    return tournamentId ? `${path}?tournament=${tournamentId}` : path
  }

  return { tournamentId, getTo }
}
