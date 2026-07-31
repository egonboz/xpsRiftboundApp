import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, Skeleton, SectionCard } from '@/components/ui/shared'
import { Header } from '@/components/layout/Header'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { StandingsSection } from '@/features/dashboard/components/StandingsSection'
import { GroupLeaderboard } from '@/features/dashboard/components/GroupLeaderboard'
import { QuickSummary } from '@/features/dashboard/components/QuickSummary'
import { PlayerCardsSection } from '@/features/dashboard/components/PlayerCardsSection'
import { PairingsSection } from '@/features/tournament/components/PairingsSection'
import { formatRelativeTime } from '@/lib/utils'
import { useTournamentSearch } from '@/lib/useTournamentSearch'
import { TRACKED_PLAYERS } from '@/config/trackedPlayers'
import { useEventRounds } from '@/hooks/useEventRounds'
import { usePairings } from '@/hooks/usePairings'
import { useRegistrations } from '@/hooks/useRegistrations'
import { cn } from '@/lib/cn'
import { setLastTournament } from '@/lib/lastTournament'
import type { DashboardData } from '@/entities/player/types'
import type { Match } from '@/services/pairings/types'
import type { EventRoundInfo } from '@/services/player/eventService'

type ViewMode = 'team' | 'all'

export function TournamentPage() {
  const { tournamentId } = useTournamentSearch()
  const { data, isLoading, error, waitingEventName } = useDashboard(tournamentId)
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('team')
  const { rounds } = useEventRounds(tournamentId)
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null)

  const roundsWithPairings = useMemo(
    () => rounds.filter((r) => r.pairings_status === 'GENERATED'),
    [rounds],
  )

  useEffect(() => {
    if (roundsWithPairings.length === 0) {
      setSelectedRoundId(null)
      return
    }
    const latest = roundsWithPairings.reduce((max, r) =>
      r.round_number > max.round_number ? r : max,
    )
    setSelectedRoundId((prev) => prev ?? String(latest.id))
  }, [roundsWithPairings])

  const { matches: pairings, isLoading: pairingsLoading } = usePairings(selectedRoundId)
  const { players: registeredPlayers, count: registeredCount } = useRegistrations(tournamentId)

  useEffect(() => {
    if (tournamentId) {
      setLastTournament({ id: tournamentId })
    }
  }, [tournamentId])

  if (!tournamentId) {
    return (
      <>
        <Header title="Tournament" />
        <PageContainer>
          <div className="glass flex flex-col items-center gap-4 rounded-3xl p-8 text-center">
            <div className="text-4xl">🏆</div>
            <h3 className="text-lg font-semibold">No Event Selected</h3>
            <p className="text-sm text-gray-400">
              Go to Search and enter an event ID to view tournament standings.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl bg-accent-gold/20 px-4 py-2.5 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/30"
            >
              Back to Search
            </button>
          </div>
        </PageContainer>
      </>
    )
  }

  if (waitingEventName) {
    return (
      <>
        <Header title="Tournament" subtitle={waitingEventName} />
        <PageContainer>
          <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
            <div className="text-4xl">⏳</div>
            <h3 className="text-lg font-semibold">Waiting for First Round</h3>
            <p className="text-sm text-gray-400">
              The event has not started yet. Standings will appear once the first round is generated.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl bg-surface-lighter px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
            >
              Back to Search
            </button>
          </div>

          {registeredPlayers.length > 0 && (
            <SectionCard title={`Registered Players (${registeredCount})`} className="mt-4">
              <div className="space-y-1">
                {registeredPlayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2"
                  >
                    <img
                      src={p.full_profile_picture_url}
                      alt={p.best_identifier}
                      className="h-7 w-7 rounded-full bg-surface-lighter"
                    />
                    <span className="text-sm text-gray-200">{p.best_identifier}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </PageContainer>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title="Tournament" />
        <PageContainer>
          <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
            <div className="text-4xl">😔</div>
            <p className="text-sm text-gray-400">{error}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-accent-gold/20 px-4 py-2 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/30"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-xl bg-surface-lighter px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
              >
                Back to Search
              </button>
            </div>
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <Header
        title="Tournament"
        subtitle={data ? `${data.currentTournament} · ${formatRelativeTime(data.lastUpdated)}` : 'Loading...'}
        onRefresh={() => window.location.reload()}
      />

      <PageContainer>
        {isLoading ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            <div className="mb-4 flex rounded-xl bg-surface-lighter p-1">
              {(['team', 'all'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                    viewMode === mode
                      ? 'bg-accent-gold/20 text-accent-gold'
                      : 'text-gray-400 hover:text-gray-300',
                  )}
                >
                  {mode === 'team' ? 'Team' : 'All Players'}
                </button>
              ))}
            </div>
            <DashboardContent
              data={data}
              viewMode={viewMode}
              pairings={pairings}
              pairingsLoading={pairingsLoading}
              rounds={roundsWithPairings}
              selectedRoundId={selectedRoundId}
              onSelectRound={setSelectedRoundId}
            />
          </>
        ) : null}
      </PageContainer>
    </>
  )
}

