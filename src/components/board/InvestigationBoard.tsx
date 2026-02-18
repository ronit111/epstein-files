import { useState } from 'react'
import { useInvestigationStore } from '@/store/investigation'
import { getEntity } from '@/data/loader'
import { BoardHeader } from './BoardHeader'
import { TimelinePanel } from '@/components/timeline/TimelinePanel'
import { NetworkGraphPanel } from '@/components/graph/NetworkGraphPanel'
import { DetailPanel } from '@/components/detail/DetailPanel'

type MobileTab = 'graph' | 'timeline'

export function InvestigationBoard() {
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const [mobileTab, setMobileTab] = useState<MobileTab>('graph')

  const selectedEntity = selectedEntityId ? getEntity(selectedEntityId) : null

  return (
    <div id="main-content" className="h-screen flex flex-col bg-[var(--color-surface)] overflow-hidden" role="main">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedEntity
          ? `Now viewing: ${selectedEntity.name}, ${selectedEntity.type}`
          : 'No entity selected. Use the network graph or timeline to select an entity.'}
      </div>

      <BoardHeader />

      {/* Desktop layout */}
      <div
        className="flex-1 hidden md:grid overflow-hidden transition-all duration-500"
        style={{
          gridTemplateColumns: selectedEntityId
            ? `var(--timeline-width) 1fr var(--detail-panel-width)`
            : `var(--timeline-width) 1fr`,
        }}
      >
        <TimelinePanel />
        <div className="relative" role="img" aria-label="Interactive network graph showing connections between entities in the Epstein case. Click nodes to view details.">
          <NetworkGraphPanel />
        </div>
        {selectedEntityId && <DetailPanel />}
      </div>

      {/* Mobile layout */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden relative">
        {mobileTab === 'graph' && <NetworkGraphPanel />}
        {mobileTab === 'timeline' && <TimelinePanel />}

        {/* Detail panel as overlay on mobile */}
        {selectedEntityId && (
          <div className="absolute inset-0 z-20">
            <DetailPanel />
          </div>
        )}

        {/* Mobile tab bar */}
        <div className="flex border-t border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)]">
          <button
            onClick={() => setMobileTab('graph')}
            className="flex-1 py-3 text-xs tracking-wider uppercase text-center transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              color: mobileTab === 'graph' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderTop: mobileTab === 'graph' ? '2px solid var(--color-accent)' : '2px solid transparent',
            }}
          >
            Network
          </button>
          <button
            onClick={() => setMobileTab('timeline')}
            className="flex-1 py-3 text-xs tracking-wider uppercase text-center transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              color: mobileTab === 'timeline' ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderTop: mobileTab === 'timeline' ? '2px solid var(--color-accent)' : '2px solid transparent',
            }}
          >
            Timeline
          </button>
        </div>
      </div>
    </div>
  )
}
