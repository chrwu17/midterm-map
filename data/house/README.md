# House results (Nov 3, 2026)

Results only: one file per state, `data/house/<USPS>.json`, 50 files and 435 districts. No bios, websites or positions. **All numbers are unofficial until each state certifies.** Data checked 2026-11-15. Validate with `node scripts/validate-house.mjs`.

## Schema

```
{ state, stateName, electionDate: "2026-11-03",
  districts: [ {
    id: "TX-01" ("AK-AL" for at-large),
    district: "1" ("AL" for at-large),
    status: "called" | "uncalled" | "runoff",
    winnerId: candidate id, or null unless status is "called",
    candidates: [ { id, name, party, partyLabel?, incumbent, voteShare } ],
    sources: [URLs opened],
    lastVerified: "2026-11-15" } ] }
```

- `party` is Democratic, Republican, Independent, Libertarian, Green or Other. `partyLabel` (the label as the source printed it) is set only for Other.
- Candidates are ordered winner first, then by `voteShare` descending. Write-ins are not listed.
- `voteShare` is a percent with two decimals, from one count per district. It is null when no source gave a figure for that candidate.
- Fusion candidates (New York, Connecticut, Oregon) appear once, under their major-party label, with all ballot lines combined where the source did so.
- Minnesota's DFL is recorded as Democratic.

## Where the numbers come from

- Candidate rosters and winner markers: Wikipedia, "2026 United States House of Representatives elections" (state tables), plus the per-state articles (California is split into two articles; the at-large states use the singular "election in").
- Shares: the per-district election boxes and infoboxes in the state articles, computed as votes divided by the district total. When the box total, stated percentages and infobox disagreed, the value that two or more agreed on was used.
- Besides NY and CA, 109 districts take all their shares from The Green Papers, either because Wikipedia had no usable numbers or to include every minor candidate (listed in `CROSSCHECK.md`). Green Papers percentages include blank or scattering votes in the denominator, so shares in Hawaii sum to under 100.
- New York and California shares are one Green Papers count per district (votes divided by the printed district total), replacing Wikipedia's partial snapshots.
- Winners: all 435 districts in all 50 states were compared against Green Papers; 426 are called on both sources.

## Seats and lines

435 districts. Districts follow the 2026 lines described in the state articles. Several states redrew mid-decade (the Wikipedia article lists them), so a district number in 2026 may not match the same number in 2024.

## Not called

- `uncalled` (7): AK-AL (ranked-choice count pending, due Nov 18; shares left null), CA-23, MN-01, NC-05, NC-07, NC-10, TN-04. A district is `called` only when Wikipedia and The Green Papers both mark the same winner (see `CROSSCHECK.md`).
- `runoff` (2): LA-05 and LA-06 (Dec 12). Shares are the Nov 3 open-primary count and `winnerId` is null.

## Uncontested and null shares

- FL-10: Maxwell Frost was unopposed and no election was held, so `voteShare` is null. In MA-02, MA-05, MA-07 and WI-02 the source gives a single candidate at 100 percent.
- Many minor candidates have `voteShare` null because the sources used only gave the top two. They were still on the roster in Wikipedia.
