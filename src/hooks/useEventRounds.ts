import { useState, useEffect } from 'react'
import type { EventRoundInfo } from '@/services/player/eventService'
import { resolveEventRounds } from '@/services/player/eventService'

interface UseEventRoundsReturn {
  rounds: EventRoundInfo[]
  isLoading: boolean
}

export function useEventRounds(eventId: string | null): UseEventRoundsReturn {
  const [rounds, setRounds] = useState<EventRoundInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!eventId) {
      setRounds([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const result = await resolveEventRounds(eventId!)
        if (!cancelled) {
          setRounds(result)
        }
      } catch {
        if (!cancelled) {
          setRounds([])
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
  }, [eventId])

  return { rounds, isLoading }
}
