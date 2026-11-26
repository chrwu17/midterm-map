import { btn } from "@/lib/button-styles";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Midterm Map" },
  description: "Midterm Map has no page at this address.",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-20 sm:px-8 sm:py-28">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Error 404</p>
      <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-tight">We couldn&apos;t find that page</h1>
      <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
        The link may be old or mistyped. Try picking a state on the map or reading a short lesson on how elections work.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Link href="/" className={btn("primary")}>
            Go to the map
          </Link>
        </li>
        <li>
          <Link href="/learn/" className={btn("secondary")}>
            See all lessons
          </Link>
        </li>
      </ul>
    </div>
  );
}
