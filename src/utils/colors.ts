import type { EntityType } from '@/types/entities';

// Desaturated, documentary-feel entity colors
// These read as faded evidence tags, not app UI
export const ENTITY_COLORS: Record<EntityType, string> = {
  person: '#c49a6c',       // Muted ochre — warm but restrained
  organization: '#6b8aad', // Steel blue — institutional, cold
  event: '#8b7e99',        // Muted violet — somber
  document: '#9b8ec4',     // Muted lavender — paper/ink
  location: '#6b8f6b',     // Muted sage — earthy, grounded
};

export const ENTITY_COLORS_DIM: Record<EntityType, string> = {
  person: '#c49a6c33',
  organization: '#6b8aad33',
  event: '#8b7e9933',
  document: '#9b8ec433',
  location: '#6b8f6b33',
};

// Glow colors for node bloom effect (slightly brighter, with transparency)
export const ENTITY_COLORS_GLOW: Record<EntityType, string> = {
  person: '#c49a6c22',
  organization: '#6b8aad22',
  event: '#8b7e9922',
  document: '#9b8ec422',
  location: '#6b8f6b22',
};

export const CATEGORY_LABELS: Record<EntityType, string> = {
  person: 'People',
  organization: 'Organizations',
  event: 'Events',
  document: 'Documents',
  location: 'Locations',
};

export const NODE_SIZES: Record<1 | 2 | 3, number> = {
  1: 14,
  2: 9,
  3: 5,
};
