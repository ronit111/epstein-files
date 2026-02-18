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
      className="h-[var(--header-height)] border-b border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)] flex items-center gap-2 md:gap-4 px-3 md:px-4"
      style={{ zIndex: 'var(--z-header)' }}
      role="banner"
    >
      {/* Logo / Title */}
      <button
        onClick={resetAll}
        className="flex items-center gap-2 shrink-0 group"
        aria-label="Reset investigation board"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:shadow-[0_0_8px_var(--color-accent)] transition-shadow" />
        <h1
          className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="hidden sm:inline">The Epstein Files</span>
          <span className="sm:hidden">TEF</span>
        </h1>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Breadcrumbs — hidden on mobile */}
      <div className="flex-1 overflow-hidden hidden md:block">
        <BreadcrumbTrail />
      </div>

      {/* Filters — hidden on mobile */}
      <div className="hidden md:block">
        <FilterControls />
      </div>

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
