import { useInvestigationStore } from '@/store/investigation'
import { ENTITY_COLORS, CATEGORY_LABELS } from '@/utils/colors'
import type { EntityType } from '@/types/entities'

const ENTITY_TYPES: EntityType[] = ['person', 'organization', 'document', 'location']

export function FilterControls() {
  const filters = useInvestigationStore((s) => s.filters)
  const setFilters = useInvestigationStore((s) => s.setFilters)

  const toggleEntityType = (type: EntityType) => {
    const current = filters.entityTypes
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    // Don't allow empty — at least one must be active
    if (next.length > 0) {
      setFilters({ entityTypes: next })
    }
  }

  const toggleVerified = () => {
    setFilters({ verifiedOnly: !filters.verifiedOnly })
  }

  return (
    <div className="flex items-center gap-2 shrink-0" role="toolbar" aria-label="Entity filters">
      {ENTITY_TYPES.map((type) => {
        const active = filters.entityTypes.includes(type)
        return (
          <button
            key={type}
            onClick={() => toggleEntityType(type)}
            aria-pressed={active}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
            style={{
              opacity: active ? 1 : 0.55,
              color: active ? ENTITY_COLORS[type] : 'var(--color-text-muted)',
            }}
            title={`${active ? 'Hide' : 'Show'} ${CATEGORY_LABELS[type]}`}
          >
            <div
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: ENTITY_COLORS[type],
                opacity: active ? 1 : 0.4,
              }}
            />
            <span className="hidden lg:inline">{CATEGORY_LABELS[type]}</span>
          </button>
        )
      })}
      <div className="w-px h-4 bg-[var(--color-ink-lighter)] mx-1" />
      <button
        onClick={toggleVerified}
        aria-pressed={filters.verifiedOnly}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
        style={{
          color: filters.verifiedOnly ? 'var(--color-accent)' : 'var(--color-text-muted)',
        }}
        title="Show only court-verified connections"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2 6l3 3 5-6" />
        </svg>
        <span className="hidden lg:inline">Verified</span>
      </button>
    </div>
  )
}
