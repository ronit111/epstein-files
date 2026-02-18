import Fuse from 'fuse.js';
import type { Entity } from '@/types/entities';
import { getAllEntities } from './loader';

let searchIndex: Fuse<Entity> | null = null;

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
  const results = getSearchIndex().search(query, { limit });
  return results.map((r) => r.item);
}
