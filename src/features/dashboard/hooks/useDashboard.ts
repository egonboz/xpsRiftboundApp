import { useState, useEffect } from 'react'
import type { DashboardData } from '@/entities/player/types'
import { fetchDashboardByEvent } from '@/services/player/playerService'
import { EventNotStartedError } from '@/services/player/eventService'

interface UseDashboardReturn {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  waitingEventName: string | null
}

export function useDashboard(eventId: string | null): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [waitingEventName, setWaitingEventName] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setData(null)
      setIsLoading(false)
      setError(null)
      setWaitingEventName(null)
      return
    }

    const eid = eventId
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        setWaitingEventName(null)
        const result = await fetchDashboardByEvent(eid)
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof EventNotStartedError) {
            setWaitingEventName(err.eventName)
          } else {
            setError('Failed to load tournament data')
          }
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

  return { data, isLoading, error, waitingEventName }
}
