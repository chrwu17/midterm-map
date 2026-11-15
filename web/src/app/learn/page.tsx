import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getLessons } from "@/lib/lessons";
import { LessonIcon } from "@/components/lesson-icon";

export const metadata: Metadata = pageMeta(
  "Lessons | Midterm Map",
  "Short, plain-language lessons on how U.S. elections work, from what a senator does to how to read results.",
  "/learn/",
);

export default function LearnPage() {
  const lessons = getLessons();
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-semibold">Lessons</h1>
      <p className="mt-3 text-lg text-muted-foreground">Short, plain-language guides for first-time and new voters.</p>
      {lessons.length ? (
        <ol className="mt-10 space-y-4">
          {lessons.map((l) => (
            <li key={l.slug}>
              <Link href={`/learn/${l.slug}/`} className="lift flex gap-4 rounded-xl border border-border bg-card p-5">
                <LessonIcon slug={l.slug} className="mt-0.5" />
                <span>
                  <span className="block text-lg font-semibold">{l.title}</span>
                  {l.summary && <span className="mt-1 block text-sm text-muted-foreground">{l.summary}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-10 text-muted-foreground">Lessons are being written. Check back soon.</p>
      )}
    </div>
  );
}
