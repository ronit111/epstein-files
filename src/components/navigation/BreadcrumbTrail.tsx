import { useInvestigationStore } from '@/store/investigation'
import { getEntity } from '@/data/loader'

export function BreadcrumbTrail() {
  const history = useInvestigationStore((s) => s.navigationHistory)
  const selectedId = useInvestigationStore((s) => s.selectedEntityId)
  const navigateToHistoryIndex = useInvestigationStore((s) => s.navigateToHistoryIndex)
  const navigateBack = useInvestigationStore((s) => s.navigateBack)

  if (history.length === 0 && !selectedId) return null

  const items = history.map((id) => getEntity(id)).filter(Boolean)

  return (
    <nav className="flex items-center gap-1 text-xs overflow-x-auto scrollbar-none" aria-label="Navigation history">
      {items.map((entity, index) => (
        <div key={`${entity!.id}-${index}`} className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => navigateToHistoryIndex(index)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors truncate max-w-[120px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] rounded"
          >
            {entity!.name}
          </button>
          <svg
            width="10" height="10" viewBox="0 0 10 10"
            className="text-[var(--color-ink-lighter)] shrink-0"
            aria-hidden="true"
          >
            <path d="M3 2l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      ))}
      {selectedId && (
        <span className="text-[var(--color-text-primary)] shrink-0 truncate max-w-[140px]">
          {getEntity(selectedId)?.name}
        </span>
      )}
      {history.length > 0 && (
        <button
          onClick={navigateBack}
          className="ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] rounded"
          title="Go back"
          aria-label="Go back in history"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </nav>
  )
}
