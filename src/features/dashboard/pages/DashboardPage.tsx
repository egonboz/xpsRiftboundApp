import { useState, useMemo } from 'react'
import { PageContainer, Skeleton, SectionCard } from '@/components/ui/shared'
import { Header } from '@/components/layout/Header'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { StandingsSection } from '@/features/dashboard/components/StandingsSection'
import { GroupLeaderboard } from '@/features/dashboard/components/GroupLeaderboard'
import { QuickSummary } from '@/features/dashboard/components/QuickSummary'
import { PlayerCardsSection } from '@/features/dashboard/components/PlayerCardsSection'
import { formatRelativeTime } from '@/lib/utils'
import { useTournamentSearch } from '@/lib/useTournamentSearch'
import { TRACKED_PLAYERS } from '@/config/trackedPlayers'

export function DashboardPage() {
  const { tournamentId, setTournamentId } = useTournamentSearch()
  const { data, isLoading, error, waitingEventName } = useDashboard(tournamentId)
  const [inputValue, setInputValue] = useState(tournamentId ?? '')

  if (!tournamentId) {
    return (
      <>
        <Header title="Riftbound Tracker" />
        <PageContainer>
          <div className="glass flex flex-col items-center gap-4 rounded-3xl p-8 text-center">
            <div className="text-4xl">🆔</div>
            <h3 className="text-lg font-semibold">Enter Event ID</h3>
            <p className="text-sm text-gray-400">
              Paste the event ID from the locator URL to load standings.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = inputValue.trim()
                if (trimmed) setTournamentId(trimmed)
              }}
              className="flex w-full max-w-xs gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 977259"
                className="flex-1 rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-gold/40 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-xl bg-accent-gold/20 px-4 py-2.5 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/30 disabled:opacity-40"
                disabled={!inputValue.trim()}
              >
                Load
              </button>
            </form>
          </div>
        </PageContainer>
      </>
    )
  }

  if (waitingEventName) {
    return (
      <>
        <Header title="Riftbound Tracker" subtitle={waitingEventName} />
        <PageContainer>
          <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
            <div className="text-4xl">⏳</div>
            <h3 className="text-lg font-semibold">Waiting for First Round</h3>
            <p className="text-sm text-gray-400">
              The event has not started yet. Standings will appear once the first round is generated.
            </p>
            <button
              type="button"
              onClick={() => setTournamentId('')}
              className="rounded-xl bg-surface-lighter px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
            >
              Change ID
            </button>
          </div>
        </PageContainer>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title="Riftbound Tracker" />
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
                onClick={() => setTournamentId('')}
                className="rounded-xl bg-surface-lighter px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
              >
                Change ID
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
        title="Riftbound Tracker"
        subtitle={data ? `${data.currentTournament} · ${formatRelativeTime(data.lastUpdated)}` : 'Loading...'}
        onRefresh={() => window.location.reload()}
      />

      <PageContainer>
        {isLoading ? (
          <DashboardSkeleton />
        ) : data ? (
          <DashboardContent data={data} />
        ) : null}
      </PageContainer>
    </>
  )
}

import type { DashboardData } from '@/entities/player/types'

function DashboardContent({ data }: { data: DashboardData }) {
  const { filtered, missing } = useMemo(() => {
    const filtered = data.players.filter((p) =>
      TRACKED_PLAYERS.some((name) => p.displayName === name)
    )
    const foundNames = new Set(filtered.map((p) => p.displayName))
    const missing = TRACKED_PLAYERS.filter((name) => !foundNames.has(name))
    return { filtered, missing }
  }, [data])

  return (
    <div className="space-y-4">
      {missing.length > 0 && (
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
