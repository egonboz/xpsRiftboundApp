import type { PairingsResponse } from '@/services/pairings/types'

const BASE_URL = 'https://eloshowdown.com/riftbound/api/tracker'

export async function fetchPairingsByRound(roundId: string): Promise<PairingsResponse> {
  const url = `${BASE_URL}/round/${roundId}/combined/?pairings=1&standings=0`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Pairings API error: ${response.status}`)
  }

  return response.json()
}
