#!/usr/bin/env node
// Rebuilds data/house-geometry/*.json from Census files. Not part of the site build. See data/house/GEOMETRY.md.
// Usage: MAPSHAPER=/path/to/mapshaper node scripts/build-house-geometry.mjs <dir>
//   <dir>/raw26/<FIPS>/tl_2026_<FIPS>_cd120.shp   TIGER/Line 2026 120th Congress districts
//   <dir>/cb/state/cb_2025_us_state_500k.shp      cartographic boundary states (shoreline used for clipping)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir = path.resolve(process.argv[2] ?? ".");
const MAPSHAPER = process.env.MAPSHAPER ?? "mapshaper";
const OUT = path.join(import.meta.dirname, "..", "data", "house-geometry");
const FIPS = "AL01 AK02 AZ04 AR05 CA06 CO08 CT09 DE10 FL12 GA13 HI15 ID16 IL17 IN18 IA19 KS20 KY21 LA22 ME23 MD24 MA25 MI26 MN27 MS28 MO29 MT30 NE31 NV32 NH33 NJ34 NM35 NY36 NC37 ND38 OH39 OK40 OR41 PA42 RI44 SC45 SD46 TN47 TX48 UT49 VT50 VA51 WA53 WV54 WI55 WY56"
  .split(" ").map((s) => [s.slice(0, 2), s.slice(2)]);

const W = 340, H = 400;        // view box limits: about one phone-width pixel per unit
const MIN_R = 6.6;             // smallest clear radius that fits a two-digit label
const MAX_LEVEL = 3;           // main map, close-up, close-up of a close-up
const rad = Math.PI / 180;

const run = (args, input) => execFileSync(MAPSHAPER, args, { input, maxBuffer: 1 << 30, stdio: ["pipe", "pipe", "ignore"] });

/** Lambert azimuthal equal-area around a center, y down. */
function projector([lon0, lat0]) {
  const s0 = Math.sin(lat0 * rad), c0 = Math.cos(lat0 * rad);
  return ([lon, lat]) => {
    const dl = (lon - lon0) * rad, s = Math.sin(lat * rad), c = Math.cos(lat * rad);
    const k = Math.sqrt(2 / (1 + s0 * s + c0 * c * Math.cos(dl)));
    return [6371000 * k * c * Math.sin(dl), -6371000 * k * (c0 * s - s0 * c * Math.cos(dl))];
  };
}
const polys = (g) => (!g ? [] : g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : g.type === "GeometryCollection" ? g.geometries.flatMap(polys) : []);
const bbox = (pts) => pts.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [1e12, 1e12, -1e12, -1e12]);

function signedDistance(x, y, rings) {
  let inside = false, d = Infinity;
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [ax, ay] = r[i], [bx, by] = r[j];
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
    const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    d = Math.min(d, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return inside ? d : -d;
}
/** Center and radius of (about) the largest circle inside any part of the shape. */
function labelSpot(parts) {
  let best = { x: 0, y: 0, r: -1 };
  for (const rings of parts) {
    const [x0, y0, x1, y1] = bbox(rings[0]);
    if (Math.min(x1 - x0, y1 - y0) / 2 <= best.r) continue;
    let cell = Math.max(x1 - x0, y1 - y0) / 30, spot = { x: 0, y: 0, r: -1 };
    for (let x = x0 + cell / 2; x < x1; x += cell) for (let y = y0 + cell / 2; y < y1; y += cell) {
      const r = signedDistance(x, y, rings); if (r > spot.r) spot = { x, y, r };
    }
    for (let n = 0; n < 4; n++, cell /= 3) for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
      const x = spot.x + (i * cell) / 3, y = spot.y + (j * cell) / 3, r = signedDistance(x, y, rings); if (r > spot.r) spot = { x, y, r };
    }
    if (spot.r > best.r) best = spot;
  }
  return best;
}

/** One drawing of the state (or of part of it) in meters, simplified for its own scale. */
function makeView(gj, box, scaleFrom) {
  const s0 = box ? Math.min(W / (box[2] - box[0]), H / (box[3] - box[1])) : scaleFrom;
  const args = ["-i", "-", "name=d", ...(box ? ["-clip", `bbox=${box.join(",")}`] : []),
    "-simplify", `interval=${0.7 / s0}`, "planar", "keep-shapes", "-o", "-", "format=geojson", "precision=1"];
  const out = JSON.parse(run(args, JSON.stringify(gj)));
  const feats = out.features.filter((f) => f.geometry);
  const all = box ?? bbox(feats.flatMap((f) => polys(f.geometry).flatMap((p) => p[0])));
  const s = Math.min(W / (all[2] - all[0]), H / (all[3] - all[1]));
  const r1 = (n) => Math.round(n * 10) / 10;
  const to = ([x, y]) => [r1((x - all[0]) * s), r1((y - all[1]) * s)];
  const districts = feats.map((f) => {
    const parts = polys(f.geometry).map((p) => p.map((ring) => ring.map(to)));
    let d = "";
    const keep = parts.filter((p) => { const b = bbox(p[0]); return Math.max(b[2] - b[0], b[3] - b[1]) > 0.8; });
    for (const ring of (keep.length ? keep : parts).flat()) {
      let px, py; d += "M";
      ring.slice(0, -1).forEach(([x, y], i) => {
        if (i && x === px && y === py) return;
        d += i ? `l${r1(x - px)},${r1(y - py)}` : `${x},${y}`; [px, py] = [x, y];
      });
      d += "z";
    }
    const spot = labelSpot(parts);
    return { district: f.properties.district, d, x: r1(spot.x), y: r1(spot.y), r: r1(spot.r) };
  }).filter((d) => !box || d.r > 0.3)
    .sort((a, b) => (+a.district || 0) - (+b.district || 0));
  return { width: r1((all[2] - all[0]) * s), height: r1((all[3] - all[1]) * s), all, s, districts };
}

