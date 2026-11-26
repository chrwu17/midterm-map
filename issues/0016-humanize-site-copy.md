---
title: Humanizer pass over on-page site copy
labels: [wayfinder:task]
status: in-progress
parent: 0000-map-midterm-map-site
---

## Question

The humanizer skill has been run over the Lessons, the race data, the README and the status file, but not over the wording inside the site's components (hero, map captions, empty states, About page, not-found page). Run it there, wording only. Also revisit the position sentences the data pass left stiff on purpose (listed in the agents' reports: Demuth, James, El-Sayed, Rogers, Holscher, Bodnar, Colom, Booker, Mizusawa, Hageman), each with its source page open.

## Site copy pass, 2026-11-25

The humanizer skill was run over the wording in `web/src`: the hero, the map caption and legend, the House section and map, race-card notes and empty states, the Lessons list, the About page, the footer and the not-found page. Most of it was already plain. Changes, wording only:

- Home, Lessons section: the line under the heading repeated it ("Short lessons on how elections work"), so it now reads "Each one is short, and you don't need any background." The heading itself changed for the design gate (0015).
- About, first paragraph: "It also shows U.S. House results. It does not..." merged into the sentence before it, so three sentences no longer open with "It".
- About, "How we checked the results": "We take each race's vote shares and status from..." now reads "Each race's vote shares and status come from...", breaking a run of sentences that start with "We".
- House map, no-map state: "No map here: we could not confirm X's 2026 district lines." now reads "We could not confirm X's 2026 district lines, so there is no map."

Not changed: `data/` and `content/lessons/`.

## Still open

The position sentences the data pass left stiff on purpose (Demuth, James, El-Sayed, Rogers, Holscher, Bodnar, Colom, Booker, Mizusawa, Hageman) are left for a later pass. Each needs its source page open while rewording.
