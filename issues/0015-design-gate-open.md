---
title: Close the design gate on the home and state pages
labels: [wayfinder:task]
status: done
parent: 0000-map-midterm-map-site
---

## Question

The taste skill's checker ended three rounds with 28 failures open on the home page and never ran on a state page. Which findings are real for this site, and which get a waiver? Start from `web/.taste-skill/gate.json` and the four existing waivers in `web/.taste-skill/waivers.json`. Known real ones: lesson-card visuals, one button system, map focus rings, a headline that names the site. Known conflict: the checker wants the hero alone on the first screen, but the design brief keeps the map visible on load.

## Rerun, 2026-11-25

The checker's headless Chrome follows the OS color scheme, which was dark on this machine, so the gate runs below are the dark theme. The light theme was checked by running the same `consistency.mjs` on a scratch copy of the build with `class="light"` on `<html>`: no contrast findings on home, CA or WY.

| Page | Before | After |
|---|---|---|
| Home | 2 FAIL | `GATE: PASS` |
| California | 19 FAIL | 17 FAIL |
| Wyoming | 10 FAIL | 9 FAIL |
| South Dakota | 10 FAIL | 9 FAIL |

### Fixed

- Home `copy-headings`: the section headings now name what they hold ("2026 U.S. House results by district", "Lessons on how the races work").
- Home `one-heading`: the House section's text column now sits at the top of its row instead of the middle, so its heading and the Lessons heading never share a screen.
- `text-contrast` (CA, dark): grey text read 6.84:1 on cards. `--ink-muted` is now `#adb1b8` in dark (7.68:1 on cards) and `#4f535b` in light (7.72:1 on white, 7.08:1 on the page ground). Same grey, a shade stronger.
- State `copy-headline`: the h1 is now "California's 2026 races" (and "Texas' 2026 races" for names ending in s) instead of the bare state name.

### Left open, with reasons

These are landing-page rules that don't fit a long reading page, or that clash with the design brief. No waivers were added (the cap of 5 is used).

- `hero-screen`, `section-height`, `one-section`, `container-edges` (main > div), `one-heading` (h2 in the hero), `fold-action`: all come from one rule, that every page is a stack of one-screen `<section>`s with the hero alone on the first. A state page is one long reading column of race cards whose length depends on the data; splitting it into screen-tall sections would add empty space or cut cards.
- `cta` (WY, SD): the state page's job is reading the results, so it has no main button. The nav and the "Back to the map" link already lead back.
- `no-visual`, `card-visual`: a results page is text and numbers by nature. Adding pictures to 52 district cards would be decoration, and the brief keeps the vote bars and House map as the only visuals.
- `visual-caption`, `container-edges` (figcaption), `row-lines`, `split-pair` (CA close-ups): "Close-up A" is the key that ties each inset to its lettered dashed frame on the state map, not a caption that describes the picture. The close-ups sit right of the whole-state map on purpose, so the map comes first in reading order.
- `container-edges` (card headers, `li#WY-AL`, `li#SD-AL`): the text starts inside the race card's 28px padding. The checker wants text on the page's outer line, which would mean cards with no padding.
- `row-gap` (`li#CA-52`): 52 districts in a 3-column grid leave one card alone on the last row. The list is in district order, so the gap stays.
