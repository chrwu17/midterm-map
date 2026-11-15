import Link from "next/link";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatDate } from "@/lib/races";
import type { HouseDistrict, HouseState } from "@/lib/house";
import { PartyTag } from "./party-tag";
import { SourceLink } from "./source-link";

const STATUS_NOTE: Record<HouseDistrict["status"], string | null> = {
  called: null,
  uncalled: "No winner has been projected yet.",
  runoff: "No one won a majority, so the top candidates face a second election.",
};

function districtTitle(d: HouseDistrict) {
  return d.district === "AL" ? "At-large district" : `District ${d.district}`;
}

function DistrictCard({ d }: { d: HouseDistrict }) {
  const note = STATUS_NOTE[d.status];
  return (
    <li className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{districtTitle(d)}</h3>
        {d.status !== "called" && (
          <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide">
            {d.status === "runoff" ? "Runoff" : "Uncalled"}
          </span>
        )}
      </div>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      <ul className="mt-3 space-y-2 text-sm" aria-label={`${districtTitle(d)} candidates and results`}>
        {d.candidates.map((c) => {
          const won = d.status === "called" && d.winnerId === c.id;
          return (
            <li key={c.id} className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={won ? "inline-flex items-center gap-1 font-semibold" : ""}>
                  {won && <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />}
                  {c.name}
                  {won && <span className="sr-only"> (projected winner)</span>}
                </span>
                <PartyTag party={c.party} label={c.partyLabel} />
                {c.incumbent && <span className="text-xs text-muted-foreground">Incumbent</span>}
              </span>
              <span className={`shrink-0 tabular-nums ${c.voteShare == null ? "text-muted-foreground" : ""}`}>
                {c.voteShare == null ? "Not reported" : `${c.voteShare.toFixed(1)}%`}
              </span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function HouseSection({ house, explainer }: { house: HouseState; explainer?: string }) {
  const n = house.districts.length;
  if (n === 0) return null;
  const sources = [...new Set(house.districts.flatMap((d) => d.sources))].filter((s) => !/\/2026_United_States_House_of_Representatives_elections$/.test(s));
  const verified = house.districts.map((d) => d.lastVerified).filter(Boolean).sort().pop();
  const open = house.districts.filter((d) => d.status !== "called").length;
  const list = (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={`${house.stateName} U.S. House districts`}>
      {house.districts.map((d) => <DistrictCard key={d.id} d={d} />)}
    </ol>
  );
  return (
    <article data-reveal className="rounded-xl border border-border bg-card p-5 sm:p-7" aria-labelledby="house-heading">
      <header>
        <h2 id="house-heading" className="text-2xl font-semibold">U.S. House</h2>
        {explainer && (
          <Link href={explainer} className="text-sm text-primary underline">
            What does a representative do?
          </Link>
        )}
      </header>
      <p className="mt-4 max-w-[65ch] leading-relaxed text-pretty">
        {n === 1
          ? `${house.stateName} has one U.S. House district, so the whole state voted in a single race.`
          : `${house.stateName} elects ${n} members of the U.S. House, one for each district. Each district had its own race.`}
        {open > 0 && ` ${open === 1 ? "One race has" : `${open} races have`} no projected winner yet.`}
      </p>
      <p className="mt-2 max-w-[65ch] text-sm text-muted-foreground">
        These are results only. We did not research House candidates&apos; positions.
      </p>
      {n === 1 ? (
        <div className="mt-6">{list}</div>
      ) : (
        <Accordion className="mt-5 border-t border-border">
          <AccordionItem value="districts">
            <AccordionTrigger className="text-base font-semibold">See all {n} districts</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">{list}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <div className="mt-5 space-y-1 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <p>
          These results are unofficial until {house.stateName} certifies them.
          {open > 0 && " Shares can change as counting continues."} Districts follow the lines used in 2026.
        </p>
        <p>
          {verified ? <>Last verified {formatDate(verified)}</> : "Verification date not recorded"} · Results:
          {sources.map((s) => <SourceLink key={s} href={s} />)}
        </p>
      </div>
    </article>
  );
}
