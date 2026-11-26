# House results (Nov 3, 2026)

Results only: one file per state, `data/house/<USPS>.json`, 50 files and 435 districts. No bios, websites or positions. **Treat all numbers as unofficial until each state certifies.** Data checked 2026-11-25. Validate with `node scripts/validate-house.mjs`.

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
    lastVerified: "2026-11-25" } ] }
```

- `party` is Democratic, Republican, Independent, Libertarian, Green or Other. `partyLabel` (the label as the source printed it) is set only for Other.
- Candidates are ordered winner first, then by `voteShare` descending. Write-ins are not listed.
- `voteShare` is a percent with two decimals, from one count per district. It is null when no source gave a figure for that candidate.
- `incumbent` is true for a sitting House member on the ballot, as Green Papers labels them, even if the member ran in a different district after redistricting. A former member is false.
- `party` and `partyLabel` follow the label in Green Papers. Nonparty labels (unaffiliated, no party, by petition, New Jersey petition slogans) are recorded as Independent. So is Pennsylvania's "The Independent Party" (PA-03).
- Fusion candidates (New York, Connecticut, Oregon) appear once, under their major-party label, with all ballot lines combined where the source did so.
- Minnesota's DFL is recorded as Democratic.

## Where the numbers come from

Every number was re-read on 2026-11-25 with plain curl and a parser. Earlier agents had fetched some pages with a browser user agent, so their figures were kept only where an openable page matched.

- **The Green Papers** (`thegreenpapers.com/G26/<STATE>`): 406 districts take all their shares from its count. Each share is a candidate's votes divided by the printed district total. In Hawaii and New York the total includes blank and void ballots, so shares sum to under 100.
- **State sources that opened normally** give the shares in 28 districts: Alabama (6, State Canvassing Board; AL-07 uses Green Papers), Maryland (8, labeled unofficial), Massachusetts (9, blanks left out), Nebraska (3), Vermont (1, blanks and overvotes left out) and Wyoming (1, undervotes and overvotes left out). North Carolina's certified abstract, and the state pages for New Mexico, Oregon and South Dakota, match the Green Papers counts.
- **FL-10** has no count. Frost is the only candidate listed.
- **Rosters, parties and incumbent flags:** Green Papers, compared by script for all 435 districts on 2026-11-25. Two candidates need another page. Green Papers lists no party for Tracey Tackett (OH-04), so her campaign site is cited. Michael Gist (FL-06) was removed; see below.
- **Winners:** every called winner has the Green Papers Elected marker. No Wikipedia page is cited. See "How many sources back each winner".

## How many sources back each winner

432 districts are called. Winners were checked against Wikipedia on 2026-11-25 as a second source. Those links have since been removed at the project owner's request, so that second source no longer backs the data.

- **323 districts: Green Papers alone** for the winner. Some list other links, but those do not name the winner (Minnesota's certification story, North Dakota's, and the OH-04 and FL-06 candidate pages).
- **California (52):** Green Papers and NBC Los Angeles, which marks a projected winner from the NBC News Decision Desk. All 52 agree.
- **North Carolina (14):** Green Papers and the State Board's certification of winners.
- **Massachusetts (9):** Green Papers and the state results page, which prints who won.
- **Other states (32):** Green Papers and a state count in which the same person leads: Alabama 7 (AL-07 in the scan shows Akin's total only), Hawaii 2, Maryland 8, Nebraska 3, New Mexico 3, Oregon 6, South Dakota 1, Vermont 1, Wyoming 1.
- **TN-04 and AK-AL:** Green Papers and the news reports listed in `CROSSCHECK.md`.

A state URL is in `sources` only if it opened by ordinary fetch and its content could be read. Alaska, California, Colorado, Georgia, Idaho, Maine, Minnesota (Secretary of State), Nevada, Oklahoma, Rhode Island, South Carolina, Tennessee and West Virginia were closed or refused, and Utah, Virginia, Washington and North Dakota served an empty script page. Those districts use Green Papers.

## Seats and lines

435 districts. District numbers are those Green Papers uses for the 2026 election. Several states redrew mid-decade (see `GEOMETRY.md`), so a district number in 2026 may not match the same number in 2024.

## Not called

- `uncalled` (1): MN-01. Green Papers marks no winner and says the contest is going to a recount. The state canvassing board certified a narrow lead for Jake Johnson and a recount can be requested (FOX 9).
- `runoff` (2): LA-05 and LA-06 (Dec 12). Shares are the Nov 3 open-primary count and `winnerId` is null.

## Ranked choice

- AK-AL shares are first-choice shares from Green Papers, without write-ins. ME-02 shares are the final ranked-choice round from Green Papers, which also prints the first-choice figures (LePage 49.89, Dunlap 48.31). The two are not on the same basis. `factCheckNote` on AK-AL is an extra field that the site does not read.

## Uncontested and null shares

- FL-10: Green Papers marks Maxwell Frost elected, lists no opponent and prints no votes, so `voteShare` is null. In WI-02 the source gives one candidate. MA-02, MA-05 and MA-07 had one candidate; write-in votes are in the total, so the share is under 100.
- FL-06: Michael Gist (no party affiliation) qualified in June but sent the Florida Division of Elections a letter of withdrawal on Sept. 16, and votes for him were not counted (News4JAX voters guide, updated Sept. 30). He was removed on 2026-11-25.
