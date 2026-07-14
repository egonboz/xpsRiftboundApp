import type { Player, DashboardData, PlayerStatistics } from '@/entities/player/types'
import type { ApiStanding, ApiStandingsResponse } from './types'

function mapStatus(registrationStatus: string): Player['status'] {
  if (registrationStatus === 'ELIMINATED') return 'eliminated'
  return 'playing'
}

function mapStandingToPlayer(standing: ApiStanding, tournamentName: string): Player {
  const ues = standing.user_event_status
  const deck = ues.deck_defining_card

  return {
    id: String(standing.player.id),
    displayName: ues.best_identifier ?? standing.player.best_identifier ?? 'Unknown',
    avatar: ues.full_profile_picture_url ?? '',
    currentRank: standing.rank,
    matchesWon: ues.matches_won,
    matchesLost: ues.matches_lost,
    matchesDrawn: ues.matches_drawn,
    matchPoints: standing.match_points,
    overallRecord: standing.match_record ?? standing.record,
    deckName: deck?.name ?? 'Unknown',
    deckImage: deck?.image_url ?? '',
    status: mapStatus(ues.registration_status),
    currentTournament: tournamentName,
    lastUpdated: new Date(),
    statistics: buildStatistics(ues, standing),
    recentResults: [],
    trend: 'same',
  }
}

function buildStatistics(
  ues: ApiStanding['user_event_status'],
  standing: ApiStanding
): PlayerStatistics {
  const totalGames = ues.matches_won + ues.matches_lost + ues.matches_drawn
  const winRate = totalGames > 0 ? Math.round((ues.matches_won / totalGames) * 100) / 100 : 0
  const rank = standing.rank

  return {
    totalTournaments: 0,
    wins: ues.matches_won,
    averageRank: rank,
    bestRank: rank,
    top8: rank <= 8 ? 1 : 0,
    top16: rank <= 16 ? 1 : 0,
    top32: rank <= 32 ? 1 : 0,
    winRate,
    favoriteDeck: ues.deck_defining_card?.name ?? 'Unknown',
    currentStreak: '-',
  }
}

export function mapStandingsToDashboard(
  response: ApiStandingsResponse,
  tournamentName: string
): DashboardData {
  const players = response.standings.map((s) => mapStandingToPlayer(s, tournamentName))

  return {
    currentTournament: tournamentName,
    lastUpdated: new Date(),
    players,
  }
}
