import { useState, useEffect } from 'react'
import type { DashboardData } from '@/entities/player/types'
import { fetchDashboardByEvent } from '@/services/player/playerService'

interface UseDashboardReturn {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
}

export function useDashboard(eventId: string | null): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setData(null)
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
        const result = await fetchDashboardByEvent(eid)
        if (!cancelled) {
          setData(result)
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load tournament data')
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

  return { data, isLoading, error }
}
