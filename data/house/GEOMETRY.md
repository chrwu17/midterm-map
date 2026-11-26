# House map geometry

Every state has a map. All 50 come from one release: U.S. Census Bureau, TIGER/Line 2026, 120th Congressional Districts (`https://www2.census.gov/geo/tiger/TIGER2026/CD/tl_2026_<FIPS>_cd120.zip`, posted Nov. 9, 2026; downloaded Nov. 25, 2026). TIGER/Line boundaries run out into the water, so each state is clipped to the Census cartographic boundary shoreline (`https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_state_500k.zip`). Census had no 120th Congress cartographic boundary file on that date. Both files are public domain.

## How the 2026 lines were verified

Pages opened Nov. 25, 2026:

- [Census, 120th Congress districts](https://www.census.gov/programs-surveys/decennial-census/about/rdo/congressional-districts.120th_Congress.html) and [block equivalency files](https://www.census.gov/geographies/mapping-files/2027/dec/rdo/120-congressional-district-bef.html): nine states drew new boundaries for 2026 (Alabama, California, Florida, Louisiana, North Carolina, Ohio, Tennessee, Texas, Utah). All others, including Virginia, are unchanged from 2024. Missouri's file was regenerated after the U.S. Supreme Court declined on Sept. 23, 2026 to allow the 2025 plan, and now holds the 2022 and 2024 plan.
- [NCSL mid-decade redistricting tracker](https://www.ncsl.org/redistricting-and-census/changing-the-maps-tracking-mid-decade-redistricting) (updated Nov. 17, 2026): same nine states; Missouri on 2022 maps, Virginia on 2021 maps. Its dates are used below.
- [Roll Call, Nov 4, 2026](https://www.rollcall.com/2026/11/04/redistrcting-republican-house-seats-midterm-elections) and [NCSL redistricting tracker](https://www.ncsl.org/redistricting-and-census/changing-the-maps-tracking-mid-decade-redistricting): read by an independent checking agent on 2026-11-25, which found both agree on the nine redrawn states, and that Missouri and Virginia kept earlier lines. Missouri also: [KCUR results page](https://www.kcur.org/politics-elections-and-government/2026-11-03/missouri-election-results-5th-district-cleaver-brattin).

Geometry check: each 2026 file was overlaid on TIGER/Line 2025 (119th Congress). "Area moved" is land and water assigned to a different district number. Only the nine states above exceed 3 km²; the small figures elsewhere are boundary realignment. State plans were not separately downloaded: the files are the plans states submitted to Census.

## Per state

"New" means the 2026 lines differ from 2024. Every source file is `tl_2026_<FIPS>_cd120`; SHA-256 is the first 12 digits of the zip. Area moved is in km².

| State | FIPS | Districts | Lines | Area moved | SHA-256 | Note |
|---|---|---|---|---|---|---|
| AL | 01 | 7 | New | 20,818.1 | `0c6742aa2cd4` | State-drawn 2023 plan; the Supreme Court let it be used on June 2, 2026 |
| AK | 02 | 1 | Unchanged | 0.0 | `cee427c42aef` | At-large |
| AZ | 04 | 9 | Unchanged | 0.3 | `f61791f53eef` |  |
| AR | 05 | 4 | Unchanged | 0.0 | `36de94bd1985` |  |
| CA | 06 | 52 | New | 142,822.3 | `644e5a3f2468` | Proposition 50 plan, approved Nov. 4, 2025 |
| CO | 08 | 8 | Unchanged | 0.5 | `1b21a2bb6c03` | 0.5 km² of boundary realignment only |
| CT | 09 | 5 | Unchanged | 0.3 | `ff6c0d7cdbfc` |  |
| DE | 10 | 1 | Unchanged | 0.0 | `c2590068cb57` | At-large |
| FL | 12 | 28 | New | 43,440.6 | `d61eed23775e` | Enacted May 4, 2026 |
| GA | 13 | 14 | Unchanged | 0.6 | `cb6a9f4ec450` |  |
| HI | 15 | 2 | Unchanged | 0.0 | `0022a9205734` | Northwestern islands left off so the main islands are legible |
| ID | 16 | 2 | Unchanged | 0.0 | `31207667c451` |  |
| IL | 17 | 17 | Unchanged | 0.4 | `bc639d82852f` |  |
| IN | 18 | 9 | Unchanged | 0.0 | `5404f4566214` |  |
| IA | 19 | 4 | Unchanged | 0.0 | `55c6c8fc4a49` |  |
| KS | 20 | 4 | Unchanged | 0.0 | `d90b44ee91d7` |  |
| KY | 21 | 6 | Unchanged | 0.0 | `7c08197a87e3` |  |
| LA | 22 | 6 | New | 31,766.1 | `33be639ca87f` | Enacted May 29, 2026 |
| ME | 23 | 2 | Unchanged | 0.0 | `cf9e7be44199` |  |
| MD | 24 | 8 | Unchanged | 0.0 | `fec98d244ea4` | Nov. 2026 amendment did not change the 2026 lines |
| MA | 25 | 9 | Unchanged | 0.0 | `4aba13152154` |  |
| MI | 26 | 13 | Unchanged | 0.0 | `95c6de0f3953` |  |
| MN | 27 | 8 | Unchanged | 0.0 | `8e571b045ee7` |  |
| MS | 28 | 4 | Unchanged | 0.0 | `1da82064329f` |  |
| MO | 29 | 8 | Unchanged | 2.0 | `ad6d2f736622` | 2025 plan blocked for 2026; same plan as 2022 and 2024 |
| MT | 30 | 2 | Unchanged | 0.0 | `0c0a377c5bbd` |  |
| NE | 31 | 3 | Unchanged | 0.0 | `30d372d96045` |  |
| NV | 32 | 4 | Unchanged | 0.0 | `1ce5cd0f0bad` |  |
| NH | 33 | 2 | Unchanged | 0.0 | `261622f64427` |  |
| NJ | 34 | 12 | Unchanged | 0.0 | `e00cd037910f` |  |
| NM | 35 | 3 | Unchanged | 0.0 | `0c430b0715a5` |  |
| NY | 36 | 26 | Unchanged | 0.0 | `21e0e8133ad4` |  |
| NC | 37 | 14 | New | 21,381.7 | `6bb140687cf8` | Enacted Oct. 22, 2025 |
| ND | 38 | 1 | Unchanged | 0.0 | `6474715ec8f2` | At-large |
| OH | 39 | 15 | New | 25,050.4 | `91f135ea4008` | Commission plan, adopted Oct. 31, 2025 |
| OK | 40 | 5 | Unchanged | 0.0 | `79542ca32cbf` |  |
| OR | 41 | 6 | Unchanged | 0.0 | `40de44b80bee` |  |
| PA | 42 | 17 | Unchanged | 0.0 | `ccf9f2865516` |  |
| RI | 44 | 2 | Unchanged | 0.0 | `b05b8f7657a6` |  |
| SC | 45 | 7 | Unchanged | 1.0 | `29bbe933c4d7` |  |
| SD | 46 | 1 | Unchanged | 0.0 | `c10adabee409` | At-large |
| TN | 47 | 9 | New | 43,705.9 | `dab6788291ea` | Adopted May 7, 2026 |
| TX | 48 | 38 | New | 122,040.0 | `0d700a7f7845` | Enacted Aug. 29, 2025; Supreme Court stay Dec. 4, 2025 |
| UT | 49 | 4 | New | 135,527.7 | `a3a9aba9faa3` | Court-ordered plan, Nov. 10, 2025 |
| VT | 50 | 1 | Unchanged | 0.0 | `01544c988076` | At-large |
| VA | 51 | 11 | Unchanged | 0.0 | `4e6e2a313ec0` | 2026 plan struck down May 8, 2026; earlier plan used |
| WA | 53 | 10 | Unchanged | 0.0 | `7a5fc7791e83` |  |
| WV | 54 | 2 | Unchanged | 0.0 | `c0d10a3d6ff8` |  |
| WI | 55 | 8 | Unchanged | 0.0 | `e62e3685bfac` |  |
| WY | 56 | 1 | Unchanged | 0.0 | `ac5814578066` | At-large |

## Processing

`scripts/build-house-geometry.mjs` (needs [mapshaper](https://github.com/mbloch/mapshaper); not part of the site build) clips, projects each state with its own equal-area projection, simplifies, and writes `data/house-geometry/<STATE>.json`. Crowded areas get lettered close-ups. Each file holds only that state, and the state page inlines it at build time. Simplified shapes are for orientation and cannot settle which district an address is in.

`getHouseMap` in `web/src/lib/house.ts` drops the map if its districts do not match the result list exactly; the page then shows the list and a one-line explanation.
