import { BarChart3, BookOpen, CalendarDays, ClipboardCheck, Landmark, Search, type LucideIcon } from "lucide-react";

const MAP: [RegExp, LucideIcon][] = [
  [/midterm/, CalendarDays],
  [/regist/, ClipboardCheck],
  [/research|candidate/, Search],
  [/gloss/, BookOpen],
  [/result/, BarChart3],
  [/senat|governor/, Landmark],
];

export function LessonIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const Icon = MAP.find(([re]) => re.test(slug))?.[1] ?? BookOpen;
  return <Icon aria-hidden="true" className={`size-6 shrink-0 text-primary ${className}`} strokeWidth={1.75} />;
}