function DashboardContent({
  data,
  viewMode,
  pairings,
  pairingsLoading,
  rounds,
  selectedRoundId,
  onSelectRound,
}: {
  data: DashboardData
  viewMode: ViewMode
  pairings: Match[]
  pairingsLoading: boolean
  rounds: EventRoundInfo[]
  selectedRoundId: string | null
  onSelectRound: (id: string) => void
}) {
  const { filtered, missing } = useMemo(() => {
    if (viewMode === 'all') return { filtered: data.players, missing: [] as string[] }
    const filtered = data.players.filter((p) =>
      TRACKED_PLAYERS.some((name) => p.displayName === name),
    )
    const foundNames = new Set(filtered.map((p) => p.displayName))
    const missing = TRACKED_PLAYERS.filter((name) => !foundNames.has(name))
    return { filtered, missing }
  }, [data, viewMode])

  const displayPairings = useMemo(() => {
    if (viewMode === 'all') return pairings
    return pairings.filter((m) =>
      m.players.some((p) => TRACKED_PLAYERS.some((name) => p.name === name)),
    )
  }, [pairings, viewMode])

  return (
    <div className="space-y-4">
      {viewMode === 'team' && missing.length > 0 && (
        <SectionCard title="Not in Tournament">
          <div className="space-y-2">
            {missing.map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl bg-surface-lighter/50 px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-lg">
                  ?
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">{name}</p>
                  <p className="text-xs text-gray-500">Not found in this tournament</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {rounds.length > 1 && selectedRoundId && (
        <RoundSelector
          rounds={rounds}
          selectedId={selectedRoundId}
          onSelect={onSelectRound}
        />
      )}

      <PairingsSection matches={displayPairings} isLoading={pairingsLoading} />

      {filtered.length > 0 && (
        <>
          <SectionCard title="Current Standings">
            <StandingsSection players={filtered} />
          </SectionCard>

          <GroupLeaderboard players={filtered} />

          <QuickSummary players={filtered} />

          <PlayerCardsSection players={filtered} />
        </>
      )}

      {filtered.length === 0 && missing.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
          <p className="text-sm text-gray-400">No players found in this tournament.</p>
        </div>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <SectionCard title="Current Standings">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Group Leaderboard">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-6 w-14" />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quick Summary">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Players">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function RoundSelector({
  rounds,
  selectedId,
  onSelect,
}: {
  rounds: EventRoundInfo[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {rounds.map((r) => {
        const id = String(r.id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              'shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200',
              selectedId === id
                ? 'bg-accent-gold/20 text-accent-gold'
                : 'bg-surface-lighter text-gray-400 hover:text-gray-300',
            )}
          >
            Round {r.round_number}
          </button>
        )
      })}
    </div>
  )
}
