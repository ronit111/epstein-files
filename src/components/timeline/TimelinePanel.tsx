import { useMemo } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { getAllTimelineEvents } from '@/data/loader'
import type { TimelineEvent, EventCategory } from '@/types/entities'

const CATEGORY_COLORS: Record<EventCategory, string> = {
  legal: '#f59e0b',
  financial: '#3b82f6',
  political: '#8b5cf6',
  death: '#ef4444',
  'document-release': '#a855f7',
  media: '#22c55e',
  investigation: '#f59e0b',
  arrest: '#ef4444',
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

  return (
    <div
      className="group relative pl-6 pb-6 cursor-pointer transition-opacity duration-300"
      style={{ opacity: isRelated ? 1 : 0.25 }}
      onMouseEnter={() => highlightTimelineEvent(event.id)}
      onMouseLeave={() => highlightTimelineEvent(null)}
      onClick={() => {
        // Navigate to first related entity
        if (event.relatedEntityIds[0]) {
          navigateToEntity(event.relatedEntityIds[0])
        }
      }}
    >
      {/* Timeline line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[var(--color-ink-lighter)]" />

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 transition-all duration-300"
        style={{
          borderColor: CATEGORY_COLORS[event.category] || '#64748b',
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
        className="block text-[10px] text-[var(--color-text-muted)] mb-0.5 tracking-wider"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {formatDate(event.date)}
      </span>

      {/* Title */}
      <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-tight mb-1 group-hover:text-[var(--color-amber-accent)] transition-colors">
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
    <div
      className="h-full overflow-y-auto border-r border-[var(--color-ink-lighter)] bg-[var(--color-surface)]"
      style={{ zIndex: 'var(--z-timeline)' }}
    >
      <div className="p-4">
        <h2
          className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)] mb-6"
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
    </div>
  )
}
