import { useState, useEffect } from 'react'
import type { Match } from '@/services/pairings/types'
import { fetchPairingsByRound } from '@/services/pairings/pairingsService'

interface UsePairingsReturn {
  matches: Match[]
  isLoading: boolean
  error: string | null
}

export function usePairings(roundId: string | null): UsePairingsReturn {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roundId) {
      setMatches([])
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPairingsByRound(roundId!)
        if (!cancelled) {
          setMatches(data.matches)
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load pairings')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [roundId])

  return { matches, isLoading, error }
}
