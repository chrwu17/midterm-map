# Status: Midterm Map

Last updated 2026-11-25. The site was last committed and deployed with the mid-November data; the 2026-11-25 changes in the working tree are neither committed nor deployed.

## What exists

- Site in `web/`: Next.js static export. Home with the US map, a page for each of the 50 states, seven Lessons, and an About page. Run with `cd web && npm install && npm run dev`.
- House results in `data/house/`: 435 districts, one file per state, results only (no bios or positions). Shown on each state page in a "U.S. House" section. Validate with `node scripts/validate-house.mjs` (the build runs it). 432 called, 1 uncalled (MN-01), 2 runoff (LA-05, LA-06; Dec 12). Most winners now rest on The Green Papers alone; `data/house/README.md` says which have a second source. State pages also have a district map (`web/src/components/house-map.tsx`, drawn from `data/house-geometry/`; see `data/house/GEOMETRY.md`).
- Data in `data/races/`: 71 race files (35 U.S. Senate, 36 governor), one per Race, following `data/SCHEMA.md`.
- Lessons in `content/lessons/`: eight Markdown files, including "What a U.S. Representative Does" (added 2026-11-15; facts checked against the Constitution text at archives.gov and house.gov pages).
- Validator: `node scripts/validate-data.mjs` (0 errors, about 110 warnings at last run; the warnings are the gaps below).
- Planning record in `issues/`: the map is `0000-map-midterm-map-site.md`.

## Site state at the end of the session

- Final build and lint pass (run 2026-11-14 at 8:46 pm, 63 pages). The build runs the data validator first.
- Motion is a hero headline entrance (SplitText + GSAP), a one-time map entrance, hover and focus dimming on the map, Lenis smooth scroll. Scroll-triggered card fades and growing vote bars came out in the motion review because they slowed reading down.
- Jargon popovers on state pages, fed from `content/lessons/political-terms.md`.
- Design gate (taste skill): PASS on the home page (2026-11-15). Five waivers with reasons are in `web/.taste-skill/waivers.json` (Lenis smooth scroll, no dealt moment, the map as half the hero, and the one-line footer twice). The gate caps waivers at five. The gate has only ever run on the home page, never on a state page.
- Design gate re-run 2026-11-25: home had 2 findings open. The lessons heading was then renamed "Lessons for new voters" and the check was not run again; the other finding is two headings briefly sharing a screen. State pages: CA 19, WY 10, SD 10, mostly landing-page rules that do not fit long reading pages. No waivers added.
- Home page now: headline and map side by side in one full screen, then a lessons section with a live preview of Lesson 1. Small-state chips sit in a "Small states" disclosure under the map.
- Fixed 2026-11-15: Lenis kept a stale page height, so the scroll stopped short of the bottom after an accordion opened. It now re-measures on any size change (`web/src/components/motion-provider.tsx`). Three lesson links pointed at `/lessons/` instead of `/learn/`. Map states now show a real focus outline.
- Deployed 2026-11-15 to GitHub Pages: https://chrwu17.github.io/midterm-map/ (public repo chrwu17/midterm-map). Every push to `main` runs `.github/workflows/pages.yml`, which runs both data validators, builds with `NEXT_PUBLIC_BASE_PATH=/midterm-map` and deploys `web/out`. A light/dark toggle sits in the header; with no saved choice the site follows the system setting.
- Prose: the humanizer skill was run over the Lessons and over every race summary, bio and position (trims and reorders only, so some sentences still read stiffly). It was not run over the on-page site copy, the README or this file.

## Last changes before the session ended (8:47 to 8:55 pm)

- Design fixes from the gate's real findings: topic icons on lesson cards (home and /learn), one shared primary and secondary button style, a 2px focus ring on map states, a tooltip that moves by transform. The icons and buttons were checked in a screenshot (`docs/screenshots/home-1440-v4.png`); the focus ring and tooltip were not tested by hand. The gate was not re-run, so its count is unknown.
- Humanizer on site copy: only three strings changed (home and About) before time ran out. Components and the state page were not reviewed. See `issues/0016-humanize-site-copy.md`.
- New docs: `docs/HANDOFF.md` (decisions, design choices, guides) and `CLAUDE.md` (rules and commands for future agent sessions).
- Two positions were spot-checked by hand against their sources (Talarico economy, Holscher economy); both matched.

## Dataset numbers (measured from the files)

| Measure | Count |
|---|---|
| Senate and governor races called | 71 of 71 |
| Races marked certified | 13 |
| Major candidates | 143, all with a bio |
| With a confirmed website | 135 |
| With four or more positions | 142 (Michael Katz has three) |
| Positions | 685 |
| Citations to Wikipedia in race and House data | 0 |
| Positions citing OnTheIssues | 8 |
| Minor candidates listed | 107 |
| Candidates with no vote share | 0 |

## How the data was checked

1. Winners: every race was compared with a second source. For most races that source is an AP-based tally page, not AP itself.
2. Positions: an agent opened the cited page for every position (672 at the time) and reworded, re-sourced or deleted what the page didn't support. About 183 were reworded, 24 re-sourced, 8 deleted.
3. Websites: each link was opened or confirmed another way; unconfirmed ones are null.
4. Bios: checked against opened pages in the second pass for most files. Bios were not part of the final position sweep.

## Known gaps

- Shares are certified only in the 13 races with `resultsCertified`. Others may be unofficial and can still move.
- 2026-11-25 no-Wikipedia pass: every Wikipedia link was replaced by a page that was opened, or the fact was narrowed or cut. Some bios are shorter as a result. Alaska shares now come from The Green Papers and leave out write-ins. A laptop crash cut the pass off; AK to ID was finished afterward, partly from page excerpts saved in the earlier agent's log.
- Sources that refused automated fetches (403) were not retried. Some older Ballotpedia links remain (Iowa governor, Louisiana and Massachusetts Senate).
- Colorado Libertarian nominee is Eric Mulder (fixed from "Erik" on 2026-11-25; the state Libertarian Party's press release and The Green Papers agree). FL-06 Michael Gist withdrew in September and was removed.
- Mixed counts: three races had shares from two different counts and were fixed (CA, CO, HI governor; FL Senate special reset too). The validator only catches totals above 100.5%, so a milder mix could remain elsewhere.
- Eight positions still cite OnTheIssues: Love, Brock Smith, Wess, Guckian (two), Peltola, Nixon, Baisley. No other openable page has been found.
- Ten stiff position sentences (Demuth, James, El-Sayed, Rogers, Holscher, Bodnar, Colom, Booker, Mizusawa, Hageman) were reworded on 2026-11-15 after re-opening each source; Holscher's immigration, abortion and climate sentences and a few Demuth ones were not re-opened.
- A few position sentences outside the ten reworded candidates may still read stiffly.
- Lessons: facts were checked against web sources, but several official sites (vote.gov, Congress.gov, AP) block automated fetches, so those links were not opened.
- Kansas governor was marked called from HPPR and KCUR reports of the AP call and of a concession; AP's own page was not opened.

## Open tickets

- `issues/0013-secondary-sources.md`: eight OnTheIssues citations left.
- `issues/0014-certified-results.md`: more states certify through December; LA-05 and LA-06 runoffs Dec 12; MN-01.
- `issues/0009-house-drilldown.md`: House districts (later).
- `issues/0010-data-freshness.md`: who updates the data and how often.

## Working rules learned the hard way

- One writer per race file at a time. A concurrent write once erased five races of finished work.
- A position is shown only if the cited page was opened and supports the sentence.
- All vote shares in one race come from one count.
- Backups of the data at three points are in `data/.backup/` (git-ignored).
