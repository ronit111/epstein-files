import { useRef, useMemo, useCallback, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useInvestigationStore } from '@/store/investigation'
import { buildGraphData, filterGraphData } from '@/data/graph-builder'
import { ENTITY_COLORS, ENTITY_COLORS_DIM, NODE_SIZES } from '@/utils/colors'
import type { GraphNode, GraphLink } from '@/types/entities'

export function NetworkGraphPanel() {
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId)
  const hoveredEntityId = useInvestigationStore((s) => s.hoveredEntityId)
  const filters = useInvestigationStore((s) => s.filters)
  const timelineRange = useInvestigationStore((s) => s.timelineRange)
  const navigateToEntity = useInvestigationStore((s) => s.navigateToEntity)
  const hoverEntity = useInvestigationStore((s) => s.hoverEntity)

  // Build and filter graph data
  const fullGraphData = useMemo(() => buildGraphData(), [])
  const graphData = useMemo(
    () =>
      filterGraphData(fullGraphData, {
        entityTypes: filters.entityTypes,
        significanceMin: filters.significanceMin,
        verifiedOnly: filters.verifiedOnly,
        timelineRange,
        searchQuery: filters.searchQuery,
      }),
    [fullGraphData, filters, timelineRange]
  )

  // Get connected node IDs for highlighting
  const connectedNodeIds = useMemo(() => {
    const highlightId = selectedEntityId || hoveredEntityId
    if (!highlightId) return new Set<string>()
    const connected = new Set<string>()
    connected.add(highlightId)
    graphData.links.forEach((link) => {
      const src = typeof link.source === 'object' ? (link.source as any).id : link.source
      const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target
      if (src === highlightId) connected.add(tgt)
      if (tgt === highlightId) connected.add(src)
    })
    return connected
  }, [selectedEntityId, hoveredEntityId, graphData.links])

  const hasHighlight = connectedNodeIds.size > 0

  // Custom node rendering on canvas
  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const size = NODE_SIZES[node.significance] || 6
      const isHighlighted = connectedNodeIds.has(node.id)
      const isSelected = node.id === selectedEntityId
      const isHovered = node.id === hoveredEntityId

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI)

      if (hasHighlight && !isHighlighted) {
        ctx.fillStyle = ENTITY_COLORS_DIM[node.type] || '#33415544'
      } else {
        ctx.fillStyle = ENTITY_COLORS[node.type] || '#64748b'
      }
      ctx.fill()

      // Selected ring
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, size + 3, 0, 2 * Math.PI)
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Hovered ring
      if (isHovered && !isSelected) {
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, size + 2, 0, 2 * Math.PI)
        ctx.strokeStyle = '#f59e0b88'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Labels at medium+ zoom
      if (globalScale > 0.8 && (node.significance <= 2 || globalScale > 1.5)) {
        const label = node.name
        const fontSize = Math.max(10 / globalScale, 3)
        ctx.font = `${fontSize}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        if (hasHighlight && !isHighlighted) {
          ctx.fillStyle = '#64748b44'
        } else {
          ctx.fillStyle = '#f8fafc'
        }
        ctx.fillText(label, node.x!, node.y! + size + 3)
      }
    },
    [connectedNodeIds, selectedEntityId, hoveredEntityId, hasHighlight]
  )

  // Custom link rendering
  const paintLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const src = typeof link.source === 'object' ? link.source : { id: link.source, x: 0, y: 0 }
      const tgt = typeof link.target === 'object' ? link.target : { id: link.target, x: 0, y: 0 }

      const isConnected =
        connectedNodeIds.has(src.id) && connectedNodeIds.has(tgt.id)

      ctx.beginPath()
      ctx.moveTo(src.x, src.y)
      ctx.lineTo(tgt.x, tgt.y)

      if (hasHighlight) {
        ctx.strokeStyle = isConnected
          ? (link.verified ? '#f59e0b55' : '#64748b44')
          : '#1e293b22'
        ctx.lineWidth = isConnected ? 1.5 : 0.3
      } else {
        ctx.strokeStyle = link.verified ? '#f59e0b33' : '#64748b22'
        ctx.lineWidth = 0.8
      }

      if (!link.verified) {
        ctx.setLineDash([3, 3])
      }
      ctx.stroke()
      ctx.setLineDash([])
    },
    [connectedNodeIds, hasHighlight]
  )

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      navigateToEntity(node.id)
      // Center camera on clicked node
      graphRef.current?.centerAt(node.x, node.y, 400)
      graphRef.current?.zoom(2, 400)
    },
    [navigateToEntity]
  )

  // Auto-fit on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      graphRef.current?.zoomToFit(400, 60)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--color-surface)] overflow-hidden"
      style={{ zIndex: 'var(--z-graph)' }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel=""
        nodeCanvasObject={paintNode as any}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          const size = NODE_SIZES[node.significance as 1 | 2 | 3] || 6
          ctx.beginPath()
          ctx.arc(node.x!, node.y!, size + 4, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
        }}
        linkCanvasObject={paintLink}
        onNodeClick={handleNodeClick as any}
        onNodeHover={(node: any) => hoverEntity(node?.id || null)}
        cooldownTicks={100}
        warmupTicks={50}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        backgroundColor="transparent"
        width={containerRef.current?.clientWidth}
        height={containerRef.current?.clientHeight}
      />

      {/* Graph legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-[var(--color-surface-overlay)] backdrop-blur-sm rounded px-3 py-2">
        {(['person', 'organization', 'document', 'location'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ENTITY_COLORS[type] }}
            />
            <span className="capitalize">{type === 'organization' ? 'Org' : type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-1 pt-1 border-t border-[var(--color-ink-lighter)]">
          <div className="w-4 border-t border-[var(--color-amber-accent)]" />
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="w-4 border-t border-dashed border-[var(--color-blue-neutral)]" />
          <span>Reported</span>
        </div>
      </div>
    </div>
  )
}
