import { btn } from "@/lib/button-styles";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import { UsMap } from "@/components/us-map";
import { getStateShapes } from "@/lib/geo";
import { getMapStates } from "@/lib/map-data";
import { getLessons } from "@/lib/lessons";
import { LessonIcon } from "@/components/lesson-icon";
import { Reveal } from "@/components/motion-provider";

export default function Home() {
  const shapes = getStateShapes();
  const states = getMapStates();
  const lessons = getLessons();
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-4 pb-10 pt-14 sm:px-8 sm:pt-20">
        <SplitText
          tag="h1"
          text="Who's on your ballot, and why it matters"
          className="max-w-[16ch] text-balance font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05]"
          textAlign="left"
          splitType="words"
          trigger="load"
          delay={30}
          duration={0.4}
          ease="power3.out"
          from={{ opacity: 0, y: 12 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
          A plain-language, nonpartisan guide to the November 3, 2026 Senate and governor races. Pick a state to see who ran,
          who won, and what each major candidate says about six big issues.
        </p>
        <a href="#map" className={btn("primary", "md", "mt-7")}>
          Pick your state on the map
        </a>
      </section>

      <section id="map" aria-labelledby="map-heading" className="scroll-mt-4 mx-auto max-w-[1120px] px-4 pb-16 sm:px-8">
        <h2 id="map-heading" className="sr-only">Map of 2026 races by state</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Colors show which offices were on the ballot, not who won.
        </p>
        <UsMap shapes={shapes} states={states} />
      </section>

      <section aria-labelledby="learn-heading" className="border-t border-border bg-card/60">
        <Reveal className="mx-auto max-w-[1120px] px-4 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="learn-heading" className="text-3xl font-semibold">New to this? Start here.</h2>
              <p className="mt-2 max-w-[56ch] text-muted-foreground">Short lessons on how elections work. You don&apos;t need any background.</p>
            </div>
            <Link href="/learn/" className={btn("secondary")}>See all lessons</Link>
          </div>
          {lessons.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.slice(0, 6).map((l) => (
                <li key={l.slug} data-reveal>
                  <Link href={`/learn/${l.slug}/`} className="lift block h-full rounded-xl border border-border bg-card p-5">
                    <LessonIcon slug={l.slug} />
                    <h3 className="mt-4 text-lg font-semibold">{l.title}</h3>
                    {l.summary && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.summary}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-muted-foreground">Lessons are being written. Check back soon.</p>
          )}
        </Reveal>
      </section>
    </>
  );
}
