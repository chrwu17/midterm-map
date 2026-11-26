# Status: Midterm Map

Last updated 2026-11-25. The 2026-11-25 changes were committed (4c01574) and deployed to GitHub Pages the same day.

## What exists

- Site in `web/`: Next.js static export. Home with the US map, a page for each of the 50 states, seven Lessons, and an About page. Run with `cd web && npm install && npm run dev`.
- House results in `data/house/`: 435 districts, one file per state, results only (no bios or positions). Shown on each state page in a "U.S. House" section. Validate with `node scripts/validate-house.mjs` (the build runs it). 432 called, 1 uncalled (MN-01), 2 runoff (LA-05, LA-06; Dec 12). Every called winner now has a second source (NBC News results pages for most states); `data/house/README.md` lists them. MN-01: certified for Johnson by 324 votes on Nov. 19, hand recount from Nov. 30, board meets Dec. 8. State pages also have a district map (`web/src/components/house-map.tsx`, drawn from `data/house-geometry/`; see `data/house/GEOMETRY.md`).
- Data in `data/races/`: 71 race files (35 U.S. Senate, 36 governor), one per Race, following `data/SCHEMA.md`.
- Lessons in `content/lessons/`: eight Markdown files, including "What a U.S. Representative Does" (added 2026-11-15; facts checked against the Constitution text at archives.gov and house.gov pages).
- Validator: `node scripts/validate-data.mjs` (0 errors, 8 warnings on 2026-11-25; the warnings are the gaps below).
- Planning record in `issues/`: the map is `0000-map-midterm-map-site.md`.

## Site state at the end of the session

- Final build and lint pass (run 2026-11-14 at 8:46 pm, 63 pages). The build runs the data validator first.
- Motion is a hero headline entrance (SplitText + GSAP), a one-time map entrance, hover and focus dimming on the map, Lenis smooth scroll. Scroll-triggered card fades and growing vote bars came out in the motion review because they slowed reading down.
- Jargon popovers on state pages, fed from `content/lessons/political-terms.md`.
- Design gate (taste skill): PASS on the home page (2026-11-15). Five waivers with reasons are in `web/.taste-skill/waivers.json` (Lenis smooth scroll, no dealt moment, the map as half the hero, and the one-line footer twice). The gate caps waivers at five. The gate has only ever run on the home page, never on a state page.
- Design gate 2026-11-25: home PASS. State pages CA 17, WY 9, SD 9 open; each kept finding has a reason in `issues/0015-design-gate-open.md` (landing-page rules that do not fit a long reading page). Muted grey text now meets 7:1 in both themes. Playwright: 61 pages x 2 widths x 2 themes, both builds, no failures.
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
| With a confirmed website | 137 |
| With four or more positions | 141 (Fred Love and Mark Baisley have three) |
| Positions | 683 |
| Citations to Wikipedia, Ballotpedia or OnTheIssues in race and House data | 0 |
| Minor candidates listed | 107 |
| Candidates with no vote share | 0 |

## How the data was checked

1. Winners: every race was compared with a second source. For most races that source is an AP-based tally page, not AP itself.
2. Positions: an agent opened the cited page for every position (672 at the time) and reworded, re-sourced or deleted what the page didn't support. About 183 were reworded, 24 re-sourced, 8 deleted.
3. Websites: each link was opened or confirmed another way; unconfirmed ones are null.
4. Bios: checked against opened pages in the second pass for most files. Bios were not part of the final position sweep.

## Known gaps

- Major candidates with no confirmed website: Huckabee Sanders (site 403), Tracy (placeholder), Sununu, Blakeman, Guckian, Byrd. Certification dates seen: KS board Dec. 1, OR Dec. 10, IA governor Jan. 12, 2027. LA-05 and LA-06 runoffs Dec. 12.

- Shares are certified only in the 13 races with `resultsCertified`. Others may be unofficial and can still move.
- 2026-11-25 no-Wikipedia pass: every Wikipedia link was replaced by a page that was opened, or the fact was narrowed or cut. Some bios are shorter as a result. Alaska shares now come from The Green Papers and leave out write-ins. A laptop crash cut the pass off; AK to ID was finished afterward, partly from page excerpts saved in the earlier agent's log.
- Sources that refused automated fetches (403) were not retried. All Ballotpedia links were replaced on 2026-11-25.
- Colorado Libertarian nominee is Eric Mulder (fixed from "Erik" on 2026-11-25; the state Libertarian Party's press release and The Green Papers agree). FL-06 Michael Gist withdrew in September and was removed.
- Mixed counts: three races had shares from two different counts and were fixed (CA, CO, HI governor; FL Senate special reset too). The validator only catches totals above 100.5%, so a milder mix could remain elsewhere.
- OnTheIssues: of the last eight positions, five were re-sourced and three deleted (Peltola education, Love immigration, Baisley education) for lack of a supporting page.
- Ten stiff position sentences (Demuth, James, El-Sayed, Rogers, Holscher, Bodnar, Colom, Booker, Mizusawa, Hageman) were reworded on 2026-11-15 after re-opening each source; Holscher's immigration, abortion and climate sentences and a few Demuth ones were not re-opened.
- A few position sentences outside the ten reworded candidates may still read stiffly.
- Lessons: facts were checked against web sources, but several official sites (vote.gov, Congress.gov, AP) block automated fetches, so those links were not opened.
- Kansas governor was marked called from HPPR and KCUR reports of the AP call and of a concession; AP's own page was not opened.

## Open tickets

- `issues/0014-certified-results.md`: more states certify through December; LA-05 and LA-06 runoffs Dec 12; MN-01.
- `issues/0009-house-drilldown.md`: House districts (later).
- `issues/0010-data-freshness.md`: who updates the data and how often.

## Working rules learned the hard way

- One writer per race file at a time. A concurrent write once erased five races of finished work.
- A position is shown only if the cited page was opened and supports the sentence.
- All vote shares in one race come from one count.
- Backups of the data at three points are in `data/.backup/` (git-ignored).
