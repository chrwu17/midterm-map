# Midterm Map

Midterm Map is a nonpartisan static website for new voters about the 2026 U.S. midterm Senate and governor races. It has a clickable map of the states, one page per state with results and a side-by-side look at where the major candidates stand on six issues, and short lessons on how elections work.

## Run and build

```sh
cd web && npm install && npm run dev     # local dev server at http://localhost:3000
npm run build                            # static export to web/out/
npm run lint
```

## Folder layout

| Path | What it holds |
|---|---|
| `web/` | The Next.js site (pages in `web/src/app`, components in `web/src/components`, data loaders in `web/src/lib`) |
| `data/races/` | One JSON file per race, e.g. `GA-senate.json`, `OH-senate-special.json` |
| `data/SCHEMA.md` | The race file format and the neutrality rules for writing it |
| `content/lessons/` | The "Learn" lessons, as Markdown files |
| `issues/` | Planning notes and decisions, numbered |
| `docs/` | Design brief and screenshots |

## Editing a race file

1. Open the file in `data/races/` named `<STATE>-<office>[-special].json`.
2. Follow `data/SCHEMA.md`: candidates go winner first, then by vote share. Every bio fact and position needs a source URL.
3. If a result is not certain, set `"status": "uncalled"` and `"winnerId": null`.
4. Update `lastVerified` to the date you checked.
5. Run `npm run validate-data` in `web/` to check every race file against the schema and the neutral-wording rules. `npm run build` runs the same check first (`prebuild`), so a broken file stops the build with a message naming the file and the problem. Warnings (style notes, missing optional fields) do not stop the build. To see them, run `node scripts/validate-data.mjs` from the repo root without `--quiet`.

## Nonpartisan rules

- Describe what candidates say or did, in their own framing, and never evaluate it.
- Ask the same six issues of every major candidate, and leave one blank rather than guess.
- The map and every party label use neutral styling. Never name a winner who has not been projected.

## Known limits

- Results are unofficial until each state certifies them.
- As of 2026-11-14, two races were uncalled, both in Alaska (Senate and governor); the ranked-choice count is on November 18. The site reads each race's status from its data file, so it updates when the files do.
- Some candidates have few or no sourced positions yet. Wikipedia and OnTheIssues entries are secondary summaries, not the candidate's own words.
