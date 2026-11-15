import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { pageMeta } from "@/lib/seo";
import { getLesson, getLessons } from "@/lib/lessons";

export const dynamicParams = false;

export function generateStaticParams() {
  const lessons = getLessons();
  // Static export needs at least one param; a placeholder renders the 404 below.
  return lessons.length ? lessons.map((l) => ({ slug: l.slug })) : [{ slug: "coming-soon" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLesson(slug);
  if (!l) return { title: "Lesson | Midterm Map" };
  return pageMeta(`${l.title} | Midterm Map`, l.summary || `A short Midterm Map lesson: ${l.title}.`, `/learn/${l.slug}/`);
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) {
    if (slug === "coming-soon") {
      return (
        <div className="mx-auto max-w-[680px] px-4 py-16 sm:px-8">
          <h1 className="text-4xl font-semibold">Lessons coming soon</h1>
          <p className="mt-4"><Link className="underline" href="/learn/">Back to lessons</Link></p>
        </div>
      );
    }
    notFound();
  }
  const all = getLessons();
  const idx = all.findIndex((l) => l.slug === lesson.slug);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  return (
    <article className="mx-auto max-w-[680px] px-4 py-12 sm:px-8 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/learn/" className="underline">Lessons</Link>
      </nav>
      <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight">{lesson.title}</h1>
      {lesson.summary && <p className="mt-3 text-lg text-muted-foreground">{lesson.summary}</p>}
      <div className="prose-lesson mt-8">
        <ReactMarkdown
          components={{
            // Internal links go through next/link so they keep the site's base path (GitHub Pages serves from a sub-path).
            a: ({ href, children }) =>
              href?.startsWith("/") ? (
                <Link href={href}>{children}</Link>
              ) : (
                <a href={href}>{children}</a>
              ),
          }}
        >
          {lesson.body}
        </ReactMarkdown>
      </div>
      <nav aria-label="More lessons" className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/learn/${prev.slug}/`} className="lift block rounded-xl border border-border bg-card p-4">
            <span className="block text-sm text-muted-foreground">Previous lesson</span>
            <span className="mt-1 block font-medium text-primary underline">{prev.title}</span>
          </Link>
        ) : <span className="hidden sm:block" />}
        {next && (
          <Link href={`/learn/${next.slug}/`} className="lift block rounded-xl border border-border bg-card p-4 sm:text-right">
            <span className="block text-sm text-muted-foreground">Next lesson</span>
            <span className="mt-1 block font-medium text-primary underline">{next.title}</span>
          </Link>
        )}
      </nav>
      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/" className="underline">Back to the map</Link>
        <Link href="/learn/" className="underline">All lessons</Link>
      </p>
    </article>
  );
}
