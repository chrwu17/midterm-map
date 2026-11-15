---
title: How uncalled races get updated after launch
labels: [wayfinder:grilling]
status: done
parent: 0000-map-midterm-map-site
---

## Question

When an uncalled race or runoff resolves, who updates `data/races/*.json`, how often, and how does the site show "last verified"? (Manual re-check script vs. an agent routine.)

## Answer

Decided 2026-11-15. The data is hand-curated, so it is updated by hand (or by an agent run that a person reviews).

**Who:** the project owner, or an agent they start, following the guides in `docs/HANDOFF.md` ("Edit one race", "Update a result", "Run a bulk pass with agents"). One writer per race file at a time; back up `data/races` to `data/.backup/` first.

**How often:**
- Alaska (AK-senate, AK-governor): once, after the ranked-choice count on Nov 18, 2026. Set `status` to "called", set `winnerId`, refresh every `voteShare` from one results page, rewrite `summary`, set `lastVerified`.
- Every other race: swap unofficial shares for certified results when each state certifies. Do this in one pass between late November and mid December, starting with Oregon, Illinois and New Jersey (the counts that moved most).
- After that, no routine updates are needed for a past election. Re-check only if a recount, court ruling or correction is reported.

**Steps for each refresh:**
1. Back up `data/races`.
2. Open the state's certified results page and take all shares from that one page.
3. Update `voteShare`, `sources`, `lastVerified` and, if the winner changed, `winnerId` and `summary`.
4. Run `node scripts/validate-data.mjs`, then `cd web && npm run build`.
5. Redeploy the static site.

**Showing freshness:** each race card already says results are unofficial until the state certifies them. When a race is certified, update `lastVerified` and the `factCheckNote` so the page reflects it. See `issues/0014-certified-results.md` for the certified-results pass.
