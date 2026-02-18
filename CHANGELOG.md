# Changelog

All notable changes to The Epstein Files project will be documented here.

## [0.3.0] - 2026-02-18

### Fixed
- Detail panel pushed off-screen on desktop (CSS Grid `min-width: auto` on graph wrapper)
- Detail panel text cutoff on right edge (`min-w-0` + `overflow-x-hidden`)
- Jarring zoom on node click — now respects user's current zoom level instead of forcing 2.5x
- Camera animation drift when detail panel opens (delayed for layout reflow)
- Tablets and landscape phones getting broken desktop grid layout
- Duplicate breadcrumbs when selecting the same entity
- Search ranking: people now rank above documents for name queries (type-weight boost)
- Search placeholder text now matches actual searchable entity types
- Browser back/forward navigation via `hashchange` listener

### Added
- Responsive 3-tier layout: mobile (<1024px), small desktop (1024-1279px), full desktop (1280+)
- Mobile detail panel slide-up animation (Framer Motion)
- Safe area insets for notched phones (`viewport-fit=cover`)
- Court filing collage background on graph panel
- Graph zoom limits (0.5x–8x)

### Changed
- Desktop grid breakpoint raised from 768px to 1024px
- Touch targets enforced at 44px minimum across all interactive elements
- Cinematic intro text scales for small screens
- Keyboard shortcut hint hidden on mobile/tablet

## [0.2.0] - 2026-02-18

### Changed
- Palette overhauled: warm amber on blue-slate → cold off-white on near-black (zinc scale)
- Entity colors desaturated to archival tones (ochre, steel, sage, lavender), then re-saturated for clarity
- Header simplified: logo + search + breadcrumbs + filter dropdown (inline filters removed)
- Verified-only toggle and graph legend removed (visual distinction via dashed links remains)
- Last-updated date moved under Timeline heading

### Added
- Graph: radial gradient bloom, quadratic bezier curved links, directional particles, ambient pulse
- Film grain texture overlay on graph and intro
- Skip-to-content link, ARIA combobox on search, tab roles on detail panel
- Keyboard navigation: Cmd+K / Ctrl+K for search, arrow keys for results, Escape to close
- Screen reader: live region for entity selection, canvas graph description
- Detail panel: separate back and close buttons
- GitHub Actions auto-deploy workflow (Cloudflare Pages on push to main)
- SEO: Open Graph, Twitter cards, JSON-LD structured data, robots.txt, sitemap.xml
- Code splitting: React.lazy for intro/board, chunked heavy deps (341KB initial vs 826KB)

### Fixed
- NaN node positions during d3-force warmup crashing canvas render
- Verified filter toggling scattered graph nodes (now hidden visually, kept in simulation)
- Truth verifier corrections: Maxwell nationality, Brunel dates, Trump flight count, Deutsche Bank timeline, and others

## [0.1.0] - 2026-02-18

### Added
- Project scaffold: Vite + React 19 + TypeScript + Tailwind v4
- Interactive network graph (react-force-graph-2d) with custom canvas rendering
- Vertical timeline panel grouped by year with category-colored event dots
- Detail panel with four tabs: Overview, Connections, Timeline, Sources
- Breadcrumb "rabbit hole" navigation for entity-to-entity exploration
- Fuzzy search (Fuse.js) across all entities
- Filter controls: entity type toggles, verified-only filter
- Cinematic GSAP scroll intro with 6 sections and "Begin Investigation" transition
- Zustand state management synchronizing graph, timeline, and detail panel
- Comprehensive sourced dataset: people, organizations, documents, locations, timeline events
- CSS custom properties theme system (dark investigative palette)
- Source reliability ratings (primary / secondary / reporting) on all data
- Verified vs reported distinction on entity connections
- Project identity document (CLAUDE.md)
