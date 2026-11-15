import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  order: number;
  body: string;
}

const DIR = path.join(process.cwd(), "..", "content", "lessons");

export function getLessons(): Lesson[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const out: Lesson[] = [];
  for (const f of files) {
    try {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      const slug = typeof data.slug === "string" && data.slug ? data.slug : f.replace(/\.md$/, "");
      out.push({
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        summary: typeof data.summary === "string" ? data.summary : "",
        order: typeof data.order === "number" ? data.order : 99,
        body: content,
      });
    } catch (e) {
      console.warn(`[lessons] skipping ${f}: ${(e as Error).message}`);
    }
  }
  return out.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getLesson(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.slug === slug);
}
