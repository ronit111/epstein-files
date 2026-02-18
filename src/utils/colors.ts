import type { EntityType } from '@/types/entities';

export const ENTITY_COLORS: Record<EntityType, string> = {
  person: '#f59e0b',       // Amber
  organization: '#3b82f6', // Blue
  event: '#8b5cf6',        // Violet
  document: '#a855f7',     // Purple
  location: '#22c55e',     // Green
};

export const ENTITY_COLORS_DIM: Record<EntityType, string> = {
  person: '#f59e0b44',
  organization: '#3b82f644',
  event: '#8b5cf644',
  document: '#a855f744',
  location: '#22c55e44',
};

export const CATEGORY_LABELS: Record<EntityType, string> = {
  person: 'People',
  organization: 'Organizations',
  event: 'Events',
  document: 'Documents',
  location: 'Locations',
};

export const NODE_SIZES: Record<1 | 2 | 3, number> = {
  1: 12,
  2: 8,
  3: 5,
};
