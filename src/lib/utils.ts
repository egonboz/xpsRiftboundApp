export function formatRecord(wins: number, losses: number, draws: number): string {
  return `${wins}-${losses}-${draws}`
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
}

export function getRankSuffix(rank: number): string {
  if (rank >= 11 && rank <= 13) return 'th'
  switch (rank % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
