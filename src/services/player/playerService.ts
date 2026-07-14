import type { Player, DashboardData } from '@/entities/player/types'
import type { ApiStandingsResponse } from '@/services/api/types'
import { apiGet } from '@/services/api/client'
import { mapStandingsToDashboard } from '@/services/api/mappers'
import { resolveEventDetails } from '@/services/player/eventService'

export interface PlayerWithContext {
  player: Player | null
  allPlayers: Player[]
}

async function fetchStandings(roundId: string): Promise<ApiStandingsResponse> {
  return apiGet<ApiStandingsResponse>(
    `/tournament-rounds/${roundId}/standings`
  )
}

export async function fetchDashboardByEvent(eventId: string): Promise<DashboardData> {
  const { roundId, eventName } = await resolveEventDetails(eventId)
  const response = await fetchStandings(roundId)
  return mapStandingsToDashboard(response, eventName)
}

export async function fetchPlayerByEvent(id: string, eventId: string): Promise<Player | null> {
  const { roundId, eventName } = await resolveEventDetails(eventId)
  const response = await fetchStandings(roundId)
  const dashboard = mapStandingsToDashboard(response, eventName)
  return dashboard.players.find((p) => p.id === id) ?? null
}

export async function fetchPlayerWithContext(id: string, eventId: string): Promise<PlayerWithContext> {
  const { roundId, eventName } = await resolveEventDetails(eventId)
  const response = await fetchStandings(roundId)
  const dashboard = mapStandingsToDashboard(response, eventName)
  return {
    player: dashboard.players.find((p) => p.id === id) ?? null,
    allPlayers: dashboard.players,
  }
}
