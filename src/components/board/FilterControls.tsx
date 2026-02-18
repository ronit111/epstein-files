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
    if (next.length > 0) {
      setFilters({ entityTypes: next })
    }
  }

  const toggleVerified = () => {
    setFilters({ verifiedOnly: !filters.verifiedOnly })
  }

  return (
    <div className="flex flex-col gap-1" role="group" aria-label="Entity filters">
      <span
        className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Show
      </span>

      {ENTITY_TYPES.map((type) => {
        const active = filters.entityTypes.includes(type)
        return (
          <button
            key={type}
            onClick={() => toggleEntityType(type)}
            aria-pressed={active}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all hover:bg-[var(--color-surface-overlay)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] w-full text-left"
            style={{
              opacity: active ? 1 : 0.5,
              color: active ? ENTITY_COLORS[type] : 'var(--color-text-muted)',
            }}
            title={`${active ? 'Hide' : 'Show'} ${CATEGORY_LABELS[type]}`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
              style={{
                backgroundColor: ENTITY_COLORS[type],
                opacity: active ? 1 : 0.4,
              }}
            />
            {CATEGORY_LABELS[type]}
          </button>
        )
      })}

      <div className="h-px bg-[var(--color-ink-lighter)] my-1" />

      <button
        onClick={toggleVerified}
        aria-pressed={filters.verifiedOnly}
        className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all hover:bg-[var(--color-surface-overlay)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] w-full text-left"
        style={{
          color: filters.verifiedOnly ? 'var(--color-accent)' : 'var(--color-text-muted)',
        }}
        title="Show only court-verified connections"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="shrink-0">
          <path d="M2 6l3 3 5-6" />
        </svg>
        Verified only
      </button>
    </div>
  )
}
