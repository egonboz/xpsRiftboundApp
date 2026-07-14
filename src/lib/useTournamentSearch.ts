import { useSearchParams } from 'react-router-dom'

export function useTournamentSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const tournamentId = searchParams.get('tournament')

  const setTournamentId = (id: string) => {
    setSearchParams({ tournament: id })
  }

  const getTo = (path: string) => {
    return tournamentId ? `${path}?tournament=${tournamentId}` : path
  }

  return { tournamentId, setTournamentId, getTo }
}
