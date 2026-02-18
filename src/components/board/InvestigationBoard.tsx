import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigationStore } from '@/store/investigation'
import { getEntity } from '@/data/loader'
import { BoardHeader } from './BoardHeader'
import { TimelinePanel } from '@/components/timeline/TimelinePanel'
import { NetworkGraphPanel } from '@/components/graph/NetworkGraphPanel'
import { DetailPanel } from '@/components/detail/DetailPanel'

type MobileTab = 'graph' | 'timeline'

export function InvestigationBoard() {
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const selectEntity = useInvestigationStore((s) => s.selectEntity)
  const [mobileTab, setMobileTab] = useState<MobileTab>('graph')

  const selectedEntity = selectedEntityId ? getEntity(selectedEntityId) : null

  return (
    <div
      id="main-content"
      className="h-dvh flex flex-col bg-[var(--color-surface)] overflow-hidden"
      style={{ paddingTop: 'var(--safe-top)', paddingLeft: 'var(--safe-left)', paddingRight: 'var(--safe-right)' }}
      role="main"
    >
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedEntity
          ? `Now viewing: ${selectedEntity.name}, ${selectedEntity.type}`
          : 'No entity selected. Use the network graph or timeline to select an entity.'}
      </div>

      <BoardHeader />

      {/* Desktop layout (1024px+) */}
      <div
        className="flex-1 hidden lg:grid overflow-hidden transition-all duration-500"
        style={{
          gridTemplateColumns: selectedEntityId
            ? `var(--timeline-width) 1fr var(--detail-panel-width)`
            : `var(--timeline-width) 1fr`,
        }}
      >
        <TimelinePanel />
        <div className="relative min-w-0" role="img" aria-label="Interactive network graph showing connections between entities in the Epstein case. Click nodes to view details.">
          <NetworkGraphPanel />
        </div>
        {selectedEntityId && <DetailPanel />}
      </div>

      {/* Mobile / tablet layout (<1024px) */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden relative">
        <div className="flex-1 min-h-0">
          {mobileTab === 'graph' && <NetworkGraphPanel />}
          {mobileTab === 'timeline' && <TimelinePanel />}
        </div>

        {/* Detail panel as slide-up overlay on mobile */}
        <AnimatePresence>
          {selectedEntityId && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20"
            >
              {/* Tap-to-dismiss backdrop (top sliver) — z-30 to sit above DetailPanel sticky header */}
              <button
                onClick={() => selectEntity(null)}
                className="absolute top-0 left-0 right-0 h-12 z-30"
                aria-label="Close detail panel"
              />
              <DetailPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile tab bar — 44px min touch targets */}
        <div
          className="flex border-t border-[var(--color-ink-lighter)] bg-[var(--color-surface-raised)]"
          style={{ paddingBottom: 'var(--safe-bottom)' }}
        >
          <button
            onClick={() => setMobileTab('graph')}
            className="flex-1 min-h-[44px] py-3 text-xs tracking-wider uppercase text-center transition-colors"
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
            className="flex-1 min-h-[44px] py-3 text-xs tracking-wider uppercase text-center transition-colors"
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
