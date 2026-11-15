import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Public_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SITE_URL, pageMeta } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600"] });
const publicSans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta(
    "Midterm Map: a nonpartisan guide to the 2026 Senate and governor races",
    "A nonpartisan guide for new voters to the 2026 U.S. Senate and governor races: who ran, who won, and where candidates stand.",
    "/",
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Marks a live script, so the hero headline is hidden for its entrance only when JS will reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <header className="nav relative z-20 border-b border-border">
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
            Skip to content
          </a>

          <nav className="wrap flex items-center justify-between gap-4 py-4" aria-label="Main">
            <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
              Midterm Map
            </Link>
            <ul className="flex gap-5 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="/">Map</Link></li>
              <li><Link className="hover:text-foreground" href="/learn/">Learn</Link></li>
              <li><Link className="hover:text-foreground" href="/about/">About</Link></li>
            </ul>
          </nav>
        </header>
        <MotionProvider>
          <main id="main" className="flex-1">{children}</main>
        </MotionProvider>
        <footer className="closing border-t border-border">
          <div className="wrap py-8 text-sm text-muted-foreground">
            Midterm Map is a nonpartisan student project. It does not endorse any candidate or party.{" "}
            <Link href="/about/" className="underline">How we pick and check facts</Link>.
            Register or check your status at <a className="underline" href="https://vote.gov">vote.gov</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
