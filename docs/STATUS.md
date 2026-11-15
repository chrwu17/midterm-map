# Status: Midterm Map

Last updated 2026-11-15. The first build is committed (fc44407); the 2026-11-15 fixes below are not.

## What exists

- Site in `web/`: Next.js static export. Home with the US map, a page for each of the 50 states, seven Lessons, and an About page. Run with `cd web && npm install && npm run dev`.
- Data in `data/races/`: 71 race files (35 U.S. Senate, 36 governor), one per Race, following `data/SCHEMA.md`.
- Lessons in `content/lessons/`: seven Markdown files.
- Validator: `node scripts/validate-data.mjs` (0 errors, about 110 warnings at last run; the warnings are the gaps below).
- Planning record in `issues/`: the map is `0000-map-midterm-map-site.md`.

## Site state at the end of the session

- Final build and lint pass (run 2026-11-14 at 8:46 pm, 63 pages). The build runs the data validator first.
- Motion is a hero headline entrance (SplitText + GSAP), a one-time map entrance, hover and focus dimming on the map, Lenis smooth scroll. Scroll-triggered card fades and growing vote bars came out in the motion review because they slowed reading down.
- Jargon popovers on state pages, fed from `content/lessons/political-terms.md`.
- Design gate (taste skill): PASS on the home page (2026-11-15). Five waivers with reasons are in `web/.taste-skill/waivers.json` (Lenis smooth scroll, no dealt moment, the map as half the hero, and the one-line footer twice). The gate caps waivers at five. The gate has only ever run on the home page, never on a state page.
- Home page now: headline and map side by side in one full screen, then a lessons section with a live preview of Lesson 1. Small-state chips sit in a "Small states" disclosure under the map.
- Fixed 2026-11-15: Lenis kept a stale page height, so the scroll stopped short of the bottom after an accordion opened. It now re-measures on any size change (`web/src/components/motion-provider.tsx`). Three lesson links pointed at `/lessons/` instead of `/learn/`. Map states now show a real focus outline.
- Still to do: the site is not deployed.
- Prose: the humanizer skill was run over the Lessons and over every race summary, bio and position (trims and reorders only, so some sentences still read stiffly). It was not run over the on-page site copy, the README or this file.

## Last changes before the session ended (8:47 to 8:55 pm)

- Design fixes from the gate's real findings: topic icons on lesson cards (home and /learn), one shared primary and secondary button style, a 2px focus ring on map states, a tooltip that moves by transform. The icons and buttons were checked in a screenshot (`docs/screenshots/home-1440-v4.png`); the focus ring and tooltip were not tested by hand. The gate was not re-run, so its count is unknown.
- Humanizer on site copy: only three strings changed (home and About) before time ran out. Components and the state page were not reviewed. See `issues/0016-humanize-site-copy.md`.
- New docs: `docs/HANDOFF.md` (decisions, design choices, guides) and `CLAUDE.md` (rules and commands for future agent sessions).
- Two positions were spot-checked by hand against their sources (Talarico economy, Holscher economy); both matched.

## Dataset numbers (measured from the files)

| Measure | Count |
|---|---|
| Races called / uncalled | 69 / 2 (both Alaska; ranked-choice count on Nov 18) |
| Major candidates | 143, all with a bio |
| With a confirmed website | 129 |
| With four or more positions | 138 |
| Positions | 673 |
| Positions citing Wikipedia or OnTheIssues | 34 |
| Minor candidates listed | 100 |
| Candidates with no vote share | 17 |

## How the data was checked

1. Winners: every race was compared with a second source besides Wikipedia. For most races that source is an AP-based tally page, not AP itself.
2. Positions: an agent opened the cited page for every position (672 at the time) and reworded, re-sourced or deleted what the page didn't support. About 183 were reworded, 24 re-sourced, 8 deleted.
3. Websites: each link was opened or confirmed another way; unconfirmed ones are null.
4. Bios: checked against opened pages in the second pass for most files. Bios were not part of the final position sweep.

## Known gaps

- Vote shares are unofficial. On 2026-11-15 the eight races that were missing shares (IL, MI, NJ, OR, TX Senate; NE and OR governor; NE Senate) were filled from one count each: Michigan and Texas from Wikipedia's results table, Nebraska from the Secretary of State's unofficial results, Illinois, New Jersey and Oregon from The Green Papers. Shares were computed from the vote counts on those pages. Oregon's count was about 97% reported on Nov 13 and has kept moving, and Illinois and New Jersey changed count source, so those three are the first to refresh. Write-in candidates are not listed.
- Mixed counts: three races had shares from two different counts and were fixed (CA, CO, HI governor; FL Senate special reset too). The validator only catches totals above 100.5%, so a milder mix could remain elsewhere.
- Five major candidates have fewer than four positions. None: Michael Katz (DE Senate), Darline Graham (SC Senate); their sites have no issue content. Three each: Bernadette Wilson (AK Senate), Dave Bronson (AK governor), Dan Ahlers (SD governor, no sourced page for the other issues). The 2026-11-15 pass filled Pappas, Rogers, Jermaine Johnson and Darren Bailey (see `data/CHANGELOG-2026-11-15-pass.md`). Alaska profiles were left alone until the Nov 18 count.
- 34 positions still cite secondary sources (Wikipedia and OnTheIssues), down from 64: the 2026-11-15 pass re-sourced 33 to news or official pages. The rest had no page that supports them; mostly Barry Moore, Sullivan and Peltola (Alaska, not touched), Sanders, Guckian, Brock Smith, Capito, Barr, Booker (ICE). Find them with a grep for `wikipedia.org|ontheissues.org` in `data/races`.
- Ten stiff position sentences (Demuth, James, El-Sayed, Rogers, Holscher, Bodnar, Colom, Booker, Mizusawa, Hageman) were reworded on 2026-11-15 after re-opening each source; Holscher's immigration, abortion and climate sentences and a few Demuth ones were not re-opened.
- A few position sentences outside the ten reworded candidates may still read stiffly.
- Lessons: facts were checked against web sources, but several official sites (vote.gov, Congress.gov, AP) block automated fetches, so those links were not opened.
- Kansas governor was marked called from HPPR and KCUR reports of the AP call and of a concession; AP's own page was not opened.

## Open tickets

- `issues/0013-secondary-sources.md`: replace Wikipedia/OnTheIssues citations; fill thin profiles.
- `issues/0014-certified-results.md`: swap in certified results; resolve Alaska after Nov 18.
- `issues/0009-house-drilldown.md`: House districts (later).
- `issues/0010-data-freshness.md`: who updates the data and how often.

## Working rules learned the hard way

- One writer per race file at a time. A concurrent write once erased five races of finished work.
- A position is shown only if the cited page was opened and supports the sentence.
- All vote shares in one race come from one count.
- Backups of the data at three points are in `data/.backup/` (git-ignored).
