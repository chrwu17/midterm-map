/** Human-readable publisher for a source URL, so readers can tell a candidate's own page from news or an encyclopedia. */

export type SourceKind = "candidate" | "news" | "reference" | "official" | "other";

const KNOWN: Record<string, { name: string; kind: SourceKind }> = {
  "wikipedia.org": { name: "Wikipedia", kind: "reference" },
  "ontheissues.org": { name: "OnTheIssues", kind: "reference" },
  "ballotpedia.org": { name: "Ballotpedia", kind: "reference" },
  "multistate.us": { name: "MultiState", kind: "reference" },
  "political.org": { name: "Political.org", kind: "reference" },
  "guides.vote": { name: "Guides.Vote", kind: "reference" },
  "apnews.com": { name: "AP", kind: "news" },
  "texastribune.org": { name: "Texas Tribune", kind: "news" },
  "ajc.com": { name: "AJC", kind: "news" },
  "calmatters.org": { name: "CalMatters", kind: "news" },
  "nytimes.com": { name: "New York Times", kind: "news" },
  "washingtonpost.com": { name: "Washington Post", kind: "news" },
  "politico.com": { name: "Politico", kind: "news" },
  "thehill.com": { name: "The Hill", kind: "news" },
  "npr.org": { name: "NPR", kind: "news" },
  "pbs.org": { name: "PBS", kind: "news" },
  "opb.org": { name: "OPB", kind: "news" },
  "cnn.com": { name: "CNN", kind: "news" },
  "nbcnews.com": { name: "NBC News", kind: "news" },
  "cbsnews.com": { name: "CBS News", kind: "news" },
  "foxnews.com": { name: "Fox News", kind: "news" },
  "reuters.com": { name: "Reuters", kind: "news" },
  "axios.com": { name: "Axios", kind: "news" },
  "vermontpublic.org": { name: "Vermont Public", kind: "news" },
  "thenevadaindependent.com": { name: "Nevada Independent", kind: "news" },
  "montanafreepress.org": { name: "Montana Free Press", kind: "news" },
  "capitolnewsillinois.com": { name: "Capitol News Illinois", kind: "news" },
  "mprnews.org": { name: "MPR News", kind: "news" },
  "michiganpublic.org": { name: "Michigan Public", kind: "news" },
  "nhpr.org": { name: "NHPR", kind: "news" },
  "ctpublic.org": { name: "CT Public", kind: "news" },
};

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Matches a host or any subdomain of it ("en.wikipedia.org" -> "wikipedia.org"). */
function lookup(host: string) {
  const parts = host.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const hit = KNOWN[parts.slice(i).join(".")];
    if (hit) return hit;
  }
  return null;
}

export function sourcePublisher(url: string, candidateWebsite?: string | null): { name: string; kind: SourceKind; host: string } | null {
  const host = hostOf(url);
  if (!host) return null;
  const site = candidateWebsite ? hostOf(candidateWebsite) : null;
  if (site && (host === site || host.endsWith(`.${site}`))) {
    return { name: /\.gov$/.test(host) ? "Official site" : "Campaign site", kind: "candidate", host };
  }
  const known = lookup(host);
  if (known) return { ...known, host };
  if (/\.senate\.gov$/.test(host)) return { name: "Senate office", kind: "official", host };
  if (/\.house\.gov$/.test(host)) return { name: "House office", kind: "official", host };
  if (/\.gov$/.test(host)) return { name: host, kind: "official", host };
  return { name: host, kind: "other", host };
}
