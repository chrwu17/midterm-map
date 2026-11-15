import Link from "next/link";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ISSUES, formatDate, websiteLabel, type Race } from "@/lib/races";
import { raceLabel } from "@/lib/map-data";
import { PartyTag } from "./party-tag";
import { SourceLink } from "./source-link";
import { Glossed } from "./term";
import { gloss } from "@/lib/glossary";

const STATUS: Record<Race["status"], { label: string; note: string }> = {
  called: { label: "Called", note: "Major news outlets have projected a winner." },
  uncalled: { label: "Uncalled", note: "Votes are still being counted, or the result is too close to call." },
  runoff: { label: "Runoff", note: "No one won a majority, so the top candidates face a second election." },
};

export function RaceCard({ race, explainer, seen = new Set() }: { race: Race; explainer?: string; seen?: Set<string> }) {
  const status = STATUS[race.status];
  // Glossary popovers on first use, in reading order. Candidate position sentences are never glossed.
  const title = gloss(raceLabel(race.office, race.special), seen);
  const statusLabel = gloss(status.label, seen);
  const summary = race.summary ? gloss(race.summary, seen) : null;
  const note = gloss(status.note, seen);
  const incumbentLabel = gloss("Incumbent", seen);
  const majors = race.candidates.filter((c) => c.major);
  const officeName = race.office === "senate" ? "senator" : "governor";
  // Comparison only shows candidates with at least one sourced position, and issues at least one of them spoke to.
  const withPositions = majors.filter((c) => c.positions.length > 0);
  const withoutPositions = majors.filter((c) => c.positions.length === 0);
  const shownIssues = ISSUES.filter((issue) => withPositions.some((c) => c.positions.some((p) => p.issue === issue.key)));
  const missingIssues = ISSUES.filter((issue) => !shownIssues.includes(issue));
  return (
    <article data-reveal className="rounded-xl border border-border bg-card p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold"><Glossed segments={title} /></h2>
          {explainer && (
            <Link href={explainer} className="text-sm text-primary underline">
              What does a {officeName} do?
            </Link>
          )}
        </div>
        <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <Glossed segments={statusLabel} />
        </span>
      </header>
      {summary && <p className="mt-4 max-w-[65ch] leading-relaxed text-pretty"><Glossed segments={summary} /></p>}
      <p className="mt-2 max-w-[65ch] text-sm text-muted-foreground"><Glossed segments={note} /></p>

      <ul className="mt-6 space-y-4" aria-label="Candidates and results">
        {race.candidates.map((c) => {
          const won = race.status === "called" && race.winnerId === c.id;
          const hasShare = c.voteShare != null;
          return (
            <li key={c.id}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={won ? "inline-flex items-center gap-1 font-semibold" : ""}>
                    {won && <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />}
                    {c.name}
                    {won && <span className="sr-only"> (projected winner)</span>}
                  </span>
                  <PartyTag party={c.party} label={c.partyLabel} />
                  {c.incumbent && <span className="text-xs text-muted-foreground"><Glossed segments={incumbentLabel} /></span>}
                  {won && <span className="text-xs font-semibold text-primary">Projected winner</span>}
                </div>
                <span className={`shrink-0 text-sm tabular-nums ${hasShare ? "" : "text-muted-foreground"}`}>
                  {hasShare ? `${c.voteShare!.toFixed(1)}%` : "Not reported"}
                </span>
              </div>
              {hasShare && (
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                  <div
                    data-bar
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, c.voteShare!))}%`, background: "var(--bar)", opacity: won ? 1 : 0.55 }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 space-y-1 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <p>
          These results are unofficial until {race.stateName} certifies them.
          {race.status !== "called" && " Shares can change as counting continues."}
        </p>
        <p>
          {race.lastVerified ? <>Last verified {formatDate(race.lastVerified)}</> : "Verification date not recorded"}
          {race.crossChecked && <> · Cross-checked against a second source</>}
          {race.sources.length > 0 && (
            <>
              {" "}· Results:
              {race.sources.map((s) => <SourceLink key={s} href={s} />)}
            </>
          )}
        </p>
      </div>

      {majors.length > 0 && (
        <Accordion className="mt-5 border-t border-border">
          <AccordionItem value="compare">
            <AccordionTrigger className="text-base font-semibold">Compare the major candidates</AccordionTrigger>
            <AccordionContent>
              <div className={`grid gap-x-8 gap-y-6 pt-2 sm:grid-cols-2 ${majors.length === 3 ? "lg:grid-cols-3" : ""}`}>
                {majors.map((c) => (
                  <section key={c.id} id={c.id} className="border-t border-border pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{c.name}</h3>
                      <PartyTag party={c.party} label={c.partyLabel} />
                    </div>
                    {c.bio ? (
                      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed">
                        {c.bio}
                        {c.sources.slice(0, 3).map((s) => <SourceLink key={s} href={s} website={c.website} />)}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">We haven&apos;t finished a sourced bio for this candidate yet.</p>
                    )}
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary underline">
                        {websiteLabel(c.website)}
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
                  </section>
                ))}
              </div>
              <h3 className="mt-8 text-lg font-semibold">Where they stand</h3>
              {withPositions.length > 0 && (
                <p className="mt-1 max-w-[65ch] text-sm text-muted-foreground">
                  In their own words, on the same six issues.
                  {shownIssues.some((issue) => withPositions.some((c) => !c.positions.some((p) => p.issue === issue.key))) &&
                    " A dash means we found no clear public statement yet."}
                </p>
              )}
              {withPositions.length > 0 && (
                <>
                  {/* Phones: one issue at a time, candidates stacked. Wider screens: side-by-side table. */}
                  <dl className="mt-4 space-y-5 text-sm sm:hidden">
                    {shownIssues.map((issue) => (
                      <div key={issue.key} className="border-t border-border pt-3">
                        <dt className="font-semibold">{issue.label}</dt>
                        {withPositions.map((c) => {
                          const p = c.positions.find((x) => x.issue === issue.key);
                          return (
                            <dd key={c.id} className="mt-2 leading-relaxed">
                              <span className="font-medium">{c.name}:</span>{" "}
                              {p ? <>{p.summary}<SourceLink href={p.source} website={c.website} /></> : <NotFound />}
                            </dd>
                          );
                        })}
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <caption className="sr-only">Where the major candidates stand on the issues</caption>
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th scope="col" className="w-36 py-2 pr-4 font-semibold">Issue</th>
                          {withPositions.map((c) => <th scope="col" key={c.id} className="py-2 pr-3 font-semibold">{c.name}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {shownIssues.map((issue) => (
                          <tr key={issue.key} className="border-b border-border align-top">
                            <th scope="row" className="py-3 pr-3 text-left font-medium">{issue.label}</th>
                            {withPositions.map((c) => {
                              const p = c.positions.find((x) => x.issue === issue.key);
                              return (
                                <td key={c.id} className="py-3 pr-3 leading-relaxed">
                                  {p ? <>{p.summary}<SourceLink href={p.source} website={c.website} /></> : <NotFound />}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {(withoutPositions.length > 0 || (withPositions.length > 0 && missingIssues.length > 0)) && (
                <ul className="mt-4 max-w-[65ch] space-y-1 text-sm text-muted-foreground">
                  {withoutPositions.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium text-foreground">{c.name}:</span> We found no clear public statements from this
                      candidate on these issues.
                    </li>
                  ))}
                  {withPositions.length > 0 && missingIssues.length > 0 && (
                    <li>
                      No clear statement found from {withPositions.length > 1 ? "any candidate" : withPositions[0].name} on{" "}
                      {missingIssues.map((i) => i.label.toLowerCase()).join(", ")}.
                    </li>
                  )}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </article>
  );
}

function NotFound() {
  return (
    <span className="text-muted-foreground/70">
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not found</span>
    </span>
  );
}
