import { useInvestigationStore } from '@/store/investigation'
import { SearchBar } from '@/components/search/SearchBar'
import { BreadcrumbTrail } from '@/components/navigation/BreadcrumbTrail'
import { FilterControls } from '@/components/board/FilterControls'

export function BoardHeader() {
  const setIntroComplete = useInvestigationStore((s) => s.setIntroComplete)
  const resetAll = useInvestigationStore((s) => s.resetAll)

  const handleReplayIntro = () => {
    setIntroComplete(false)
    window.location.hash = ''
  }

  return (
    <header
      className="h-[var(--header-height)] border-b border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)] flex items-center gap-4 px-4"
      style={{ zIndex: 'var(--z-header)' }}
    >
      {/* Logo / Title */}
      <button
        onClick={resetAll}
        className="flex items-center gap-2 shrink-0 group"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--color-amber-accent)] group-hover:shadow-[0_0_8px_var(--color-amber-accent)] transition-shadow" />
        <h1
          className="text-sm font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          The Epstein Files
        </h1>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Breadcrumbs */}
      <div className="flex-1 overflow-hidden">
        <BreadcrumbTrail />
      </div>

      {/* Filters */}
      <FilterControls />

      {/* Replay intro */}
      <button
        onClick={handleReplayIntro}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors shrink-0"
        title="Replay introduction"
      >
        Intro
      </button>
    </header>
  )
}
