import { useMemo } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { getAllTimelineEvents } from '@/data/loader'
import type { TimelineEvent, EventCategory } from '@/types/entities'

const CATEGORY_COLORS: Record<EventCategory, string> = {
  legal: '#c49a6c',
  financial: '#6b8aad',
  political: '#8b7e99',
  death: '#991b1b',
  'document-release': '#9b8ec4',
  media: '#6b8f6b',
  investigation: '#c49a6c',
  arrest: '#991b1b',
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length === 1) return parts[0]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[parseInt(parts[1], 10) - 1] || ''
  return parts.length >= 3 ? `${month} ${parseInt(parts[2], 10)}, ${parts[0]}` : `${month} ${parts[0]}`
}

function TimelineEventCard({ event }: { event: TimelineEvent }) {
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const highlightedId = useInvestigationStore((s) => s.highlightedTimelineEventId)
  const highlightTimelineEvent = useInvestigationStore((s) => s.highlightTimelineEvent)
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)

  const isRelated = selectedEntityId
    ? event.relatedEntityIds.includes(selectedEntityId)
    : true
  const isHighlighted = highlightedId === event.id

  const handleClick = () => {
    if (event.relatedEntityIds[0]) {
      navigateToEntity(event.relatedEntityIds[0])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="group relative pl-6 pb-6 cursor-pointer transition-opacity duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)] rounded"
      style={{ opacity: isRelated ? 1 : 0.45 }}
      onMouseEnter={() => highlightTimelineEvent(event.id)}
      onMouseLeave={() => highlightTimelineEvent(null)}
      onFocus={() => highlightTimelineEvent(event.id)}
      onBlur={() => highlightTimelineEvent(null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${formatDate(event.date)}: ${event.title}`}
    >
      {/* Timeline line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[var(--color-ink-lighter)]" />

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 transition-all duration-300"
        style={{
          borderColor: CATEGORY_COLORS[event.category] || '#71717a',
          backgroundColor: isHighlighted
            ? CATEGORY_COLORS[event.category]
            : 'var(--color-surface)',
          boxShadow: isHighlighted
            ? `0 0 8px ${CATEGORY_COLORS[event.category]}66`
            : 'none',
        }}
      />

      {/* Date */}
      <span
        className="block text-[10px] text-[var(--color-text-secondary)] mb-0.5 tracking-wider"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {formatDate(event.date)}
      </span>

      {/* Title */}
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-tight mb-1 group-hover:text-[var(--color-accent)] transition-colors">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
        {event.description}
      </p>

      {/* Significance indicator */}
      {event.significance === 1 && (
        <div
          className="absolute -left-1 top-0 w-1 h-full rounded"
          style={{ backgroundColor: CATEGORY_COLORS[event.category] + '33' }}
        />
      )}
    </div>
  )
}

export function TimelinePanel() {
  const events = useMemo(() => getAllTimelineEvents(), [])

  // Group by year
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {}
    events.forEach((event) => {
      const year = event.date.slice(0, 4)
      if (!groups[year]) groups[year] = []
      groups[year].push(event)
    })
    return groups
  }, [events])

  const years = Object.keys(groupedEvents).sort()

  return (
    <nav
      className="h-full overflow-y-auto border-r border-[var(--color-ink-lighter)] bg-[var(--color-surface)]"
      style={{ zIndex: 'var(--z-timeline)' }}
      aria-label="Case timeline"
    >
      <div className="p-4">
        <h2
          className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] mb-6"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Timeline
        </h2>

        {years.map((year) => (
          <div key={year} className="mb-6">
            {/* Year marker */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-lg font-bold text-[var(--color-text-secondary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {year}
              </span>
              <div className="flex-1 h-px bg-[var(--color-ink-lighter)]" />
            </div>

            {/* Events in this year */}
            {groupedEvents[year].map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>
    </nav>
  )
}
