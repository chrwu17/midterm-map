---
title: Midterm Map — educational site for new voters
labels: [wayfinder:map]
status: open
---

## Destination

A build-ready spec for an English, strictly nonpartisan educational site where New Voters click a state on a US map and learn about the 2026 midterm Senate and governor Races, Candidates and Results, plus evergreen Lessons. **Override (see Notes):** this effort also carries execution, so the session builds the v1 site.

## Notes

- Course project (personal scale). The user handed off decisions on stack and constraints to the agent.
- **Execution is in scope** for this map (user asked to "go ham" and build within a ~53-minute window on 2026-11-14).
- Design skills to consult: design-taste-frontend (taste-skill), impeccable, emilkowalski/skills. Motion: gsap and lenis; React Bits SplitText (shadcn registry `@react-bits/SplitText-TS-TW`). Verify with @playwright/cli.
- Vocabulary: see GLOSSARY.md.

## Decisions so far

- [Destination & audience](0001-destination-audience.md): build-ready spec for new voters in general, English only, course project, strictly nonpartisan
- [Election framing](0002-framing.md): 2026 results and candidates on the map, plus evergreen Lessons
- [Race scope](0003-race-scope.md): v1 covers U.S. Senate and governor; House goes on a later district drill-down
- [Candidate coverage](0004-candidate-coverage.md): major-party candidates get full profiles; others are listed with name, party and vote share
- [Profile contents](0005-profile-contents.md): bio, party, Result, plain-language positions on 6 fixed issues, a source on every claim
- [Lessons in v1](0006-lessons.md): what senators and governors do, how to register (link out to vote.gov), terms glossary, how to research a candidate
- [Interactivity](0007-interactivity.md): v1 is map → state → race → candidate, with no ZIP lookup and no candidate-matching quiz
- [Data source & stack](0008-data-stack.md): hand-curated JSON researched from public sources; Next.js (App Router, static export) + TypeScript + Tailwind + shadcn
- [How each skill and tool is used](0011-skills-tooling-plan.md): taste skill + Emil Kowalski skills → design brief first; shadcn/SplitText/GSAP/Lenis to build; impeccable to polish; Playwright CLI to QA
- [How a position earns its place](0012-position-sourcing-rule.md): shown only if the cited page was opened and supports the sentence; one writer per race file

## Not yet specified

- House district drill-down: data source and map geometry
- Keeping data current as uncalled races get called

## Out of scope

- Spanish translation: user chose English only
- Candidate-matching quiz: hard to keep neutral
