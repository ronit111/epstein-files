# The Epstein Files — Project Identity

## What This Is
An interactive documentary investigation into the Jeffrey Epstein case. A web app that presents the full scope of the case — people, connections, timeline, documents, locations — in a way that's comprehensive yet navigable. Every data point is sourced and rated for reliability.

## Content Principles (HIGHEST PRIORITY)
- **Factual above all**: Every claim must be traceable to court documents, confirmed reporting, or public records
- **Source everything**: Every entity, connection, and event carries source citations with reliability ratings (primary / secondary / reporting)
- **Verified vs reported**: Connections confirmed in court documents are marked "verified". Connections from credible journalism are marked "reported". This distinction is visible to the user.
- **No conspiracy**: No speculation, no unverified theories presented as fact, no clickbait framing. If something is alleged, it's labeled as alleged with the source.
- **Comprehensive**: If it's connected to the case and documented, it belongs here. Depth and breadth of coverage are non-negotiable.
- **Unflinching**: Names institutional failures. Asks hard questions about what remains unresolved. Doesn't sanitise uncomfortable facts.

## Voice & Tone
- **Factual, unflinching, sober**: States what's documented. Points at what's unresolved. Never sensational.
- **No editorialising in data**: Entity descriptions are factual. Editorial framing appears only in the cinematic intro and narrative sections, clearly separated from data.
- **Respects victims**: Victim entities are treated with dignity. No salacious detail for its own sake. Their stories are told because they chose to speak publicly.

## Visual Identity

### Color Palette — "Cold Light on Black"
| Role | Color | Hex |
|------|-------|-----|
| Background (base) | Near-black | `#09090b` |
| Surface (raised) | Zinc 900 | `#18181b` |
| Surface overlay | Zinc 900/80 | `#18181bcc` |
| Border / ink lighter | Zinc 800 | `#27272a` |
| Primary accent | Cold off-white | `#d4d4d8` |
| Accent glow | Off-white 10% | `#d4d4d81a` |
| Danger / flagged | Muted crimson | `#991b1b` |
| Text primary | Near-white | `#fafafa` |
| Text secondary | Zinc 400 | `#a1a1aa` |
| Text muted | Zinc 500 | `#71717a` |

### Entity Type Colors (Graph Nodes — desaturated, archival)
- Person: Muted ochre `#c49a6c`
- Organization: Steel blue `#6b8aad`
- Event: Muted violet `#8b7e99`
- Document: Muted lavender `#9b8ec4`
- Location: Muted sage `#6b8f6b`

Each entity color has a `_DIM` variant (50% + `44` alpha) and a `_GLOW` variant (`22` alpha) for graph bloom effects.

### Typography
| Use | Font | Weight |
|-----|------|--------|
| Display / cinematic headlines | Playfair Display | 400–700 |
| UI / labels / body | Inter | 300–700 |
| Evidence / citations / dates | JetBrains Mono | 400–500 |

### Design Principles
1. **Content credibility > visual polish**: The reliability of information is always more important than how it looks
2. **Breathing room**: Generous whitespace. 8rem+ between major sections. Never cramped.
3. **Progressive disclosure**: Surface layer is scannable. Depth revealed by interaction. Three layers: short → detailed → deep dive.
4. **Every element earns its place**: No decoration-only elements. Every node, timeline event, and connection is clickable and meaningful.
5. **Dark immersive canvas**: Near-black base with zinc surfaces. Cold off-white accent — no warmth. The clinical coldness serves the investigative tone. Film grain texture overlay on graph and intro.
6. **Animation with purpose**: Smooth transitions (0.5-0.8s). Nothing moves without communicating state change.
7. **No generic icons**: Graph nodes use colored circles + level-of-detail rendering. UI uses custom line icons. No Material Design, no clipart.

## Tech Stack
- **Framework**: Vite + React 19 + TypeScript
- **Graph**: react-force-graph-2d (canvas-based, d3-force)
- **Animation**: GSAP + ScrollTrigger (cinematic intro), Framer Motion (UI)
- **CSS**: Tailwind v4 + CSS Modules
- **State**: Zustand
- **Search**: Fuse.js
- **Timeline**: react-window (virtualized)
- **Hosting**: Cloudflare Pages

## Data Model
Entities: Person, Organization, Event, Document, Location
Each entity has: id, name, descriptions (short/detailed/deep), tags, significance (1-3), sources, connections, timeline refs
Connections have: relationship labels, strength, verified flag, time ranges, sources
See `src/types/entities.ts` for full TypeScript definitions.

## Project Structure
```
data/           → JSON data files (entities, timeline, intro content)
src/types/      → TypeScript type definitions
src/store/      → Zustand state management
src/data/       → Data loading, graph building, search indexing
src/components/ → React components (intro, board, graph, timeline, detail, search, navigation)
src/styles/     → CSS (Tailwind entry, theme variables)
src/utils/      → Utility functions (colors, dates)
src/hooks/      → Custom React hooks
```
