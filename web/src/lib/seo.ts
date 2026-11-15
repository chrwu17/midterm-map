import type { Metadata } from "next";

export const SITE_NAME = "Midterm Map";
/** Set NEXT_PUBLIC_SITE_URL (origin only) at build time so Open Graph URLs are absolute on the real domain. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Per-page title, description and Open Graph tags. `title` is the full title as it should appear in the tab. */
/** Sub-path the site is served from (GitHub Pages project sites), or "". */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function pageMeta(title: string, description: string, pagePath: string): Metadata {
  const path = `${BASE}${pagePath}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_US" },
    twitter: { card: "summary", title, description },
  };
}
