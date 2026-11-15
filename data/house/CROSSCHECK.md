# House results cross-check

Compiled 2026-11-15. All results are unofficial until each state certifies.

Sources: Wikipedia ("2026 United States House of Representatives elections" and the per-state articles) and The Green Papers (thegreenpapers.com/G26/<STATE>). Green Papers pages were read through WebFetch, a summarizer, so figures were transcribed from its output. In testing, its first summary misread two "Elected" icons (NC-07 and NC-10 looked marked; a targeted re-read showed no marker), so markers for the closest races were re-read district by district.

## Rule used

A district is `called` only when Wikipedia and Green Papers both mark the same winner and that winner has the highest share. If only one source marks a winner, or they disagree, it is `uncalled` with `winnerId` null.

## Result

- All 435 districts were compared with Green Papers (all 50 states). 426 are called on both sources, 7 uncalled, 2 runoff.
- Where a district's winner is marked in both sources, the winner is the same in every case. The differences are the districts below.
- Close called races (margin under 3 points) had the Green Papers Elected icon re-read row by row: AR-02, AZ-02, AZ-08, CO-03, CO-04, FL-04, FL-07, FL-09, FL-13, FL-26, FL-27, ME-02, MI-04, NC-03, NC-06, NC-08, NC-09, NC-13, NC-14, NJ-02, NY-01, NY-02, NY-21, OH-10, OK-05, SC-01, SC-02, TN-07, TN-09, TX-02, TX-05, TX-27, TX-32, VA-05, VA-01. All matched Wikipedia.

## Uncalled or runoff

- **NC-07**: Wikipedia main table still reads "Incumbent renominated" and neither the table nor the state article marks a winner; Green Papers shows David Rouzer (R) 160,702 (49.87%) ahead of Kimberly Hardy (D) 158,391 (49.15%) but no Elected icon. Previously `called`; now `uncalled`.
- **NC-10**: Wikipedia marks Pat Harrigan (R, 49.63% vs Ashley Bell 48.78%); Green Papers shows no Elected icon. Changed from `called` to `uncalled`.
- **NC-05**: Hubbard (D) 139,770 (48.74%) vs Foxx (R) 139,439 (48.62%); neither source marks a winner.
- **MN-01**: Wikipedia state article marks Jake Johnson (DFL, 163,055, 49.99%); Green Papers shows him ahead of Brad Finstad (162,733, 49.89%) but no Elected icon.
- **TN-04**: Wikipedia infobox bolds Victoria Broderick (D, 95,585, 48.87%); Green Papers has no Elected icon on any row (DesJarlais, R, 95,305, 48.73%, is in bold as incumbent). Earlier note that Green Papers marked DesJarlais was a misreading.
- **CA-23**: Obernolte (R) 109,037 (50.81%) vs Hodge (D) 105,541 (49.19%); no source marks a winner.
- **AK-AL**: ranked-choice count not final (Nov 18). Shares left null.
- **LA-05, LA-06**: runoff Dec 12. Shares are the Nov 3 open-primary count (Green Papers).
- **ME-02**: called (both mark Paul LePage). Green Papers gives a final-count table (LePage 50.81%, Dunlap 49.19%) and a separate first-choice list (49.894% / 48.307%, blanks 1.763%) that does not sum to the table total; the table is used.
- **NY-17**: Green Papers marks Caitlin Conley (D, 52.52%) as Elected although Mike Lawler (R) is the listed incumbent; Wikipedia agrees. Called.
- **FL-10**: Maxwell Frost unopposed; both sources mark him; no vote counts exist.

## New York and California shares

Replaced the partial Wikipedia snapshots (65 to 97 percent reporting, Nov 5 to Nov 10) with one Green Papers count per district. Every candidate row was read; shares are votes divided by the district total printed on the page (blank, void and write-in votes are in the total, so a district's shares can sum to under 100). The vote rows read were checked to sum to the printed total in all 78 districts. No district was left on the old numbers. Two California top-two districts have two candidates of the same party (for example CA-04, CA-07), as printed.

## Share differences, Wikipedia v Green Papers (winner share differs by more than 0.5 points, 244 comparisons)

| District | Winner | Published (Wikipedia) | Green Papers |
|---|---|---|---|
| AZ-03 | Yassamin Ansari | 87.4 | 86.64 |
| UT-03 | Celeste Maloy | 57.2 | 56.6 |
| VT-AL | Becca Balint | 65.22 | 63.8 |
| VA-09 | Morgan Griffith | 65.88 | 65.32 |
| WY-AL | Chuck Gray | 54.22 | 52.11 |

These keep the Wikipedia count (one count per district). Winners agree.

## Internal disagreements inside Wikipedia pages

- AL-5: strong: outlier signal [('boxcalc', 56.99)]
- CT-2: austin: outlier signal [('boxcalc', 75.09)]
- CT-5: hayes: outlier signal [('boxcalc', 115.66)]
- MO-3: onder: outlier signal [('boxpct', 52.88)]
- MO-3: mann: outlier signal [('boxpct', 44.39)]
- MO-5: brattin: outlier signal [('boxcalc', 12.52)]
- MO-8: smith: outlier signal [('infocalc', 68.51)]
- MO-8: reichard: outlier signal [('infocalc', 29.47)]
- MT-2: downing: outlier signal [('infocalc', 57.72)]
- MT-2: miller: outlier signal [('infocalc', 31.93)]
- NC-9: ojeda: outlier signal [('boxpct', 51.5)]
- UT-3: maloy: outlier signal [('boxcalc', 58.4), ('infocalc', 58.05)]
- UT-3: udell: outlier signal [('boxcalc', 36.13), ('infocalc', 35.59)]
- AL-05: Wikipedia lists Dale Strong at 152,080 votes but its total (266,843) and percentage (53.2%) imply 142,080; Green Papers shows 142,080 (53.19%). The published 53.24% share follows the corrected figure.
- UT-03: Wikipedia box, infobox and inline figures differ by up to about 1.2 points; the median of agreeing figures is used.

## Districts whose shares come from Green Papers (other than NY and CA)

FL-11, FL-8, FL-9, HI-1, HI-2, IL-1, IL-10, IL-11, IL-12, IL-13, IL-14, IL-15, IL-16, IL-17, IL-2, IL-3, IL-4, IL-5, IL-6, IL-7, IL-8, IL-9, KS-1, KS-2, KS-3, KS-4, LA-1, LA-2, LA-3, LA-4, LA-5, LA-6, MA-1, MA-2, MA-3, MA-4, MA-5, MA-6, MA-7, MA-8, MA-9, ME-2, MS-1, MS-2, MS-3, MS-4, NH-1, NH-2, NM-1, NM-2, NM-3, OR-1, OR-2, OR-3, OR-4, OR-5, OR-6, PA-11, PA-12, PA-13, PA-14, PA-15, PA-16, PA-17, PA-2, PA-4, PA-5, PA-6, PA-9, TN-1, TN-2, TN-3, TN-4, TN-5, TN-6, TN-7, TN-8, TN-9, TX-1, TX-23, TX-26, TX-27, TX-28, TX-29, TX-30, TX-31, TX-32, TX-33, TX-34, TX-35, TX-36, TX-37, TX-38, TX-7, WA-1, WA-10, WA-2, WA-6, WA-7, WA-8, WA-9, WI-1, WI-2, WI-3, WI-4, WI-5, WI-6, WI-7, WI-8

All shares in each of these come from the one Green Papers count. Hawaii percentages include blank votes in the total.
