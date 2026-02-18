# The Epstein Files

The case, mapped.

**Live**: [ignorance-isnt-bliss.pages.dev](https://ignorance-isnt-bliss.pages.dev/)

## Why This Exists

For a long time, the Epstein case was another sad headline to scroll past. Most of us don't have the bandwidth to deep dive into it — we're all dealing with our own lives, our own problems. Fair enough.

What changed was hearing from someone close to a survivor. These files and this ongoing issue have affected hundreds and thousands of underage victims. That's what this is about.

Nobody has the time to piece together decades of court filings, DOJ releases, flight logs, depositions, and investigative reporting. This project tries to make that easier — to lower the barrier to awareness for people who know something happened but haven't been able to follow the full scope of it.

Why read another sad thing? Because some things need to be known. Because how we relate to power, wealth, and the halo effects that come with them is worth examining. Because unconditioning ourselves from those assumptions starts with understanding what those assumptions have enabled.

This is a public service tool. Nothing more.

## What It Does

The full scope of the Epstein case, mapped:

- **Network graph** — Visualises connections between people, organisations, documents, and locations. Every connection is sourced and marked as court-verified or reported.
- **Timeline** — Chronological events from 1976 to 2026, from Epstein's early career through the final DOJ document releases.
- **Detail panel** — Deep profiles on every entity with sourced descriptions, connection maps, and document references.
- **Search** — Fuzzy search across all entities (Cmd+K / Ctrl+K).
- **Cinematic intro** — Context-setting scroll sequence for first-time visitors. Skipped automatically on return visits.

Every claim is sourced. Every connection carries a reliability rating. Allegations are labelled as allegations. Court-documented facts are labelled as verified.

## Content Principles

- **Factual above all** — Every claim traceable to court documents, confirmed reporting, or public records.
- **No conspiracy** — No speculation presented as fact. No clickbait framing.
- **Verified vs reported** — The distinction is visible to the user on every connection.
- **Respects victims** — Their stories are told because they chose to speak publicly. No salacious detail for its own sake.
- **Unflinching** — Names institutional failures. Asks hard questions about what remains unresolved.

## Data Sources

- Court documents (SDNY indictment, NPA, Maxwell trial transcripts, grand jury testimony)
- DOJ document releases (207,000+ documents across 12 data sets, 2024-2026)
- Flight logs and Epstein's contact book (released through court proceedings)
- Investigative journalism (Miami Herald's "Perversion of Justice," ProPublica, NYT, BBC)
- Regulatory filings (NY DFS consent orders, SEC records)
- USVI Attorney General civil complaints and settlements

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React 19 + TypeScript |
| Network Graph | react-force-graph-2d (canvas, d3-force) |
| Animation | GSAP + ScrollTrigger (intro), Framer Motion (UI) |
| CSS | Tailwind v4 |
| State | Zustand |
| Search | Fuse.js |
| Hosting | Cloudflare Pages |

## Running Locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build    # Output in dist/
```

## Deploying

```bash
npx wrangler pages deploy dist --project-name=ignorance-isnt-bliss
```

## License

The code is open source. The data is compiled from public records, court documents, and published journalism. This project is for public interest and educational purposes.
