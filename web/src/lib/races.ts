import fs from "node:fs";
import path from "node:path";

export type IssueKey = "economy" | "healthcare" | "immigration" | "education" | "climate" | "abortion";

export const ISSUES: { key: IssueKey; label: string }[] = [
  { key: "economy", label: "Economy" },
  { key: "healthcare", label: "Health care" },
  { key: "immigration", label: "Immigration" },
  { key: "education", label: "Education" },
  { key: "climate", label: "Climate & energy" },
  { key: "abortion", label: "Abortion" },
];

export interface Position {
  issue: IssueKey;
  summary: string;
  source: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyLabel?: string;
  major: boolean;
  incumbent: boolean;
  voteShare: number | null;
  bio: string | null;
  website: string | null;
  positions: Position[];
  sources: string[];
}

export interface Race {
  id: string;
  state: string;
  stateName: string;
  office: "senate" | "governor";
  special: boolean;
  electionDate: string;
  status: "called" | "uncalled" | "runoff";
  winnerId: string | null;
  summary: string;
  candidates: Candidate[];
  sources: string[];
  lastVerified: string;
  crossChecked: boolean;
  factCheckNote: string | null;
}

const DATA_DIR = process.env.RACES_DIR ?? path.join(process.cwd(), "..", "data", "races");
const ISSUE_KEYS = new Set(ISSUES.map((i) => i.key));

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);
const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

function parseCandidate(c: unknown): Candidate | null {
  if (!c || typeof c !== "object") return null;
  const o = c as Record<string, unknown>;
  const name = str(o.name);
  if (!name) return null;
  const positions = Array.isArray(o.positions)
    ? o.positions.flatMap((p): Position[] => {
        if (!p || typeof p !== "object") return [];
        const q = p as Record<string, unknown>;
        const issue = str(q.issue) as IssueKey | null;
        const summary = str(q.summary);
        if (!issue || !ISSUE_KEYS.has(issue) || !summary) return [];
        return [{ issue, summary, source: str(q.source) ?? "" }];
      })
    : [];
  return {
    id: str(o.id) ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    party: str(o.party) ?? "Other",
    partyLabel: str(o.partyLabel) ?? undefined,
    major: o.major === true,
    incumbent: o.incumbent === true,
    voteShare: typeof o.voteShare === "number" && Number.isFinite(o.voteShare) ? o.voteShare : null,
    bio: str(o.bio),
    website: str(o.website),
    positions,
    sources: strArr(o.sources),
  };
}

function parseRace(raw: unknown, file: string): Race | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const state = str(o.state)?.toUpperCase();
  const office = o.office === "senate" || o.office === "governor" ? o.office : null;
  if (!state || !office || !Array.isArray(o.candidates)) {
    console.warn(`[races] skipping ${file}: missing state, office or candidates`);
    return null;
  }
  const status = o.status === "called" || o.status === "runoff" ? o.status : "uncalled";
  const candidates = o.candidates.map(parseCandidate).filter((c): c is Candidate => c !== null);
  const winnerId = status === "called" ? str(o.winnerId) : null;
  return {
    id: str(o.id) ?? path.basename(file, ".json"),
    state,
    stateName: str(o.stateName) ?? state,
    office,
    special: o.special === true,
    electionDate: str(o.electionDate) ?? "2026-11-03",
    status,
    winnerId,
    summary: str(o.summary) ?? "",
    candidates,
    sources: strArr(o.sources),
    lastVerified: str(o.lastVerified) ?? "",
    crossChecked: o.crossChecked === true,
    factCheckNote: str(o.factCheckNote),
  };
}

let cache: Race[] | null = null;

export function getAllRaces(): Race[] {
  if (cache) return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    console.warn(`[races] no data directory at ${DATA_DIR}`);
  }
  const races: Race[] = [];
  for (const f of files.sort()) {
    try {
      const race = parseRace(JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")), f);
      if (race) races.push(race);
    } catch (e) {
      console.warn(`[races] skipping malformed ${f}: ${(e as Error).message}`);
    }
  }
  cache = races;
  return races;
}

export function getRacesForState(code: string): Race[] {
  return getAllRaces()
    .filter((r) => r.state === code.toUpperCase())
    .sort((a, b) => (a.office === b.office ? Number(a.special) - Number(b.special) : a.office === "senate" ? -1 : 1));
}

/** "2026-11-14" -> "Nov. 14, 2026" (falls back to the raw string). */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/** Official government pages (*.gov) vs campaign sites. */
export function websiteLabel(url: string): string {
  try {
    return /\.gov$/i.test(new URL(url).hostname) ? "Official site" : "Campaign site";
  } catch {
    return "Website";
  }
}
