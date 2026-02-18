import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigationStore } from '@/store/investigation'
import { getEntity, getConnectedEntities, getEntityTimeline } from '@/data/loader'
import { ENTITY_COLORS, CATEGORY_LABELS } from '@/utils/colors'
import type { Entity, PersonEntity, TimelineEvent } from '@/types/entities'

type Tab = 'overview' | 'connections' | 'timeline' | 'sources'

function TabButton({ tab, current, label, count, onClick }: {
  tab: Tab; current: Tab; label: string; count?: number; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={tab === current}
      aria-controls={`tabpanel-${tab}`}
      className="px-3 py-2 text-xs tracking-wider uppercase transition-all border-b-2"
      style={{
        fontFamily: 'var(--font-mono)',
        color: tab === current ? 'var(--color-accent)' : 'var(--color-text-muted)',
        borderColor: tab === current ? 'var(--color-accent)' : 'transparent',
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1 opacity-50">{count}</span>
      )}
    </button>
  )
}

function ConnectionCard({ entity, relationship }: { entity: Entity; relationship: string }) {
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)

  return (
    <button
      onClick={() => navigateToEntity(entity.id)}
      className="w-full flex items-start gap-3 p-3 min-h-[44px] rounded hover:bg-[var(--color-ink-light)] transition-colors text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
    >
      <div
        className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
        style={{ backgroundColor: ENTITY_COLORS[entity.type] }}
      />
      <div className="min-w-0">
        <div className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
          {entity.name}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mt-0.5 italic">
          {relationship}
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
          {entity.shortDescription}
        </div>
      </div>
      <svg
        className="w-4 h-4 text-[var(--color-ink-lighter)] group-hover:text-[var(--color-text-muted)] transition-colors mt-1 shrink-0"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}

export function DetailPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const selectEntity = useInvestigationStore((s) => s.selectEntity)
  const navigateBack = useInvestigationStore((s) => s.navigateBack)
  const navigationHistory = useInvestigationStore((s) => s.navigationHistory)
  const panelRef = useRef<HTMLDivElement>(null)

  const entity = selectedEntityId ? getEntity(selectedEntityId) : null
  const connected = useMemo(
    () => (selectedEntityId ? getConnectedEntities(selectedEntityId) : []),
    [selectedEntityId]
  )
  const timeline = useMemo(
    () => (selectedEntityId ? getEntityTimeline(selectedEntityId) : []),
    [selectedEntityId]
  )

  const hasHistory = navigationHistory.length > 0

  // Focus management: move focus to panel when entity changes
  useEffect(() => {
    if (entity && panelRef.current) {
      panelRef.current.focus()
    }
  }, [entity?.id])

  if (!entity) return null

  const isPerson = entity.type === 'person'
  const person = isPerson ? (entity as PersonEntity) : null

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        key={entity.id}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-full min-w-0 overflow-y-auto overflow-x-hidden border-l border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)] focus:outline-none"
        style={{ zIndex: 'var(--z-detail)' }}
        tabIndex={-1}
        role="region"
        aria-label={`Details for ${entity.name}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-surface-raised)] border-b border-[var(--color-ink-lighter)] z-10">
          <div className="flex items-start justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ENTITY_COLORS[entity.type] }}
              />
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {entity.name}
                </h2>
                {person?.role && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                    {person.role}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Back button — only when there's history */}
              {hasHistory && (
                <button
                  onClick={navigateBack}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label="Go back"
                  title="Go back"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {/* Close button — dismiss panel entirely */}
              <button
                onClick={() => selectEntity(null)}
                className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Close detail panel"
                title="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--color-ink-lighter)]" role="tablist" aria-label="Entity details">
            <TabButton tab="overview" current={activeTab} label="Overview" onClick={() => setActiveTab('overview')} />
            <TabButton tab="connections" current={activeTab} label="Links" count={connected.length} onClick={() => setActiveTab('connections')} />
            <TabButton tab="timeline" current={activeTab} label="Events" count={timeline.length} onClick={() => setActiveTab('timeline')} />
            <TabButton tab="sources" current={activeTab} label="Sources" count={entity.sources.length} onClick={() => setActiveTab('sources')} />
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4" role="tabpanel" id={`tabpanel-${activeTab}`} aria-label={activeTab}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: ENTITY_COLORS[entity.type] + '22',
                    color: ENTITY_COLORS[entity.type],
                  }}
                >
                  {CATEGORY_LABELS[entity.type]}
                </span>
                {isPerson && person?.category && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[var(--color-ink-light)] text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {person.category}
                  </span>
                )}
                {entity.significance === 1 && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider" style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: '#991b1b22',
                    color: '#b91c1c',
                  }}>
                    Central
                  </span>
                )}
              </div>

              {/* Dates for people */}
              {person?.dateOfBirth && (
                <div className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {person.dateOfBirth}
                  {person.dateOfDeath && ` — ${person.dateOfDeath}`}
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {entity.detailedDescription}
                </p>
              </div>

              {/* Deep dive */}
              {entity.deepDive && (
                <div className="pt-4 border-t border-[var(--color-ink-lighter)]">
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
                    Deep Dive
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {entity.deepDive}
                  </p>
                </div>
              )}

              {/* Key positions for people */}
              {person?.keyPositions && person.keyPositions.length > 0 && (
                <div className="pt-4 border-t border-[var(--color-ink-lighter)]">
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-secondary)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    Known Positions
                  </h3>
                  <ul className="space-y-1">
                    {person.keyPositions.map((pos, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)]">
                        {pos}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-1">
              {connected.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No documented connections.</p>
              ) : (
                connected.map((conn) => {
                  const connectionRef = entity.connections.find((c) => c.targetId === conn.id)
                  return (
                    <ConnectionCard
                      key={conn.id}
                      entity={conn}
                      relationship={connectionRef?.relationship || 'Connected to'}
                    />
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No timeline events documented.</p>
              ) : (
                timeline.map((event: TimelineEvent) => (
                  <div key={event.id} className="border-l-2 border-[var(--color-ink-lighter)] pl-4">
                    <span className="text-[10px] text-[var(--color-text-secondary)] tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                      {event.date}
                    </span>
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">
                      {event.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-3">
              {entity.sources.map((source, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider mt-0.5"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      backgroundColor:
                        source.reliability === 'primary' ? '#6b8f6b22' :
                        source.reliability === 'secondary' ? '#6b8aad22' : '#c49a6c22',
                      color:
                        source.reliability === 'primary' ? '#6b8f6b' :
                        source.reliability === 'secondary' ? '#6b8aad' : '#c49a6c',
                    }}
                  >
                    {source.reliability}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {source.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
