export interface PlayerStatistics {
  totalTournaments: number
  wins: number
  averageRank: number
  bestRank: number
  top8: number
  top16: number
  top32: number
  winRate: number
  favoriteDeck: string
  currentStreak: string
}

export interface Player {
  id: string
  displayName: string
  avatar: string
  currentRank: number
  matchesWon: number
  matchesLost: number
  matchesDrawn: number
  matchPoints: number
  overallRecord: string
  deckName: string
  deckImage: string
  status: 'playing' | 'eliminated' | 'qualified'
  currentTournament: string
  lastUpdated: Date
  statistics: PlayerStatistics
  recentResults: number[]
  trend: 'up' | 'down' | 'same'
}

export interface DashboardData {
  currentTournament: string
  lastUpdated: Date
  players: Player[]
}
