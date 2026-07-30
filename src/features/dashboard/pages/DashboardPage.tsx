import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/ui/shared'
import { Header } from '@/components/layout/Header'

export function DashboardPage() {
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()

  return (
    <>
      <Header title="Riftbound Tracker" />
      <PageContainer>
        <div className="glass flex flex-col items-center gap-4 rounded-3xl p-8 text-center">
          <div className="text-4xl">🆔</div>
          <h3 className="text-lg font-semibold">Enter Event ID</h3>
          <p className="text-sm text-gray-400">
            Paste the event ID from the locator URL to view tournament standings.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const trimmed = inputValue.trim()
              if (trimmed) navigate(`/tournament/${trimmed}`)
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
