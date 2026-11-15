---
title: How each skill and tool is used
labels: [wayfinder:grilling]
status: closed
parent: 0000-map-midterm-map-site
---

## Question

Where in the build does each user-requested skill, library and MCP come in, and in what order?

## Resolution

Order of use: **plan the design, then build, then polish, then QA.**

| Phase | Tool | Role |
|---|---|---|
| 1. Design brief (before UI code) | **design-taste-frontend** (taste-skill) | Pick the visual direction: type pairing, palette (party-neutral), spacing scale, layout of home/state pages. Output: `docs/design-brief.md`. |
| 1. Design brief | **emilkowalski/skills** | Interaction and motion rules: easing curves, durations, hover/press states for map states and candidate cards, expand/collapse behavior. Goes in the brief's "Motion" section. |
| 2. Build | **shadcn/ui** | Primitives: Card, Badge, Accordion (candidate profile), Table (issue comparison), Select (mobile state picker), Tooltip (map hover), Tabs. |
| 2. Build | **React Bits SplitText** (`@react-bits/SplitText-TS-TW`) | Home hero headline only. One showpiece, not everywhere. |
| 2. Build | **GSAP** (+ScrollTrigger) | Map reveal (states stagger in), race cards entering on scroll, vote-share bars growing to their value. |
| 2. Build | **Lenis** | Site-wide smooth scroll, driving ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. Off under `prefers-reduced-motion`. |
| 3. Polish | **impeccable** | Audit/polish pass after v1 builds: typography, contrast, spacing, empty states, mobile. |
| 4. QA | **@playwright/cli** | Separate QA agent: screenshots at 1440px and 390px, map → state → candidate click-through, keyboard navigation of the map, console errors, every route builds. |
| 4. QA (optional) | **Claude in Chrome MCP** | Orchestrator's final visual check in the real browser. |

Rule: motion supports comprehension (shows where you are, what changed) and is never decoration that delays reading.
