interface MatchPlayer {
  id: string
  name: string
  matches_won: number
  matches_lost: number
  matches_drawn: number
  total_match_points: number
  legend: {
    name: string
    domains: string[]
    image_url: string
    crop: {
      avatar: string
      strip: string
      big: string
    }
  } | null
}

export interface Match {
  id: number
  table_number: number
  status: string
  winning_player: string
  games_won_by_winner: number
  games_won_by_loser: number
  games_drawn: number
  match_is_bye: boolean
  match_is_intentional_draw: boolean
  match_is_unintentional_draw: boolean
  players: MatchPlayer[]
}

export interface PlayerInfo {
  pk: number
  elo: number
  peak_elo: number
  country: string
  community: string
  flag_code: string
  profile_url: string
}

export interface PairingsResponse {
  matches: Match[]
  standings: unknown[]
  players: Record<string, PlayerInfo>
}
