import { useState, useEffect } from 'react'
import type { Player } from '@/entities/player/types'
import { fetchPlayerWithContext } from '@/services/player/playerService'
import type { PlayerWithContext } from '@/services/player/playerService'

interface UsePlayerReturn extends PlayerWithContext {
  isLoading: boolean
  error: string | null
}

export function usePlayer(id: string, eventId: string | null): UsePlayerReturn {
  const [player, setPlayer] = useState<Player | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setPlayer(null)
      setAllPlayers([])
      setIsLoading(false)
      setError(null)
      return
    }

    const eid = eventId
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchPlayerWithContext(id, eid)
        if (!cancelled) {
          setPlayer(result.player)
          setAllPlayers(result.allPlayers)
          if (!result.player) {
            setError('Player not found')
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load player data')
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
  }, [id, eventId])

  return { player, allPlayers, isLoading, error }
}
