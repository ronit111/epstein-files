import type { EntityType } from '@/types/entities';

// Entity colors — distinct enough to read instantly on dark canvas
// Pushed saturation up from the archival palette so types are unmistakable
export const ENTITY_COLORS: Record<EntityType, string> = {
  person: '#d4a55a',       // Warm amber — clearly warm, reads as "people"
  organization: '#5b9bd5', // Medium blue — institutional, distinct from purple
  event: '#8b7e99',        // Muted violet — timeline only, not on graph
  document: '#b39ddb',     // Lavender — distinct from blue, reads as "paper"
  location: '#66bb6a',     // Medium green — unmistakable, not sage-grey
};

export const ENTITY_COLORS_DIM: Record<EntityType, string> = {
  person: '#d4a55a33',
  organization: '#5b9bd533',
  event: '#8b7e9933',
  document: '#b39ddb33',
  location: '#66bb6a33',
};

// Glow colors for node bloom effect (slightly brighter, with transparency)
export const ENTITY_COLORS_GLOW: Record<EntityType, string> = {
  person: '#d4a55a22',
  organization: '#5b9bd522',
  event: '#8b7e9922',
  document: '#b39ddb22',
  location: '#66bb6a22',
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
