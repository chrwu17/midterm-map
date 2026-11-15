# Race data schema

One JSON file per Race: `data/races/<STATE>-<office>[-special].json`, e.g. `GA-senate.json`, `OH-senate-special.json`, `CA-governor.json`.

```ts
type IssueKey = "economy" | "healthcare" | "immigration" | "education" | "climate" | "abortion";

interface Race {
  id: string;                 // "GA-senate"
  state: string;              // "GA" (USPS code)
  stateName: string;          // "Georgia"
  office: "senate" | "governor";
  special: boolean;           // true for special elections (e.g. OH, FL Senate 2026)
  electionDate: "2026-11-03";
  status: "called" | "uncalled" | "runoff";
  winnerId: string | null;    // candidate id, null if uncalled
  summary: string;            // 1–2 neutral sentences: what the race was, e.g. open seat, incumbent running
  candidates: Candidate[];    // winner first, then by vote share desc
  sources: string[];          // URLs used for results
  lastVerified: string;       // ISO date you checked
}

interface Candidate {
  id: string;                 // kebab-case name, e.g. "jon-ossoff"
  name: string;
  party: "Democratic" | "Republican" | "Independent" | "Libertarian" | "Green" | "Other";
  partyLabel?: string;        // exact ballot label if party is "Other"
  major: boolean;             // true => full profile expected
  incumbent: boolean;
  voteShare: number | null;   // percent, e.g. 51.2; null if unknown
  bio: string | null;         // 2–3 neutral plain-language sentences (major only)
  website: string | null;
  positions: Position[];      // major only; may be partial; [] for minor
  sources: string[];          // URLs for bio facts
}

interface Position {
  issue: IssueKey;
  summary: string;            // ONE plain-language sentence, the candidate's OWN stated stance, no adjectives of judgment
  source: string;             // URL (campaign site, voting record, reputable news quote)
}
```

## Neutrality rules
- Describe what the candidate says or did, in their framing ("Says she will…", "Voted for…"). Never evaluate.
- Same six issues for everyone. Skip an issue rather than guess.
- Every bio fact and position needs a source URL.
- If a result is not certain, set `status: "uncalled"` and `winnerId: null`. Never guess a winner.
