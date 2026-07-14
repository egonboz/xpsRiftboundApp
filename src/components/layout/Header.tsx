import { RefreshCw } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
}

export function Header({ title, subtitle, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-colors hover:text-gray-200 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  )
}
