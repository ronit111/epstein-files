import Fuse from 'fuse.js';
import type { Entity } from '@/types/entities';
import { getAllEntities } from './loader';

let searchIndex: Fuse<Entity> | null = null;

// Type priority: people and orgs rank above documents/locations for name matches
const TYPE_BOOST: Record<string, number> = {
  person: 0,
  organization: 0.02,
  document: 0.05,
  location: 0.05,
};

export function getSearchIndex(): Fuse<Entity> {
  if (!searchIndex) {
    searchIndex = new Fuse(getAllEntities(), {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'shortDescription', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'role', weight: 1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }
  return searchIndex;
}

export function searchEntities(query: string, limit = 10): Entity[] {
  if (!query || query.length < 2) return [];
  const results = getSearchIndex().search(query, { limit: limit * 2 });
  // Re-rank: Fuse score (lower = better) + type boost penalty for non-person entities
  return results
    .sort((a, b) => {
      const scoreA = (a.score ?? 0) + (TYPE_BOOST[a.item.type] ?? 0.05);
      const scoreB = (b.score ?? 0) + (TYPE_BOOST[b.item.type] ?? 0.05);
      return scoreA - scoreB;
    })
    .slice(0, limit)
    .map((r) => r.item);
}
