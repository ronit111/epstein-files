import type { Entity, GraphData, GraphNode, GraphLink } from '@/types/entities';
import { ENTITY_COLORS, NODE_SIZES } from '@/utils/colors';
import { getAllEntities } from './loader';

export function buildGraphData(entities?: Entity[]): GraphData {
  const source = entities ?? getAllEntities();

  // Build nodes
  const nodes: GraphNode[] = source
    .filter((e) => e.type !== 'event') // Events live on the timeline, not the graph
    .map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      significance: entity.significance,
      category: 'category' in entity ? (entity as { category: string }).category : entity.type,
      val: NODE_SIZES[entity.significance] * (entity.connections.length + 1),
      color: ENTITY_COLORS[entity.type],
      imageUrl: entity.imageUrl,
    }));

  const nodeIds = new Set(nodes.map((n) => n.id));

  // Build links (deduplicated — only keep one direction)
  const seenLinks = new Set<string>();
  const links: GraphLink[] = [];

  source.forEach((entity) => {
    entity.connections.forEach((conn) => {
      if (!nodeIds.has(entity.id) || !nodeIds.has(conn.targetId)) return;

      const linkKey = [entity.id, conn.targetId].sort().join('::');
      if (seenLinks.has(linkKey)) return;
      seenLinks.add(linkKey);

      links.push({
        source: entity.id,
        target: conn.targetId,
        strength: conn.strength,
        verified: conn.verified,
        relationship: conn.relationship,
        timeRange: conn.timeRange,
      });
    });
  });

  return { nodes, links };
}

// Filter graph data based on active filters and timeline range
export function filterGraphData(
  graphData: GraphData,
  filters: {
    entityTypes: string[];
    significanceMin: 1 | 2 | 3;
    verifiedOnly: boolean;
    timelineRange?: { start: string; end: string } | null;
    searchQuery?: string;
  }
): GraphData {
  const { entityTypes, significanceMin, verifiedOnly, timelineRange, searchQuery } = filters;

  let filteredNodes = graphData.nodes.filter(
    (node) =>
      entityTypes.includes(node.type) &&
      node.significance <= significanceMin
  );

  if (searchQuery && searchQuery.length > 0) {
    const query = searchQuery.toLowerCase();
    filteredNodes = filteredNodes.filter(
      (node) => node.name.toLowerCase().includes(query)
    );
  }

  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));

  let filteredLinks = graphData.links.filter(
    (link) =>
      visibleNodeIds.has(link.source as string) &&
      visibleNodeIds.has(link.target as string)
  );

  if (verifiedOnly) {
    filteredLinks = filteredLinks.filter((link) => link.verified);
  }

  if (timelineRange) {
    filteredLinks = filteredLinks.filter((link) => {
      if (!link.timeRange) return true; // Show connections without time data
      const start = link.timeRange.start;
      const end = link.timeRange.end ?? '2099-12-31';
      return start <= timelineRange.end && end >= timelineRange.start;
    });
  }

  return { nodes: filteredNodes, links: filteredLinks };
}
