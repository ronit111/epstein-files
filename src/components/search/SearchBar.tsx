import { useState, useRef, useEffect } from 'react'
import { searchEntities } from '@/data/search-index'
import { useInvestigationStore } from '@/store/investigation'
import { ENTITY_COLORS } from '@/utils/colors'
import type { Entity } from '@/types/entities'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Entity[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchEntities(query)
      setResults(matches)
      setIsOpen(matches.length > 0)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSelect = (entity: Entity) => {
    navigateToEntity(entity.id)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('')
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
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
          placeholder="Search people, documents, events..."
          className="w-full pl-9 pr-3 py-1.5 bg-[var(--color-ink-light)] border border-[var(--color-ink-lighter)] rounded text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-amber-accent)] transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface-raised)] border border-[var(--color-ink-lighter)] rounded shadow-2xl overflow-hidden"
          style={{ zIndex: 'var(--z-search-results)' }}
        >
          {results.map((entity) => (
            <button
              key={entity.id}
              onClick={() => handleSelect(entity)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--color-ink-light)] transition-colors"
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
          ))}
        </div>
      )}
    </div>
  )
}
