# House results cross-check

Compiled 2026-11-25. Treat all results as unofficial until each state certifies.

This replaces the earlier cross-checks. No Wikipedia page is cited any more. All 553 Wikipedia links were removed at the project owner's request, after each district's other sources were compared with the data by script.

## Method and result

- All 50 Green Papers pages were downloaded again on 2026-11-25 with curl's default agent and parsed by script, without a summarizer. Every other cited page was also opened by curl on that day.
- All 435 districts were compared with Green Papers for roster, party, incumbent label, Elected marker and shares.
- **Roster:** every published candidate is in Green Papers (Michael Gist, FL-06, withdrew and was removed). Green Papers lists no ballot candidate that we omit.
- **Winners:** 432 are called, and Green Papers marks the same person elected in all 432. 1 is uncalled (MN-01). 2 are runoffs (LA-05, LA-06).
- **Shares:** they match within 0.011 points, apart from the state-count districts below. Vermont and Wyoming match the state documents and Green Papers votes once blanks, undervotes and overvotes are removed.
- **Second sources:** 323 called districts now rest on Green Papers alone for the winner. The README lists the rest.
- **Past check, no longer cited:** earlier on 2026-11-25 all 432 winners agreed with Wikipedia's check marks. Wikipedia had also been used for rosters.

## Corrections made in this pass

- Incumbent flags followed Green Papers' "Member of Congress" label. Set to true: Calvert (CA-40), Wasserman Schultz (FL-20), Kean (NJ-07), Casar (TX-37), Kennedy (UT-04). Set to false: Trever Nehls (TX-22).
- Party labels changed to Other with the printed label: Independent American (NV-02, NV-03, NV-04, UT-02), Independent Party of Connecticut (CT-03, CT-04), Socialism PSL (NY-15). Labels reworded as printed: American Constitution (CO-05, CO-07), Forward Party (FL-04), Nebraska Working People (NE-03).
- No share, winner or roster changed.

## Shares from a state source that differ from Green Papers

| Districts | Source opened | Note |
|---|---|---|
| AL-01 to AL-07 | Alabama canvassing board PDF, certified Nov 23 | Scanned; read by OCR. Both candidates' totals for AL-01 to AL-06 were read. Sewell's AL-07 total was not legible to OCR, so AL-07 now uses Green Papers (Sewell 174,823, Akin 77,085). |
| MA-01 to MA-09 | electionstats.state.ma.us | Blanks left out, "All Others" included. Green Papers omits "All Others". |
| MD-03 | Maryland State Board of Elections, page labeled unofficial | Maryland's eight districts all match that site. |
| NE-01 to NE-03 | electionresults.nebraska.gov | |

North Carolina's certified abstract (districts 1 to 13) and the New Mexico, Oregon and South Dakota state pages match the published shares. Every vote figure in Green Papers for New Mexico, Oregon and South Dakota appears on the state page. North Carolina's abstract differs by a few votes in some districts but gives the same shares. Its certification of winners names the same 14 people. Hawaii's state file matches the Green Papers votes.

## Re-sourced to Green Papers

- NV-01 to NV-04, ME-01 and AK-AL: shares changed, because the state source was closed. The Alaska elections site had returned a 403 earlier, so its pages are not used.
- Closed state sources dropped with no change to shares: CA, CO, GA, ID, MN, OK, RI, SC, TN, WV. Script-only pages dropped: ND, UT, VA, WA.
- The Clarity, Oklahoma, Tennessee, Georgia, Rhode Island and Maine hosts returned 403, and so did Ballotpedia. Florida's Division of Elections, Ohio's Secretary of State and Ohio's county boards (boe.ohio.gov) also returned 403. Minnesota's Secretary of State redirected to a bot check and Nevada's returned a bot-check page. Requests to the California and Idaho results APIs were refused by this project's permission check and were not retried.

## Formerly uncalled, now called on two or more sources

- **NC-05 Hubbard, NC-07 Rouzer, NC-10 Harrigan:** State Board certification of Nov 24 and its composite abstract, plus Green Papers.
- **TN-04 Broderick:** Green Papers and NewsChannel 9 (DesJarlais conceded Nov 16).
- **CA-23 Obernolte:** Green Papers and NBC Los Angeles (NBC projected winner).
- **AK-AL Begich:** Green Papers, Alaska Public Media (Nov 18: final round 51.35% to 48.65%) and Alaska's News Source (Nov 19).

## Not called

- **MN-01:** no marker on Green Papers, which says the contest is going to a recount. Green Papers has Johnson 163,065 and Finstad 162,741. FOX 9 reports the result was certified and a recount may be requested Nov 30 to Dec 4.
- **LA-05, LA-06:** runoff Dec 12. Shares are the Nov 3 open-primary count.

## Details checked

- **ME-02:** Green Papers gives the final round as LePage 170,890 (50.81%) and Dunlap 165,432 (49.19%). It prints the first choice as 49.894 and 48.307. The final round is published.
- **OH-04:** Green Papers leaves Tracey Tackett's party blank. Her campaign site says she ran as an Independent.
- **OH-09:** Matthew Althaus is absent from Green Papers, so he is not listed. A Wikipedia note that he was off the ballot was the earlier reason.
- **FL-06:** Michael Gist withdrew on Sept. 16 and his votes were not counted (News4JAX voters guide). Removed 2026-11-25.
- **FL-10:** Green Papers marks Frost elected with no opponent and no votes.
- **AK-AL** has an extra `factCheckNote`. The House page code does not read it and the validator accepts it.
