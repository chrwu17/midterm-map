import fs from "node:fs";
import path from "node:path";

export interface HouseCandidate {
  id: string;
  name: string;
  party: string;
  partyLabel?: string;
  incumbent: boolean;
  voteShare: number | null;
}

export interface HouseDistrict {
  id: string;
  district: string; // "1", "2", ... or "AL" for an at-large state
  status: "called" | "uncalled" | "runoff";
  winnerId: string | null;
  candidates: HouseCandidate[];
  sources: string[];
  lastVerified: string;
}

export interface HouseState {
  state: string;
  stateName: string;
  districts: HouseDistrict[];
}

const DATA_DIR = process.env.HOUSE_DIR ?? path.join(process.cwd(), "..", "data", "house");

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);

function parseCandidate(c: unknown): HouseCandidate | null {
  if (!c || typeof c !== "object") return null;
  const o = c as Record<string, unknown>;
  const name = str(o.name);
  if (!name) return null;
  return {
    id: str(o.id) ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    party: str(o.party) ?? "Other",
    partyLabel: str(o.partyLabel) ?? undefined,
    incumbent: o.incumbent === true,
    voteShare: typeof o.voteShare === "number" && Number.isFinite(o.voteShare) ? o.voteShare : null,
  };
}

function parseDistrict(d: unknown): HouseDistrict | null {
  if (!d || typeof d !== "object") return null;
  const o = d as Record<string, unknown>;
  const id = str(o.id);
  if (!id || !Array.isArray(o.candidates)) return null;
  const status = o.status === "called" || o.status === "runoff" ? o.status : "uncalled";
  return {
    id,
    district: str(o.district) ?? id.split("-")[1] ?? id,
    status,
    winnerId: status === "called" ? str(o.winnerId) : null,
    candidates: o.candidates.map(parseCandidate).filter((c): c is HouseCandidate => c !== null),
    sources: Array.isArray(o.sources) ? o.sources.filter((s): s is string => typeof s === "string") : [],
    lastVerified: str(o.lastVerified) ?? "",
  };
}

let cache: Map<string, HouseState> | null = null;

function load(): Map<string, HouseState> {
  if (cache) return cache;
  const out = new Map<string, HouseState>();
  let files: string[] = [];
  try {
    files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    console.warn(`[house] no data directory at ${DATA_DIR}`);
  }
  for (const f of files.sort()) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")) as Record<string, unknown>;
      const state = str(raw.state)?.toUpperCase();
      if (!state || !Array.isArray(raw.districts)) continue;
      const districts = raw.districts.map(parseDistrict).filter((d): d is HouseDistrict => d !== null);
      districts.sort((a, b) => (Number(a.district) || 0) - (Number(b.district) || 0));
      out.set(state, { state, stateName: str(raw.stateName) ?? state, districts });
    } catch (e) {
      console.warn(`[house] skipping malformed ${f}: ${(e as Error).message}`);
    }
  }
  cache = out;
  return out;
}

export function getHouseForState(code: string): HouseState | undefined {
  return load().get(code.toUpperCase());
}
