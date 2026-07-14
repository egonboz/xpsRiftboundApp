export interface ApiDeckDefiningCard {
  id: string
  name: string
  image_url: string
}

export interface ApiUser {
  id: number
  pronouns: string | null
  country_code: string | null
}

export interface ApiUserEventStatus {
  id: number
  matches_won: number
  matches_drawn: number
  matches_lost: number
  total_match_points: number
  full_profile_picture_url: string
  registration_status: string
  best_identifier: string
  is_guest: boolean
  user: ApiUser
  deck_defining_card: ApiDeckDefiningCard | null
}

export interface ApiPlayer {
  id: number
  best_identifier: string
}

export interface ApiStanding {
  player: ApiPlayer
  user_event_status: ApiUserEventStatus
  round_number: number
  id: number
  rank: number
  record: string
  match_record: string
  match_points: number
  opponent_match_win_percentage: number
  game_win_percentage: number
  opponent_game_win_percentage: number
  points: number
}

export interface ApiStandingsResponse {
  standings: ApiStanding[]
  round_number: number
}
