# Status: Midterm Map

Last updated 2026-11-14, end of the first build session. Nothing is committed to git yet.

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
- Design gate (taste skill): OPEN, 28 to 29 failures after three rounds, home page only. Real ones to fix next: lesson cards have no icons, buttons aren't one consistent style, the headline doesn't name what the site is, map focus rings. Four waivers with reasons are in `web/.taste-skill/waivers.json`.
- Still to do: the tooltip doesn't follow the cursor smoothly; the gate never ran on a state page; the site is not deployed.
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
| With four or more positions | 133 |
| Positions | 665 |
| Positions citing Wikipedia or OnTheIssues | 64 |
| Minor candidates listed | 100 |
| Candidates with no vote share | 17 |

## How the data was checked

1. Winners: every race was compared with a second source besides Wikipedia. For most races that source is an AP-based tally page, not AP itself.
2. Positions: an agent opened the cited page for every position (672 at the time) and reworded, re-sourced or deleted what the page didn't support. About 183 were reworded, 24 re-sourced, 8 deleted.
3. Websites: each link was opened or confirmed another way; unconfirmed ones are null.
4. Bios: checked against opened pages in the second pass for most files. Bios were not part of the final position sweep.

## Known gaps

- Vote shares are unofficial and were read between Nov 4 and Nov 14. Some are partial counts. Eight called races still have missing or incomplete shares: IL-senate, MI-senate, NE-governor, NE-senate, NJ-senate, OR-governor, OR-senate, TX-senate.
- Mixed counts: three races had shares from two different counts and were fixed (CA, CO, HI governor; FL Senate special reset too). The validator only catches totals above 100.5%, so a milder mix could remain elsewhere.
- Ten major candidates have fewer than four positions. None: Michael Katz (DE Senate), Darline Graham (SC Senate). Three each: Bernadette Wilson, Dave Bronson (AK governor), Rob Sand (IA governor), Darren Bailey (IL governor), Mike Rogers (MI Senate), Chris Pappas (NH Senate), Jermaine Johnson (SC governor), Dan Ahlers (SD governor).
- 64 positions cite secondary sources (46 OnTheIssues, 18 Wikipedia). The web-search budget ran out before we could replace them.
- Some position sentences are accurate but clunky after the sweep ("Lists X among the goals … according to KOLD").
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
