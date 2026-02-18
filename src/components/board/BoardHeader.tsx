import { useState, useRef, useEffect } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { SearchBar } from '@/components/search/SearchBar'
import { BreadcrumbTrail } from '@/components/navigation/BreadcrumbTrail'
import { FilterControls } from '@/components/board/FilterControls'

export function BoardHeader() {
  const resetAll = useInvestigationStore((s) => s.resetAll)
  const setIntroComplete = useInvestigationStore((s) => s.setIntroComplete)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!filtersOpen) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filtersOpen])

  // Close on Escape — stopImmediatePropagation prevents App.tsx's
  // Escape handler from also closing the detail panel simultaneously.
  useEffect(() => {
    if (!filtersOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        setFiltersOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [filtersOpen])

  return (
    <header
      className="h-[var(--header-height)] border-b border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)] flex items-center gap-2 lg:gap-4 px-3 lg:px-4"
      style={{ zIndex: 'var(--z-header)' }}
      role="banner"
    >
      {/* Logo / Title */}
      <button
        onClick={() => {
          resetAll()
          setIntroComplete(false)
          window.location.hash = ''
        }}
        className="flex items-center gap-2 shrink-0 group min-h-[44px]"
        aria-label="Return to introduction"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:shadow-[0_0_8px_var(--color-accent)] transition-shadow" />
        <h1
          className="text-xs lg:text-sm font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors"
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

      {/* Breadcrumbs — hidden on mobile/tablet */}
      <div className="flex-1 overflow-hidden hidden lg:block">
        <BreadcrumbTrail />
      </div>

      {/* Filter toggle button — 44px min touch target */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 py-1.5 rounded text-xs transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
          style={{
            color: filtersOpen ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            backgroundColor: filtersOpen ? 'var(--color-surface-overlay)' : 'transparent',
          }}
          aria-expanded={filtersOpen}
          aria-haspopup="true"
          aria-label="Toggle filters"
          title="Filters"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <span className="hidden xl:inline" style={{ fontFamily: 'var(--font-mono)' }}>Filters</span>
        </button>

        {/* Filter dropdown */}
        {filtersOpen && (
          <div
            className="absolute right-0 top-full mt-1 bg-[var(--color-surface-raised)] border border-[var(--color-ink-lighter)] rounded-lg shadow-lg p-3 min-w-[200px]"
            style={{ zIndex: 50 }}
            role="dialog"
            aria-label="Filter controls"
          >
            <FilterControls />
          </div>
        )}
      </div>
    </header>
  )
}