for (const [code, fips] of FIPS) {
  const src = path.join(dir, "raw26", fips, `tl_2026_${fips}_cd120.shp`);
  const land = path.join(dir, "cb", "state", "cb_2025_us_state_500k.shp");
  const tmp = fs.mkdtempSync(path.join(dir, "tmp-"));
  const landFile = path.join(tmp, "land.geojson");
  // Hawaii's map stops at Niihau: the uninhabited northwestern islands would shrink everything else.
  run(["-i", land, "-filter", `STUSPS=="${code}"`, ...(code === "HI" ? ["-clip", "bbox=-161,18,-154,23"] : []), "-o", landFile]);
  const raw = JSON.parse(run(["-i", src, "-filter", 'CD120FP!="ZZ"', "-clip", landFile, "-each", 'district = +CD120FP ? String(+CD120FP) : "AL"', "-filter-fields", "district", "-o", "-", "format=geojson"]));
  fs.rmSync(tmp, { recursive: true });
  if (code === "AK") for (const f of raw.features) for (const p of polys(f.geometry)) for (const r of p) for (const q of r) if (q[0] > 0) q[0] -= 360;
  const b = bbox(raw.features.flatMap((f) => polys(f.geometry).flatMap((p) => p[0])));
  const proj = projector([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]);
  for (const f of raw.features) f.geometry = { type: "MultiPolygon", coordinates: polys(f.geometry).map((p) => p.map((r) => r.map(proj))) };
  const exact = new Map(raw.features.map((f) => [f.properties.district, bbox(polys(f.geometry).flatMap((p) => p[0]))]));

  const full = bbox([...exact.values()].flatMap((e) => [[e[0], e[1]], [e[2], e[3]]]));
  const first = makeView(raw, null, Math.min(W / (full[2] - full[0]), H / (full[3] - full[1])));
  const views = [{ ...first, letter: null, parent: null, box: null, level: 1 }];
  for (let vi = 0; vi < views.length; vi++) {
    const v = views[vi];
    if (v.level >= MAX_LEVEL) continue;
    const covered = new Set(views.filter((x) => x !== v).flatMap((x) => x.districts.filter((d) => d.r >= MIN_R && exact.get(d.district) && x.box && inside(exact.get(d.district), x.all)).map((d) => d.district)));
    const small = v.districts.filter((d) => d.r < MIN_R && d.district !== "AL" && !covered.has(d.district) && (!v.box || v.districts.length) );
    const mine = small.filter((d) => v.box === null || inside(exact.get(d.district), v.all, 0.05));
    let clusters = mine.map((d) => exact.get(d.district));
    const size = (c) => Math.max(c[2] - c[0], c[3] - c[1]);
    const limit = 0.3 * Math.max(v.all[2] - v.all[0], v.all[3] - v.all[1]);
    for (;;) {
      let pick = null;
      for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) {
        const u = [Math.min(clusters[i][0], clusters[j][0]), Math.min(clusters[i][1], clusters[j][1]), Math.max(clusters[i][2], clusters[j][2]), Math.max(clusters[i][3], clusters[j][3])];
        if (size(u) <= limit && (!pick || size(u) < pick.n)) pick = { i, j, u, n: size(u) };
      }
      if (!pick) break;
      clusters = clusters.filter((_, k) => k !== pick.i && k !== pick.j).concat([pick.u]);
    }
    clusters.sort((a, c) => a[1] - c[1]);
    for (const c of clusters) {
      const cx = (c[0] + c[2]) / 2, cy = (c[1] + c[3]) / 2;
      // Landscape-ish frames, 8% margin.
      const w = Math.max((c[2] - c[0]) * 1.08, (c[3] - c[1]) * 1.08 * 0.95), h = Math.max((c[3] - c[1]) * 1.08, w * 0.75);
      const nb = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
      const nv = makeView(raw, nb);
      if (nv.s < v.s * 1.5) continue; // not worth a separate drawing
      const rr = (n) => Math.round(n * 10) / 10;
      views.push({ ...nv, letter: String.fromCharCode(64 + views.length), parent: vi, level: v.level + 1,
        box: [(nb[0] - v.all[0]) * v.s, (nb[1] - v.all[1]) * v.s, w * v.s, h * v.s].map(rr) });
    }
  }
  const unlabeled = [...exact.keys()].filter((k) => k !== "AL" && !views.some((v) => v.districts.some((d) => d.district === k && d.r >= MIN_R)));
  const json = { state: code, source: "U.S. Census Bureau, TIGER/Line 2026, 120th Congress; shoreline from 2025 cartographic boundary file",
    views: views.map((v) => ({ letter: v.letter, parent: v.parent === null ? null : views[v.parent].letter, box: v.box, width: v.width, height: v.height,
      districts: v.districts.map((d) => ({ district: d.district, d: d.d, x: d.x, y: d.y, label: d.district === "AL" || d.r >= MIN_R })) })) };
  fs.writeFileSync(path.join(OUT, `${code}.json`), JSON.stringify(json) + "\n");
  console.log(code, exact.size, "districts", views.length, "views", Math.round(JSON.stringify(json).length / 1024) + "KB", unlabeled.length ? "unlabeled: " + unlabeled : "");
}

function inside(e, a, slack = 0.01) {
  const sx = (a[2] - a[0]) * slack, sy = (a[3] - a[1]) * slack;
  return e[0] >= a[0] - sx && e[1] >= a[1] - sy && e[2] <= a[2] + sx && e[3] <= a[3] + sy;
}
