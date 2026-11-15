# Midterm Map: design brief (v1)

Sources: design-taste-frontend (taste-skill 2.5) house rules, adapted for a civic/education site (kind: "other", so flat grounds, type-led, no shader effects or scenes, no violet). emilkowalski/skills (emil-design-eng) sets the Motion section: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, UI motion under 300ms, never ease-in, exact properties instead of `transition: all`, press feedback 100-160ms.

## Direction
A calm public-information page, closer to a well-set newspaper explainer than a campaign site. Plain copy, one idea per section, the map is the "real product UI" shown at true size on the first screen after the hero line.

## Type
- Headings: **Fraunces** (serif, optical sizes), weight 600, tight tracking (-0.02em). One type moment: the hero headline, set large (clamp 2.5rem to 4.5rem).
- Body and UI: **Public Sans** (the U.S. Web Design System face, fitting a civic site; not a generic default), 16px base, 1.6 line height, 65ch max measure for prose.
- Numbers (vote share): Public Sans with `tabular-nums`.

## Palette (party-neutral)
Warm paper, ink, one civic teal accent. Map shading encodes *which offices were on the ballot*, never party.

| Token | Light | Dark | Use |
|---|---|---|---|
| bg | #f7f5f0 | #14161a | page ground |
| surface | #ffffff | #1c1f24 | cards |
| ink | #1b1d21 | #ecebe6 | text |
| muted | #5d6169 | #a3a7ae | secondary text |
| line | #e3dfd6 | #2c3037 | borders |
| accent | #0f6e6e | #5cc2bd | links, focus, "both" on map |
| map-senate | #9cc9c4 | #2f6f6a | Senate only |
| map-governor | #e3c08a | #8a6a35 | Governor only |
| map-both | #0f6e6e | #5cc2bd | both |
| map-none | #e6e2d9 | #2a2d33 | none / no data |

Party tags: small text pills, all the same shape and weight, with a 1-letter code and very subtle tint (Democratic = slate blue tint #e8edf5, Republican = clay tint #f5ebe8, Independent/other = neutral gray). Tint saturation is capped so no party reads louder. Vote-share bars use the neutral ink color for every candidate; the winner gets a check mark and bold name, not a color.

## Spacing and shape
- 4px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Content max width 1120px, 16px gutters on mobile, 32px on desktop; equal left and right edges.
- Radius: 12px cards, 999px pills. 1px `line` borders, no heavy shadows (one soft shadow on hover lift).

## Page layouts
- **Home**: hero (eyebrow "2026 midterms, explained", SplitText headline, one sentence, two quiet links) fills the first screen top; the map section below with a legend row and "Pick a state" select; then a Lessons strip (cards in a 3-column grid, 1 column on mobile).
- **State page**: breadcrumb, state name large, one line summary of what was on the ballot, then one card per Race. Race card: office title + explainer link, status badge, neutral summary, candidate list with vote bars, then an accordion "Compare the major candidates" containing bios and an issue comparison table (six rows, one column per major candidate), sources as small superscript links.
- **Learn**: list of lessons in order; lesson page is a single prose column.
- **About**: prose column with the rules, sources and last-verified dates per race.

## Motion
Motion explains state changes; it never delays reading. All of it is off under `prefers-reduced-motion: reduce` (Lenis disabled, GSAP tweens set immediately to end state).

| Interaction | Property | Duration | Easing |
|---|---|---|---|
| Map state hover / focus | fill + 1px stroke to ink | 150ms | ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`) |
| Map tooltip | opacity + 4px translate | 120ms in, 80ms out | ease-out |
| Map reveal on load | states fade in, stagger 6ms, total under 600ms | 300ms each | `power2.out` |
| Card hover (linked) | translateY(-2px) + shadow | 200ms | ease-out |
| Button press | scale(0.97) | 100ms | ease-out |
| Accordion expand (candidate compare) | height + opacity | 250ms open, 200ms close | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Vote-share bar growth | scaleX 0 to value, origin left, on scroll into view, once | 700ms, stagger 80ms | `power3.out` |
| Race card entrance | opacity 0 to 1, y 12px to 0, on scroll | 400ms, stagger 60ms | `power2.out` |
| Hero headline (SplitText) | chars rise, once on load | 500ms, stagger 20ms | `power3.out` |

Rules: animate only transform and opacity (fills on SVG paths are cheap enough). Never animate from scale(0). Hover effects only on `(hover: hover)` devices. Lenis drives ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
