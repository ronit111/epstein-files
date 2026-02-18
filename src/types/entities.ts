// === Core Entity Types ===

export type EntityType = 'person' | 'organization' | 'event' | 'document' | 'location';

export type Significance = 1 | 2 | 3; // 1=central, 2=important, 3=peripheral

export type SourceReliability = 'primary' | 'secondary' | 'reporting';

export interface Source {
  label: string;
  url?: string;
  documentId?: string;
  reliability: SourceReliability;
}

export interface ConnectionRef {
  targetId: string;
  relationship: string;
  reverseRelationship: string;
  strength: 1 | 2 | 3;
  verified: boolean;
  description?: string;
  sources: Source[];
  timeRange?: { start: string; end?: string };
}

export interface TimelineEventRef {
  eventId: string;
  role: string;
}

// === Base Entity ===

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  deepDive?: string;
  tags: string[];
  significance: Significance;
  imageUrl?: string;
  sources: Source[];
  connections: ConnectionRef[];
  timelineEvents: TimelineEventRef[];
}

// === Specialized Entities ===

export type PersonCategory = 'central' | 'associate' | 'victim' | 'legal' | 'political' | 'institutional' | 'enabler';

export interface PersonEntity extends BaseEntity {
  type: 'person';
  role: string;
  category: PersonCategory;
  aliases?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  nationality?: string;
  keyPositions?: string[];
}

export type OrgCategory = 'financial' | 'legal' | 'government' | 'nonprofit' | 'media' | 'intelligence' | 'epstein-entity';

export interface OrganizationEntity extends BaseEntity {
  type: 'organization';
  category: OrgCategory;
  founded?: string;
  headquarters?: string;
}

export type EventCategory = 'legal' | 'financial' | 'political' | 'death' | 'document-release' | 'media' | 'investigation' | 'arrest';

export interface EventEntity extends BaseEntity {
  type: 'event';
  date: string;
  endDate?: string;
  category: EventCategory;
  location?: string;
}

export type DocumentType = 'court-filing' | 'deposition' | 'flight-log' | 'financial-record' | 'foia' | 'news' | 'plea-agreement' | 'indictment' | 'contact-list';

export interface DocumentEntity extends BaseEntity {
  type: 'document';
  documentType: DocumentType;
  date: string;
  court?: string;
  caseNumber?: string;
  releaseDate?: string;
  externalUrl?: string;
}

export type LocationCategory = 'residence' | 'island' | 'office' | 'institution' | 'ranch';

export interface LocationEntity extends BaseEntity {
  type: 'location';
  category: LocationCategory;
  coordinates?: { lat: number; lng: number };
  address?: string;
}

// === Union Type ===

export type Entity = PersonEntity | OrganizationEntity | EventEntity | DocumentEntity | LocationEntity;

// === Timeline Event (standalone, referenced by entities) ===

export interface TimelineEvent {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  description: string;
  detailedDescription?: string;
  category: EventCategory;
  significance: Significance;
  relatedEntityIds: string[];
  sources: Source[];
}

// === Graph Types (derived at runtime) ===

export interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  significance: Significance;
  category: string;
  val: number;
  color: string;
  imageUrl?: string;
  // d3-force injects these at runtime
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: 1 | 2 | 3;
  verified: boolean;
  relationship: string;
  timeRange?: { start: string; end?: string };
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// === Intro Content ===

export interface IntroSection {
  id: string;
  headline: string;
  subtext?: string;
  statistic?: { value: string; label: string };
  bodyText?: string;
  visualType: 'text-only' | 'statistic' | 'quote' | 'transition';
}
