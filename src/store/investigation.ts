import { create } from 'zustand';
import type { EntityType } from '@/types/entities';

export interface FilterState {
  entityTypes: EntityType[];
  categories: string[];
  significanceMin: 1 | 2 | 3;
  searchQuery: string;
  verifiedOnly: boolean;
}

export interface InvestigationState {
  // Intro
  introComplete: boolean;
  setIntroComplete: (complete: boolean) => void;

  // Selection
  selectedEntityId: string | null;
  hoveredEntityId: string | null;
  selectEntity: (id: string | null) => void;
  hoverEntity: (id: string | null) => void;

  // Navigation history (rabbit hole breadcrumbs)
  navigationHistory: string[];
  navigateToEntity: (id: string) => void;
  navigateBack: () => void;
  navigateToHistoryIndex: (index: number) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Timeline
  timelineRange: { start: string; end: string } | null;
  highlightedTimelineEventId: string | null;
  setTimelineRange: (range: { start: string; end: string } | null) => void;
  highlightTimelineEvent: (id: string | null) => void;

  // Graph camera
  graphCenterAt: { x: number; y: number } | null;
  graphZoom: number;
  setGraphCamera: (center: { x: number; y: number } | null, zoom: number) => void;

  // Reset
  resetAll: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  entityTypes: ['person', 'organization', 'event', 'document', 'location'],
  categories: [],
  significanceMin: 3, // Show all by default
  searchQuery: '',
  verifiedOnly: false,
};

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  // Intro
  introComplete: localStorage.getItem('epstein-intro-complete') === 'true',
  setIntroComplete: (complete) => {
    localStorage.setItem('epstein-intro-complete', String(complete));
    set({ introComplete: complete });
  },

  // Selection
  selectedEntityId: null,
  hoveredEntityId: null,
  selectEntity: (id) => set({ selectedEntityId: id }),
  hoverEntity: (id) => set({ hoveredEntityId: id }),

  // Navigation (rabbit hole)
  navigationHistory: [],
  navigateToEntity: (id) => {
    const { selectedEntityId, navigationHistory } = get();
    // No-op if already viewing this entity
    if (id === selectedEntityId) return;
    const newHistory = selectedEntityId
      ? [...navigationHistory, selectedEntityId]
      : navigationHistory;
    // Cap at 10 breadcrumbs
    const capped = newHistory.slice(-10);
    set({
      selectedEntityId: id,
      navigationHistory: capped,
    });
  },
  navigateBack: () => {
    const { navigationHistory } = get();
    if (navigationHistory.length === 0) {
      set({ selectedEntityId: null });
      return;
    }
    const previous = navigationHistory[navigationHistory.length - 1];
    set({
      selectedEntityId: previous,
      navigationHistory: navigationHistory.slice(0, -1),
    });
  },
  navigateToHistoryIndex: (index) => {
    const { navigationHistory } = get();
    if (index < 0 || index >= navigationHistory.length) return;
    const targetId = navigationHistory[index];
    set({
      selectedEntityId: targetId,
      navigationHistory: navigationHistory.slice(0, index),
    });
  },

  // Filters
  filters: DEFAULT_FILTERS,
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Timeline
  timelineRange: null,
  highlightedTimelineEventId: null,
  setTimelineRange: (range) => set({ timelineRange: range }),
  highlightTimelineEvent: (id) => set({ highlightedTimelineEventId: id }),

  // Graph camera
  graphCenterAt: null,
  graphZoom: 1,
  setGraphCamera: (center, zoom) => set({ graphCenterAt: center, graphZoom: zoom }),

  // Reset
  resetAll: () =>
    set({
      selectedEntityId: null,
      hoveredEntityId: null,
      navigationHistory: [],
      filters: DEFAULT_FILTERS,
      timelineRange: null,
      highlightedTimelineEventId: null,
      graphCenterAt: null,
      graphZoom: 1,
    }),
}));
