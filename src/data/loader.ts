import type { Entity, PersonEntity, OrganizationEntity, EventEntity, DocumentEntity, LocationEntity, TimelineEvent } from '@/types/entities';

// Static imports — Vite bundles these at build time
import peopleData from '@data/entities/people.json';
import orgsData from '@data/entities/organizations.json';
import documentsData from '@data/entities/documents.json';
import locationsData from '@data/entities/locations.json';
import timelineData from '@data/timeline/events.json';
import introData from '@data/content/intro-sections.json';

// Type assertions (data validated at build time)
const people = peopleData as PersonEntity[];
const organizations = orgsData as OrganizationEntity[];
const documents = documentsData as DocumentEntity[];
const locations = locationsData as LocationEntity[];
const timelineEvents = timelineData as TimelineEvent[];

// All entities combined
const allEntities: Entity[] = [
  ...people,
  ...organizations,
  ...(documents as unknown as Entity[]),
  ...(locations as unknown as Entity[]),
];

// Lookup maps for O(1) access
const entityMap = new Map<string, Entity>();
allEntities.forEach((entity) => entityMap.set(entity.id, entity));

const timelineMap = new Map<string, TimelineEvent>();
timelineEvents.forEach((event) => timelineMap.set(event.id, event));

// Export accessors
export function getEntity(id: string): Entity | undefined {
  return entityMap.get(id);
}

export function getTimelineEvent(id: string): TimelineEvent | undefined {
  return timelineMap.get(id);
}

export function getAllEntities(): Entity[] {
  return allEntities;
}

export function getEntitiesByType<T extends Entity>(type: T['type']): T[] {
  return allEntities.filter((e) => e.type === type) as T[];
}

export function getAllTimelineEvents(): TimelineEvent[] {
  return timelineEvents.sort((a, b) => a.date.localeCompare(b.date));
}

export function getPeople(): PersonEntity[] {
  return people;
}

export function getOrganizations(): OrganizationEntity[] {
  return organizations;
}

export function getDocuments(): DocumentEntity[] {
  return documents;
}

export function getLocations(): LocationEntity[] {
  return locations;
}

export function getIntroSections() {
  return introData;
}

// Get all entities connected to a given entity
export function getConnectedEntities(entityId: string): Entity[] {
  const entity = entityMap.get(entityId);
  if (!entity) return [];
  return entity.connections
    .map((conn) => entityMap.get(conn.targetId))
    .filter((e): e is Entity => e !== undefined);
}

// Get timeline events for a given entity
export function getEntityTimeline(entityId: string): TimelineEvent[] {
  return timelineEvents
    .filter((event) => event.relatedEntityIds.includes(entityId))
    .sort((a, b) => a.date.localeCompare(b.date));
}
