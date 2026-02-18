import { useState, useRef, useEffect, useCallback } from 'react'
import { searchEntities } from '@/data/search-index'
import { useInvestigationStore } from '@/store/investigation'
import { ENTITY_COLORS } from '@/utils/colors'
import type { Entity } from '@/types/entities'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Entity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchEntities(query)
      setResults(matches)
      setIsOpen(true)
      setActiveIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }, [query])

  // Cmd+K / Ctrl+K global shortcut to focus search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  const handleSelect = useCallback((entity: Entity) => {
    navigateToEntity(entity.id)
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }, [navigateToEntity])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('')
      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault()
      handleSelect(results[activeIndex])
    }
  }

  return (
    <div className="relative" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search entities..."
          aria-label="Search people, documents, events"
          aria-autocomplete="list"
          className="w-full pl-9 pr-16 py-1.5 bg-[var(--color-ink-light)] border border-[var(--color-ink-lighter)] rounded text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        />
        {/* Keyboard shortcut hint */}
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--color-text-muted)] bg-[var(--color-ink-lighter)] px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)' }}>
          {navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl'}K
        </kbd>
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface-raised)] border border-[var(--color-ink-lighter)] rounded shadow-2xl overflow-hidden"
          style={{ zIndex: 'var(--z-search-results)' }}
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-[var(--color-text-muted)]">
              No results for "{query}"
            </div>
          ) : (
            results.map((entity, index) => (
              <button
                key={entity.id}
                onClick={() => handleSelect(entity)}
                role="option"
                aria-selected={index === activeIndex}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: index === activeIndex ? 'var(--color-ink-light)' : 'transparent',
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ENTITY_COLORS[entity.type] }}
                />
                <div className="min-w-0">
                  <div className="text-sm text-[var(--color-text-primary)] truncate">
                    {entity.name}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">
                    {entity.shortDescription}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
