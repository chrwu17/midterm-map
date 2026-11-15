import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STATES, STATE_BY_CODE } from "@/lib/states";
import { getRacesForState } from "@/lib/races";
import { getLessons } from "@/lib/lessons";
import { pageMeta } from "@/lib/seo";
import { RaceCard } from "@/components/race-card";
import { Reveal } from "@/components/motion-provider";

export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ st: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ st: string }> }): Promise<Metadata> {
  const { st } = await params;
  const s = STATE_BY_CODE.get(st.toUpperCase());
  if (!s) return { title: "Midterm Map" };
  return pageMeta(
    `${s.name}: 2026 Senate and governor races | Midterm Map`,
    `Who ran and who won in ${s.name}'s 2026 U.S. Senate and governor races, and where the major candidates stand, in plain, nonpartisan language.`,
    `/state/${st.toLowerCase()}/`,
  );
}

function explainerHref(office: "senate" | "governor") {
  const re = office === "senate" ? /senat/i : /governor/i;
  const l = getLessons().find((x) => re.test(`${x.slug} ${x.title}`));
  return l ? `/learn/${l.slug}/` : "/learn/";
}

export default async function StatePage({ params }: { params: Promise<{ st: string }> }) {
  const { st } = await params;
  const state = STATE_BY_CODE.get(st.toUpperCase());
  if (!state) notFound();
  const races = getRacesForState(state.code);
  // One set per page, so each glossary term gets a popover only where it first appears.
  const seen = new Set<string>();
  const expected = [state.senate2026 && "a U.S. Senate race", state.governor2026 && "a governor race"].filter(Boolean);

  return (
    <div className="wrap py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/" className="underline">Map</Link> <span aria-hidden="true">/</span> {state.name}
      </nav>
      <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-tight">{state.name}</h1>
      <p className="mt-2 max-w-[60ch] text-lg text-muted-foreground">
        {expected.length
          ? `On November 3, 2026, ${state.name} had ${expected.join(" and ")}.`
          : `${state.name} had no U.S. Senate or governor race in 2026.`}
      </p>

      <Reveal className="mt-10 space-y-8">
        {races.map((r) => <RaceCard key={r.id} race={r} explainer={explainerHref(r.office)} seen={seen} />)}
        {(["senate", "governor"] as const)
          .filter((o) => (o === "senate" ? state.senate2026 : state.governor2026) && !races.some((r) => r.office === o))
          .map((o) => (
            <div key={o} data-reveal className="rounded-xl border border-dashed border-border bg-card p-7">
              <h2 className="text-2xl font-semibold">{o === "senate" ? "U.S. Senate" : "Governor"}</h2>
              <Link href={explainerHref(o)} className="text-sm text-primary underline">
                What does a {o === "senate" ? "senator" : "governor"} do?
              </Link>
              <p className="mt-4 font-semibold">Data coming soon</p>
              <p className="mt-1 max-w-[60ch] text-muted-foreground">
                We are still researching and checking this race&apos;s candidates and results. Until then, your state
                election office and <a className="underline" href="https://vote.gov">vote.gov</a> are good places to look.
              </p>
            </div>
          ))}
        {expected.length === 0 && races.length === 0 && (
          <div data-reveal className="rounded-xl border border-border bg-card p-7">
            <h2 className="text-xl font-semibold">No Senate or governor race in 2026</h2>
            <p className="mt-2 max-w-[60ch] text-muted-foreground">
              Every state still voted for its members of the U.S. House, and many had state and local races too. Those are not
              covered on this site yet.
            </p>
          </div>
        )}
      </Reveal>
      <p className="mt-10 text-sm">
        <Link href="/" className="underline">Back to the map</Link>
      </p>
    </div>
  );
}
