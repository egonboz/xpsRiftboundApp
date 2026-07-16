import { apiGet } from '@/services/api/client'

interface ApiEventRound {
  id: number
  round_number: number
  standings_status: string
  status: string
}

interface ApiEventPhase {
  rounds: ApiEventRound[]
}

interface ApiEventResponse {
  id: number
  name: string
  tournament_phases: ApiEventPhase[]
}

export interface EventDetails {
  roundId: string
  eventName: string
}

async function fetchEvent(eventId: string): Promise<ApiEventResponse> {
  return apiGet<ApiEventResponse>(`/events/${eventId}`)
}

export class EventNotStartedError extends Error {
  eventName: string

  constructor(eventName: string) {
    super(`Event "${eventName}" has not started yet`)
    this.name = 'EventNotStartedError'
    this.eventName = eventName
  }
}

export async function resolveEventDetails(eventId: string): Promise<EventDetails> {
  const event = await fetchEvent(eventId)

  const rounds = event.tournament_phases.flatMap((p) => p.rounds)
  const generated = rounds.filter((r) => r.standings_status === 'GENERATED')

  if (generated.length === 0) {
    throw new EventNotStartedError(event.name)
  }

  const latest = generated.reduce((max, r) => (r.round_number > max.round_number ? r : max))

  return {
    roundId: String(latest.id),
    eventName: event.name,
  }
}
