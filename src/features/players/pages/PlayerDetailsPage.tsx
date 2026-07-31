import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft, Medal, TrendingUp, Target, Trophy, Award } from 'lucide-react'
import { PageContainer, Skeleton, StatCard, StatusBadge, SectionCard } from '@/components/ui/shared'
import { usePlayer } from '@/features/players/hooks/usePlayer'
import { formatPercentage } from '@/lib/utils'
import { useTournamentSearch } from '@/lib/useTournamentSearch'
import { setLastPlayer } from '@/lib/lastPlayer'

export function PlayerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { tournamentId, getTo } = useTournamentSearch()
  const { player, allPlayers, isLoading, error } = usePlayer(id ?? '', tournamentId)

  const backTo = tournamentId ? `/tournament/${tournamentId}` : getTo('/')

  useEffect(() => {
    if (player && tournamentId) {
      setLastPlayer({
        id: player.id,
        name: player.displayName,
        tournamentId,
      })
    }
  }, [player, tournamentId])

  if (error) {
    return (
      <PageContainer>
        <Link
          to={backTo}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tournament
        </Link>
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
          <div className="text-4xl">😔</div>
          <p className="text-sm text-gray-400">{error}</p>
          <Link
            to={getTo('/')}
            className="rounded-xl bg-accent-gold/20 px-4 py-2 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/30"
          >
            Go Home
          </Link>
        </div>
      </PageContainer>
    )
  }

  if (isLoading) {
    return <PlayerSkeleton backTo={backTo} />
  }

  if (!player) {
    return (
      <PageContainer>
        <Link
          to={backTo}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tournament
        </Link>
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
          <div className="text-4xl">🔍</div>
          <p className="text-sm text-gray-400">Player not found</p>
          <Link
            to={getTo('/')}
            className="rounded-xl bg-accent-gold/20 px-4 py-2 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/30"
          >
            Go Home
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Link
        to={backTo}
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tournament
      </Link>

      <div className="space-y-4">
        <PlayerHero player={player} />

        <SectionCard title="Statistics">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <StatCard
              label="Wins"
              value={player.statistics.wins}
              icon={<Medal className="h-5 w-5" />}
              variant="gold"
            />
            <StatCard
              label="Win Rate"
              value={formatPercentage(player.statistics.winRate)}
              icon={<TrendingUp className="h-5 w-5" />}
              variant="blue"
            />
            <StatCard
              label="Average Rank"
              value={`#${player.statistics.averageRank}`}
              icon={<Target className="h-5 w-5" />}
              variant="blue"
            />
            <StatCard
              label="Best Rank"
              value={`#${player.statistics.bestRank}`}
              icon={<Award className="h-5 w-5" />}
              variant="purple"
            />
          </div>
        </SectionCard>

        <CurrentTournamentSection player={player} />

        <DeckComparisonSection player={player} allPlayers={allPlayers} />
      </div>
    </PageContainer>
  )
}

function PlayerSkeleton({ backTo }: { backTo: string }) {
  return (
    <PageContainer>
      <Link to={backTo} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400">
        <ArrowLeft className="h-4 w-4" />
        Back to Tournament
      </Link>
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
      </div>
    </PageContainer>
  )
}

function PlayerHero({ player }: { player: NonNullable<ReturnType<typeof usePlayer>['player']> }) {
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/[0.06] via-accent-purple/[0.04] to-transparent" />

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-3">
          <div className="rounded-full bg-gradient-to-br from-accent-gold/30 to-accent-purple/30 p-[3px]">
            <img
              src={player.avatar}
              alt={player.displayName}
              className="h-24 w-24 rounded-full bg-surface"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold">{player.displayName}</h1>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-lg bg-accent-gold/15 px-2 py-0.5 text-sm font-bold text-accent-gold">
            #{player.currentRank}
          </span>
          <StatusBadge status={player.status} />
        </div>

        <p className="mt-2 text-sm text-gray-400">{player.deckName}</p>
      </div>
    </div>
  )
}

function CurrentTournamentSection({ player }: { player: NonNullable<ReturnType<typeof usePlayer>['player']> }) {
  return (
    <SectionCard title="Current Tournament">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Tournament</span>
          <span className="text-sm font-medium">{player.currentTournament}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Rank</span>
          <span className="rounded-lg bg-accent-gold/15 px-2 py-0.5 text-sm font-bold text-accent-gold">
            #{player.currentRank}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Record</span>
          <span className="font-mono text-sm font-semibold">{player.overallRecord}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Match Points</span>
          <span className="text-sm font-bold text-accent-gold">{player.matchPoints} pts</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Deck</span>
          <span className="text-sm">{player.deckName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Status</span>
          <StatusBadge status={player.status} />
        </div>
      </div>
    </SectionCard>
  )
}

function DeckComparisonSection({
  player,
  allPlayers,
}: {
  player: NonNullable<ReturnType<typeof usePlayer>['player']>
  allPlayers: NonNullable<ReturnType<typeof usePlayer>['allPlayers']>
}) {
  const sameDeck = allPlayers.filter((p) => p.deckName === player.deckName)
  const count = sameDeck.length
  const ranks = sameDeck.map((p) => p.currentRank)
  const bestRank = Math.min(...ranks)
  const avgRank = Math.round((ranks.reduce((a, b) => a + b, 0) / count) * 10) / 10
  const playerRankAmongDeck = sameDeck.filter((p) => p.currentRank < player.currentRank).length + 1

  return (
    <SectionCard title={`Deck: ${player.deckName}`}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatCard
          label="Players on this deck"
          value={count}
          icon={<Trophy className="h-5 w-5" />}
          variant="gold"
        />
        <StatCard
          label="Your rank among them"
          value={`#${playerRankAmongDeck} of ${count}`}
          icon={<Target className="h-5 w-5" />}
          variant="gold"
        />
        <StatCard
          label="Best rank"
          value={`#${bestRank}`}
          icon={<Medal className="h-5 w-5" />}
          variant="blue"
        />
        <StatCard
          label="Avg rank"
          value={`#${avgRank}`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="blue"
        />
      </div>
    </SectionCard>
  )
}
