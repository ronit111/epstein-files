import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useInvestigationStore } from '@/store/investigation'
import { buildGraphData, filterGraphData } from '@/data/graph-builder'
import { ENTITY_COLORS, ENTITY_COLORS_DIM, ENTITY_COLORS_GLOW, NODE_SIZES } from '@/utils/colors'
import type { GraphNode, GraphLink } from '@/types/entities'

// Ambient pulse — nodes breathe subtly to feel alive
let animFrame = 0

export function NetworkGraphPanel() {
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isSimulating, setIsSimulating] = useState(true)

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

  // Animate frame counter for ambient pulse
  useEffect(() => {
    let running = true
    const tick = () => {
      animFrame = (animFrame + 1) % 600
      if (running) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return () => { running = false }
  }, [])

  // Custom node rendering — glow + bloom + label
  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return
      const baseSize = NODE_SIZES[node.significance] || 6
      const isHighlighted = connectedNodeIds.has(node.id)
      const isSelected = node.id === selectedEntityId
      const isHovered = node.id === hoveredEntityId
      const isDimmed = hasHighlight && !isHighlighted

      // Ambient pulse for significance-1 nodes
      const pulse = node.significance === 1
        ? 1 + Math.sin(animFrame * 0.02 + node.x! * 0.01) * 0.08
        : 1
      const size = baseSize * pulse

      const color = ENTITY_COLORS[node.type] || '#71717a'
      const dimColor = ENTITY_COLORS_DIM[node.type] || '#27272a44'
      const glowColor = ENTITY_COLORS_GLOW[node.type] || '#27272a22'

      // Outer glow / bloom (radial gradient)
      if (!isDimmed) {
        const glowRadius = size * 3
        const gradient = ctx.createRadialGradient(
          node.x!, node.y!, size * 0.5,
          node.x!, node.y!, glowRadius
        )
        gradient.addColorStop(0, (isSelected || isHovered) ? color + '44' : glowColor)
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, glowRadius, 0, 2 * Math.PI)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Core circle
      ctx.beginPath()
      ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI)
      ctx.fillStyle = isDimmed ? dimColor : color
      ctx.fill()

      // Inner highlight (subtle specular)
      if (!isDimmed) {
        const innerGrad = ctx.createRadialGradient(
          node.x! - size * 0.3, node.y! - size * 0.3, 0,
          node.x!, node.y!, size
        )
        innerGrad.addColorStop(0, 'rgba(255,255,255,0.15)')
        innerGrad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI)
        ctx.fillStyle = innerGrad
        ctx.fill()
      }

      // Selected ring
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, size + 4, 0, 2 * Math.PI)
        ctx.strokeStyle = '#d4d4d8'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Hovered ring
      if (isHovered && !isSelected) {
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, size + 3, 0, 2 * Math.PI)
        ctx.strokeStyle = '#a1a1aa88'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Labels at medium+ zoom
      if (globalScale > 0.7 && (node.significance <= 2 || globalScale > 1.5)) {
        const label = node.name
        const fontSize = Math.max(10 / globalScale, 3)
        ctx.font = `500 ${fontSize}px Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        if (isDimmed) {
          ctx.fillStyle = '#71717a33'
        } else if (isSelected || isHovered) {
          ctx.fillStyle = '#fafafa'
        } else {
          ctx.fillStyle = '#a1a1aa'
        }
        ctx.fillText(label, node.x!, node.y! + size + 4)
      }
    },
    [connectedNodeIds, selectedEntityId, hoveredEntityId, hasHighlight]
  )

  // Custom curved link rendering
  const paintLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const src = typeof link.source === 'object' ? link.source : { id: link.source, x: 0, y: 0 }
      const tgt = typeof link.target === 'object' ? link.target : { id: link.target, x: 0, y: 0 }
      if (!Number.isFinite(src.x) || !Number.isFinite(src.y) || !Number.isFinite(tgt.x) || !Number.isFinite(tgt.y)) return

      const isConnected =
        connectedNodeIds.has(src.id) && connectedNodeIds.has(tgt.id)

      // Compute curved midpoint (subtle quadratic bezier)
      const dx = tgt.x - src.x
      const dy = tgt.y - src.y
      const curvature = 0.15
      const midX = (src.x + tgt.x) / 2 + dy * curvature
      const midY = (src.y + tgt.y) / 2 - dx * curvature

      ctx.beginPath()
      ctx.moveTo(src.x, src.y)
      ctx.quadraticCurveTo(midX, midY, tgt.x, tgt.y)

      if (hasHighlight) {
        ctx.strokeStyle = isConnected
          ? (link.verified ? '#a1a1aa44' : '#3f3f4633')
          : '#18181b33'
        ctx.lineWidth = isConnected ? 1.5 : 0.3
      } else {
        ctx.strokeStyle = link.verified ? '#3f3f4655' : '#27272a44'
        ctx.lineWidth = 0.6
      }

      if (!link.verified) {
        ctx.setLineDash([4, 4])
      }
      ctx.stroke()
      ctx.setLineDash([])
    },
    [connectedNodeIds, hasHighlight]
  )

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      navigateToEntity(node.id)
      // Smooth camera transition to clicked node
      graphRef.current?.centerAt(node.x, node.y, 600)
      graphRef.current?.zoom(2.5, 600)
    },
    [navigateToEntity]
  )

  // Track container dimensions via ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Auto-fit on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      graphRef.current?.zoomToFit(600, 80)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Configure d3 forces for natural clustering
  useEffect(() => {
    const fg = graphRef.current
    if (!fg) return

    // Charge: significance-1 nodes repel more strongly (natural hubs)
    fg.d3Force('charge')?.strength((node: any) => {
      const sig = node.significance || 3
      return sig === 1 ? -300 : sig === 2 ? -120 : -50
    })

    // Link distance based on connection strength
    fg.d3Force('link')?.distance((link: any) => {
      const strength = link.strength || 2
      return strength === 1 ? 60 : strength === 2 ? 100 : 150
    })

    // Center force to prevent drift
    fg.d3Force('center')?.strength(0.05)
  }, [graphData])

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--color-surface)] overflow-hidden"
      style={{ zIndex: 'var(--z-graph)' }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Loading state */}
      {isSimulating && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-[var(--color-text-muted)] z-10" style={{ fontFamily: 'var(--font-mono)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Simulating
        </div>
      )}

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel=""
        nodeCanvasObject={paintNode as any}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          const size = NODE_SIZES[node.significance as 1 | 2 | 3] || 6
          ctx.beginPath()
          ctx.arc(node.x!, node.y!, size + 6, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
        }}
        linkCanvasObject={paintLink}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleColor={() => '#71717a'}
        onNodeClick={handleNodeClick as any}
        onNodeHover={(node: any) => hoverEntity(node?.id || null)}
        onEngineStop={() => setIsSimulating(false)}
        cooldownTicks={100}
        warmupTicks={40}
        d3AlphaDecay={0.025}
        d3VelocityDecay={0.3}
        backgroundColor="transparent"
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Graph legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-[var(--color-surface-overlay)] backdrop-blur-sm rounded px-3 py-2 border border-[var(--color-ink-lighter)]">
        {(['person', 'organization', 'document', 'location'] as const).map((type) => (
          <div key={type} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ENTITY_COLORS[type] }}
            />
            <span className="capitalize" style={{ fontFamily: 'var(--font-mono)' }}>
              {type === 'organization' ? 'Org' : type}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mt-1 pt-1 border-t border-[var(--color-ink-lighter)]">
          <div className="w-4 border-t border-[var(--color-text-muted)]" />
          <span style={{ fontFamily: 'var(--font-mono)' }}>Verified</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <div className="w-4 border-t border-dashed border-[var(--color-ink-lighter)]" />
          <span style={{ fontFamily: 'var(--font-mono)' }}>Reported</span>
        </div>
      </div>
    </div>
  )
}
