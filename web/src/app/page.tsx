import { btn } from "@/lib/button-styles";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import { UsMap } from "@/components/us-map";
import { getStateShapes } from "@/lib/geo";
import { getMapStates } from "@/lib/map-data";
import { getLessons } from "@/lib/lessons";
import { LessonIcon } from "@/components/lesson-icon";
import { getAllHouse, getHouseMap } from "@/lib/house";
import { Reveal } from "@/components/motion-provider";

function takeaways(body: string): string[] {
  const after = body.split(/^## Key takeaways\s*$/m)[1] ?? "";
  return after
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, ""))
    .slice(0, 4);
}

export default function Home() {
  const shapes = getStateShapes();
  const states = getMapStates();
  const lessons = getLessons();
  const preview = lessons[0];
  const districts = getAllHouse().flatMap((h) => h.districts);
  const sample = getHouseMap("IN")?.[0]; // one whole-state drawing that needs no close-ups
  const points = preview ? takeaways(preview.body) : [];
  return (
    <>
      <section className="-mt-[var(--nav-h)] flex min-h-svh items-center pt-[var(--nav-h)] lg:h-svh">
        <div className="wrap grid gap-4 py-4 sm:gap-8 sm:py-10 lg:grid-cols-2 lg:items-start lg:gap-6 lg:py-0">
        <div className="hero-text">
          <SplitText
            tag="h1"
            text="Your guide to the 2026 Senate and governor races"
            className="max-w-[16ch] text-balance font-heading text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.05]"
            textAlign="left"
            splitType="words"
            trigger="load"
            delay={30}
            duration={0.4}
            ease="power3.out"
            from={{ opacity: 0, y: 12 }}
            to={{ opacity: 1, y: 0 }}
          />
          <p className="mt-3 max-w-[44ch] text-[15px] leading-snug sm:mt-5 sm:text-lg sm:leading-relaxed text-muted-foreground">
            Pick a state to see who ran on November 3, 2026, who won, and what each major candidate says about six issues. State
            pages also show U.S. House results. The site is nonpartisan and written for new voters.
          </p>
          <a href="#map" className={btn("primary", "md", "mt-4 sm:mt-7")}>
            Pick your state on the map
          </a>
        </div>

        <div id="map" aria-labelledby="map-heading" role="region" className="scroll-mt-4">
          <h2 id="map-heading" className="sr-only">Map of 2026 Senate and governor races by state</h2>
          <p className="mb-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm">
            Colors show which offices were on the ballot, not who won.
          </p>
          <UsMap shapes={shapes} states={states} />
        </div>
        </div>
      </section>

      <section aria-labelledby="house-heading" className="flex min-h-svh items-center border-t border-border">
        <div className="wrap grid gap-8 py-10 lg:grid-cols-2 lg:items-start lg:gap-6 lg:py-16">
          <div>
            <h2 id="house-heading" className="text-3xl font-semibold">2026 U.S. House results by district</h2>
            <p className="mt-2 max-w-[48ch] text-muted-foreground">
              All {districts.length} House seats were up for election. Open a state to see the candidates, vote shares and any
              projected winner in each district. We don&apos;t have bios or positions for House candidates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#map" className={btn("primary", "md")}>Pick a state</a>
              <Link href="/learn/what-a-representative-does/" className={btn("secondary", "md")}>What a Representative does</Link>
            </div>
          </div>
          {sample && (
            <Link href="/state/in/" aria-label="Indiana's U.S. House districts" className="lift block rounded-2xl border border-border bg-card p-6 sm:p-8">
              <svg viewBox={`-3 -3 ${sample.width + 6} ${sample.height + 6}`} className="mx-auto block h-[min(52svh,480px)] w-full" aria-hidden="true">
                {sample.districts.map((d) => (
                  <path key={d.district} d={d.d} fillRule="evenodd" vectorEffect="non-scaling-stroke" style={{ fill: "var(--map-none)", stroke: "var(--ink-muted)", strokeWidth: 1.25, strokeLinejoin: "round" }} />
                ))}
                {sample.districts.filter((d) => d.label).map((d) => (
                  <text key={d.district} x={d.x} y={d.y} dy="0.35em" textAnchor="middle" className="text-[11px] font-semibold tabular-nums" style={{ fill: "var(--ink)" }}>{d.district}</text>
                ))}
              </svg>
              <p className="mt-3 text-center text-sm">Example: Indiana&apos;s {sample.districts.length} districts</p>
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby="learn-heading" className="flex min-h-[200svh] items-center border-t border-border bg-card/60 lg:min-h-svh">
        <Reveal className="wrap grid gap-6 py-6 sm:gap-8 sm:py-10 lg:grid-cols-2 lg:items-start lg:gap-6 lg:py-16">
          <div>
            <h2 id="learn-heading" className="text-3xl font-semibold">Lessons on how the races work</h2>
            <p className="mt-2 max-w-[48ch] text-muted-foreground">Each one is short, and you don&apos;t need any background.</p>
            {lessons.length ? (
              <ul className="mt-6 space-y-3">
                {lessons.slice(0, 5).map((l) => (
                  <li key={l.slug} data-reveal className="lg:nth-[n+5]:hidden">
                    <Link href={`/learn/${l.slug}/`} className="lift flex gap-4 rounded-xl border border-border bg-card p-4">
                      <LessonIcon slug={l.slug} className="mt-0.5" />
                      <span>
                        <span className="block font-semibold">{l.title}</span>
                        {l.summary && <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">{l.summary}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-muted-foreground">Lessons are being written. Check back soon.</p>
            )}
            <Link href="/learn/" className={btn("secondary", "md", "mt-6")}>See all lessons</Link>
          </div>
          {preview && (
            <div data-ui className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson 1</p>
              <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight sm:text-3xl">{preview.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{preview.summary}</p>
              {points.length > 0 && (
                <>
                  <h4 className="mt-6 font-semibold">Key takeaways</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </>
              )}
              <Link href={`/learn/${preview.slug}/`} className={btn("primary", "md", "mt-6")}>Read this lesson</Link>
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
