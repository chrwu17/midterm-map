# Handoff: how to pick this project up

Written 2026-11-14 at the end of the first build session. `docs/STATUS.md` has the numbers and the full list of gaps; this file explains the choices behind the project and how to keep working on it.

## What this is

Midterm Map teaches people with little political knowledge who was on their ballot in the 2026 midterms. A visitor clicks a state on a US map, sees its Senate and governor races, and compares the major candidates on six issues in plain language. Short Lessons explain how elections work. It is a course project, English only, and strictly nonpartisan.

## Start here

1. `cd web && npm install && npm run dev`, then open the local address it prints.
2. Read `docs/STATUS.md` for what is done and what is not.
3. Read `issues/0000-map-midterm-map-site.md` for the decisions and the open tickets.
4. Pick an open ticket (listed at the bottom of this file).

## Product decisions and why

| Decision | Why |
|---|---|
| Audience is new voters in general, English only | The user's choice; an early idea of a Latino-voter focus and Spanish was dropped. |
| Show 2026 results plus evergreen Lessons | The election had just happened; Lessons keep the site useful afterward. |
| Senate and governor get full profiles; House gets results only | 71 races can be curated by hand; 435 House races cannot. House districts show candidates, parties, shares and the winner, with no positions. |
| Major candidates get full profiles; others get name, party, vote share | Fair and complete without doubling the research. |
| Six fixed issues for everyone: economy, health care, immigration, education, climate and energy, abortion | The same questions for every candidate make comparison fair. |
| No ZIP lookup, no "match me" quiz | A matching quiz is hard to keep neutral. |
| Registration help links out to vote.gov | Avoids maintaining 50 states' rules. |
| Hand-curated JSON, no live API | No free source covers this well; a static file per race is easy to check and edit. |

## Design choices and why

The full brief is `docs/design-brief.md`.

- **Map shaded by office, not party.** Teal for Senate and governor, light teal for Senate, tan for governor, grey for neither. A red-and-blue map would undercut the neutral promise. The line "Colors show which offices were on the ballot, not who won" sits above it.
- **Party shown as small, equal-weight tags.** No party-colored panels. The winner is marked with a check icon and the words "Projected winner", not a color.
- **The map is visible on first load.** It is the site's main action. The design checker wants the hero alone on the first screen; that finding is waived on purpose.
- **Type:** Fraunces for headings, Public Sans for text, for a newspaper-explainer feel. A design hook flags Fraunces as overused; it was kept on the merits and could be revisited.
- **Motion supports reading and never delays it.** Kept: the headline entrance (SplitText and GSAP), a one-time map entrance, hover and focus dimming on the map, Lenis smooth scroll (the user asked for it), lift and press on cards and buttons. Removed after a motion review: scroll-triggered card fades and growing vote bars, because they hid text and animated real data. Everything switches off under reduced motion.
- **Every source link says where it goes** ("Campaign site", "The Green Papers", "kold.com"), so a voter can tell a candidate's own page from a news report.
- **Jargon gets a definition on tap, hover or focus**, pulled from `content/lessons/political-terms.md`. Terms are never linked inside position sentences.
- **Honest empty states.** A candidate with no sourced positions gets one line saying so. An issue nobody addressed is one sentence. Each race card says results are unofficial until the state certifies them.

## How the data was built

1. Research agents listed candidates and results for each race.
2. A fact-check compared every winner with a second source.
3. Profile agents added bios, websites and positions.
4. A source sweep opened the cited page for every position. About a quarter had to be reworded because they claimed more than the page said, and a few were deleted. This is why the sourcing rule exists.
5. Later passes rewrote race summaries in plain language, filled vote shares and minor candidates, and ran the humanizer skill.

Lessons learned are in the "Working rules" section of `docs/STATUS.md`. The web-search tool has a per-session cap that the agents used up; plan searches before spending them.

## Guides

### Edit one race
1. Open `data/races/<STATE>-<office>.json` (for example `TX-senate.json`).
2. Follow `data/SCHEMA.md`. For a position, open the source page and write one sentence that says no more than the page does.
3. Run `node scripts/validate-data.mjs`. Errors fail the site build; warnings are known gaps.
4. `cd web && npm run build`.

### Update a result (for example Alaska after Nov 18)
Set `status` to "called" and `winnerId` to the winner's candidate id, update every `voteShare` from one results page, add that page to `sources`, set `lastVerified`, rewrite `summary` in one or two plain sentences, and note the source in `factCheckNote`.

### Add or change a Lesson
Add a Markdown file to `content/lessons/` with frontmatter `title`, `slug`, `summary`, `order`. End with a "Key takeaways" list. If you add a term to `political-terms.md`, keep the same entry structure, because the popovers parse it.

### Run a bulk pass with agents
Back up `data/races` first. Split the files into disjoint groups, one agent per group, and point each at the matching instructions file in `data/` (`PROFILE-PASS.md`, `SOURCE-SWEEP.md`, `SUMMARY-PASS.md`, `RESULTS-PASS.md`, `HUMANIZE-PASS.md`). Run the validator after.

### Deploy
The site is live on GitHub Pages at https://chrwu17.github.io/midterm-map/. Pushing to `main` redeploys it through `.github/workflows/pages.yml` (about a minute). The workflow sets `NEXT_PUBLIC_BASE_PATH=/midterm-map`, because a project site is served from a sub-path; local `npm run dev` and `npm run build` leave it unset. If you move to a custom domain at the root, drop that variable and set `NEXT_PUBLIC_SITE_URL` to the new origin. Pushing over SSH failed in the agent environment; HTTPS with the `gh` login works.

## Tools and skills used

- Planning: the wayfinder, grilling and domain-modeling skills; tickets live in `issues/`.
- Design: design-taste-frontend (its checker's state is in `web/.taste-skill/`), impeccable, Emil Kowalski's skills.
- Build: shadcn, React Bits SplitText, GSAP, Lenis.
- Testing: Playwright through `npx playwright` (the global CLI install failed on permissions).
- Writing: the humanizer skill.

## Open tickets, in suggested order

1. `0014-certified-results.md`: swap in certified results as states publish them.
2. `0013-secondary-sources.md`: done 2026-11-25.
3. `0015-design-gate-open.md`: close the design checker's findings on the home and state pages.
4. `0016-humanize-site-copy.md`: finish the humanizer pass and revisit the stiff position sentences.
5. `0010-data-freshness.md`: decide who updates the data and how often.
6. `0009-house-drilldown.md`: House districts, later.
