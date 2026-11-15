# Midterm Map

A nonpartisan, English-only educational site for new voters about the November 3, 2026 U.S. Senate and governor races. Course project. Read `docs/HANDOFF.md` first, then `docs/STATUS.md` for the current gaps.

## Commands

```bash
cd web && npm install        # first time
cd web && npm run dev        # local site
cd web && npm run build      # runs the data validator, then a static export to web/out
cd web && npm run lint
node scripts/validate-data.mjs          # all checks; --quiet shows errors only
```

## Where things live

- `web/`: Next.js (App Router, static export), TypeScript, Tailwind, shadcn, GSAP, Lenis.
- `data/races/*.json`: one file per race. Schema and neutrality rules: `data/SCHEMA.md`.
- `content/lessons/*.md`: the Lessons. `political-terms.md` also feeds the jargon popovers, so keep its entry structure.
- `issues/`: the planning map (`0000-map-midterm-map-site.md`) and its tickets, in the wayfinder format.
- `docs/`: handoff, status, design brief, screenshots.
- `GLOSSARY.md`: the project's own vocabulary (Race, Candidate, Result, Lesson, New Voter).

## Rules that are easy to break

- **Nonpartisan.** Describe what a candidate says or did; never evaluate. The map is shaded by which offices were on the ballot, never by party. No red or blue panels.
- **A position is shown only if its cited page was opened and supports the sentence.** Never write a position from memory. Never strengthen a claim when rewording.
- **One writer per race file at a time.** Two agents writing the same file once erased five races of work. Back up `data/races` to `data/.backup/` before any bulk pass.
- **All vote shares in one race come from one count.** Results are unofficial until states certify.
- **Never guess a winner or a website.** Use `status: "uncalled"` and `website: null`.
- **Run the humanizer skill over prose** written for the user (their standing preference). For position sentences, pair any rewrite with a re-check against the source.
- Don't commit or deploy unless asked. Nothing has been committed yet.

## Bulk data passes

Reusable agent instructions are in `data/`: `PROFILE-PASS.md` (fill bios, websites, positions), `SOURCE-SWEEP.md` (check every position against its source), `SUMMARY-PASS.md` (plain race summaries), `RESULTS-PASS.md` (vote shares and minor candidates), `HUMANIZE-PASS.md` (readability without changing claims). Give each agent a disjoint list of files.
