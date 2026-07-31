import { useState, useEffect } from 'react'
import { apiGet } from '@/services/api/client'

interface Registration {
  id: number
  registration_status: string
  best_identifier: string
  is_guest: boolean
  full_profile_picture_url: string
}

interface RegistrationsResponse {
  results: Registration[]
  count: number
}

interface UseRegistrationsReturn {
  players: Registration[]
  count: number
  isLoading: boolean
}

export function useRegistrations(eventId: string | null): UseRegistrationsReturn {
  const [players, setPlayers] = useState<Registration[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!eventId) {
      setPlayers([])
      setCount(0)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const data = await apiGet<RegistrationsResponse>(
          `/events/${eventId}/registrations?page_size=100`,
        )
        if (!cancelled) {
          setPlayers(data.results)
          setCount(data.count)
        }
      } catch {
        if (!cancelled) {
          setPlayers([])
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

  return { players, count, isLoading }
}
