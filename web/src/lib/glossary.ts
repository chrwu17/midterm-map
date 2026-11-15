import fs from "node:fs";
import path from "node:path";

/**
 * Build-time glossary. Definitions come only from content/lessons/political-terms.md
 * (lines shaped like `- **Term:** Definition.`), so the lesson stays the single source of truth.
 */
export interface GlossaryTerm {
  term: string;
  /** First sentence of the lesson's definition, with Markdown links reduced to their text. */
  definition: string;
  pattern: RegExp;
}

export const GLOSSARY_HREF = "/learn/political-terms/";
const FILE = path.join(process.cwd(), "..", "content", "lessons", "political-terms.md");

// Word forms a reader will meet in race text that a plain "term or term+s" match would miss.
const FORMS: Record<string, string> = {
  primary: "primar(?:y|ies)",
  "ranked-choice voting": "ranked[- ]choice(?: voting)?",
  "open seat": "open seats?",
  "special election": "special elections?",
  runoff: "run-?offs?",
  incumbent: "incumbents?",
  called: "called",
};

function firstSentence(s: string) {
  const plain = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  const m = plain.match(/^.+?[.!?](?=\s|$)/);
  return m ? m[0] : plain;
}

let cache: GlossaryTerm[] | null = null;

export function getGlossary(): GlossaryTerm[] {
  if (cache) return cache;
  let text = "";
  try {
    text = fs.readFileSync(FILE, "utf8");
  } catch {
    return (cache = []);
  }
  const out: GlossaryTerm[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s+\*\*([^*:]+):\*\*\s+(.+)$/);
    if (!m) continue;
    const term = m[1].trim();
    const key = term.toLowerCase();
    const src = FORMS[key] ?? `${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?`;
    out.push({ term, definition: firstSentence(m[2]), pattern: new RegExp(`\\b${src}\\b`, "i") });
  }
  // Longer terms first so "special election" wins over a shorter overlapping term.
  return (cache = out.sort((a, b) => b.term.length - a.term.length));
}

export type GlossSegment = string | { text: string; term: string; definition: string };

/**
 * Split text into plain strings and glossary hits, marking only the first use of each term.
 * `seen` is shared across one page so a term is explained once, where the reader first meets it.
 */
export function gloss(text: string, seen: Set<string>): GlossSegment[] {
  const terms = getGlossary();
  const hits: { start: number; end: number; t: GlossaryTerm }[] = [];
  for (const t of terms) {
    if (seen.has(t.term)) continue;
    const m = t.pattern.exec(text);
    if (!m) continue;
    const start = m.index;
    const end = start + m[0].length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, t });
    seen.add(t.term);
  }
  hits.sort((a, b) => a.start - b.start);
  const out: GlossSegment[] = [];
  let i = 0;
  for (const h of hits) {
    if (h.start > i) out.push(text.slice(i, h.start));
    out.push({ text: text.slice(h.start, h.end), term: h.t.term, definition: h.t.definition });
    i = h.end;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}
