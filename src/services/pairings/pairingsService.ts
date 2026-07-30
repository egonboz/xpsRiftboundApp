import type { PairingsResponse } from '@/services/pairings/types'

export async function fetchPairingsByRound(roundId: string): Promise<PairingsResponse> {
  const url = `/pairings-api/round/${roundId}/combined/?pairings=1&standings=0`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Pairings API error: ${response.status}`)
  }

  return response.json()
}
