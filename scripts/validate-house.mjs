// Validates data/house/*.json. Usage: node scripts/validate-house.mjs [--quiet]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "house");
const quiet = process.argv.includes("--quiet");
const PARTIES = ["Democratic", "Republican", "Independent", "Libertarian", "Green", "Other"];
const STATUS = ["called", "uncalled", "runoff"];
const SEATS = { AL:7,AK:1,AZ:9,AR:4,CA:52,CO:8,CT:5,DE:1,FL:28,GA:14,HI:2,ID:2,IL:17,IN:9,IA:4,KS:4,KY:6,LA:6,ME:2,MD:8,MA:9,MI:13,MN:8,MS:4,MO:8,MT:2,NE:3,NV:4,NH:2,NJ:12,NM:3,NY:26,NC:14,ND:1,OH:15,OK:5,OR:6,PA:17,RI:2,SC:7,SD:1,TN:9,TX:38,UT:4,VT:1,VA:11,WA:10,WV:2,WI:8,WY:1 };
const errors = [];
const err = (m) => errors.push(m);
let total = 0;
const files = fs.readdirSync(dir).filter((f) => /^[A-Z]{2}\.json$/.test(f));
const seen = new Set();
for (const f of files) {
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch (e) { err(`${f}: invalid JSON (${e.message})`); continue; }
  const ab = f.slice(0, 2);
  seen.add(ab);
  if (j.state !== ab) err(`${f}: state field ${j.state}`);
  if (!j.stateName) err(`${f}: missing stateName`);
  if (j.electionDate !== "2026-11-03") err(`${f}: electionDate`);
  if (!Array.isArray(j.districts)) { err(`${f}: districts not an array`); continue; }
  if (SEATS[ab] !== j.districts.length) err(`${f}: ${j.districts.length} districts, expected ${SEATS[ab]}`);
  total += j.districts.length;
  const ids = new Set();
  for (const d of j.districts) {
    const w = `${f} ${d.id}`;
    for (const k of ["id", "district", "status", "candidates", "sources", "lastVerified"]) if (d[k] === undefined) err(`${w}: missing ${k}`);
    if (!("winnerId" in d)) err(`${w}: missing winnerId`);
    if (ids.has(d.id)) err(`${w}: duplicate district id`);
    ids.add(d.id);
    if (!STATUS.includes(d.status)) err(`${w}: bad status ${d.status}`);
    if (!Array.isArray(d.sources) || d.sources.length === 0 || d.sources.some((u) => !/^https?:\/\//.test(u))) err(`${w}: sources must be URLs`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.lastVerified || "")) err(`${w}: lastVerified`);
    if (!Array.isArray(d.candidates) || d.candidates.length === 0) { err(`${w}: no candidates`); continue; }
    const cid = new Set();
    let sum = 0, max = -1;
    for (const c of d.candidates) {
      if (!c.id || !c.name) err(`${w}: candidate missing id/name`);
      if (cid.has(c.id)) err(`${w}: duplicate candidate id ${c.id}`);
      cid.add(c.id);
      if (!PARTIES.includes(c.party)) err(`${w}: bad party ${c.party} (${c.name})`);
      if (c.party === "Other" && !c.partyLabel) err(`${w}: ${c.name} is Other without partyLabel`);
      if (typeof c.incumbent !== "boolean") err(`${w}: ${c.name} incumbent not boolean`);
      if (c.voteShare !== null && (typeof c.voteShare !== "number" || c.voteShare < 0 || c.voteShare > 100)) err(`${w}: ${c.name} bad voteShare`);
      if (/write-?in/i.test(c.name)) err(`${w}: write-in listed (${c.name})`);
      if (c.voteShare !== null) { sum += c.voteShare; max = Math.max(max, c.voteShare); }
    }
    if (sum > 100.5) err(`${w}: shares sum to ${sum.toFixed(2)}`);
    if (d.status === "called") {
      const win = d.candidates.find((c) => c.id === d.winnerId);
      if (!win) err(`${w}: winnerId ${d.winnerId} not in candidates`);
      else if (win.voteShare !== null && win.voteShare < max) err(`${w}: winner does not have the highest share`);
      if (d.candidates[0].id !== d.winnerId) err(`${w}: winner not listed first`);
    } else if (d.winnerId !== null) err(`${w}: winnerId must be null when ${d.status}`);
    const sh = d.candidates.map((c) => c.voteShare).filter((x) => x !== null);
    const start = d.status === "called" ? 1 : 0;
    const rest = d.candidates.slice(start).map((c) => c.voteShare).filter((x) => x !== null);
    for (let i = 1; i < rest.length; i++) if (rest[i] > rest[i - 1]) err(`${w}: candidates not sorted by share`);
  }
}
for (const ab of Object.keys(SEATS)) if (!seen.has(ab)) err(`missing file ${ab}.json`);
if (total !== 435) err(`total districts ${total}, expected 435`);
if (errors.length) { console.error(errors.join("\n")); console.error(`\n${errors.length} error(s)`); process.exit(1); }
if (!quiet) console.log(`OK: ${files.length} states, ${total} districts`);
