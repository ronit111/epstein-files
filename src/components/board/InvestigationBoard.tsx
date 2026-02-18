import { useInvestigationStore } from '@/store/investigation'
import { BoardHeader } from './BoardHeader'
import { TimelinePanel } from '@/components/timeline/TimelinePanel'
import { NetworkGraphPanel } from '@/components/graph/NetworkGraphPanel'
import { DetailPanel } from '@/components/detail/DetailPanel'

export function InvestigationBoard() {
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)

  return (
    <div className="h-screen flex flex-col bg-[var(--color-surface)] overflow-hidden">
      <BoardHeader />
      <div
        className="flex-1 grid overflow-hidden transition-all duration-500"
        style={{
          gridTemplateColumns: selectedEntityId
            ? `var(--timeline-width) 1fr var(--detail-panel-width)`
            : `var(--timeline-width) 1fr`,
        }}
      >
        <TimelinePanel />
        <NetworkGraphPanel />
        {selectedEntityId && <DetailPanel />}
      </div>
    </div>
  )
}
