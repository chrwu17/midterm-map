import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getAllRaces, formatDate } from "@/lib/races";
import { raceLabel } from "@/lib/map-data";

export const metadata: Metadata = pageMeta(
  "About and methodology | Midterm Map",
  "How Midterm Map picks sources, checks facts and stays nonpartisan.",
  "/about/",
);

export default function AboutPage() {
  const races = [...getAllRaces()].sort((a, b) => a.stateName.localeCompare(b.stateName));
  const crossChecked = races.filter((r) => r.crossChecked).length;
  return (
    <div className="prose-lesson mx-auto max-w-[720px] px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-semibold">About this site</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Midterm Map is a student project that helps new voters understand the 2026 U.S. Senate and governor races. It does
        not support or oppose any candidate or party.
      </p>

      <h2>Our nonpartisan rules</h2>
      <ul>
        <li>We describe what a candidate says or did, in their own framing (&ldquo;Says she will…&rdquo;, &ldquo;Voted for…&rdquo;). We don&apos;t say whether they are right or wrong.</li>
        <li>Every major candidate is asked about the same six issues: economy, health care, immigration, education, climate and energy, and abortion. If we can&apos;t find a clear stance, we leave it blank rather than guess.</li>
        <li>Every bio fact and position links to a source.</li>
        <li>If a result is not certain, we mark the race &ldquo;Uncalled&rdquo; and name no winner.</li>
        <li>The map is colored by which offices were on the ballot, never by party. Party labels all use the same neutral style.</li>
      </ul>

      <h2>Where the data comes from</h2>
      <p>
        Race data is researched by hand from public sources: state election offices, official results pages, candidates&apos;
        own campaign websites, voting records, and reputable news reporting. Each race lists its sources and the date we last
        checked it. Major-party candidates get full profiles; other candidates are listed with name, party and vote share.
      </p>
      <p>
        Each source link is labelled with where it goes. &ldquo;Campaign site&rdquo; or &ldquo;Official site&rdquo; is the
        candidate&apos;s own page; a news outlet&apos;s name (such as AP or a local station) is a news report; and Wikipedia,
        OnTheIssues and similar reference sites are secondary summaries written by others, so treat them as a starting
        point and check the original where you can.
      </p>
      <p>
        Map shapes come from the U.S. Census Bureau via the <a href="https://github.com/topojson/us-atlas">us-atlas</a> project.
      </p>

      <h2>How we checked the results</h2>
      <p>
        Each race&apos;s vote shares and status were first gathered from the results sources listed on its card. The
        winner and status were then cross-checked against a separate source, usually a tally based on Associated Press
        race calls or a second news report. We name a winner only when a major news organization has projected one and
        the second source agrees. If they disagree, or the count is still close, we mark the race &ldquo;Uncalled&rdquo; and
        name no winner.
      </p>
      <p>
        {crossChecked} of {races.length} races have been cross-checked this way. The table below shows which ones and when each
        was last verified.
      </p>
      <p>
        <strong>All results here are unofficial.</strong> States finish counting and certify official results in the weeks
        after Election Day, and the numbers can change a little until then. Your state election office has the final word.
      </p>

      <h2>Last verified</h2>
      {races.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-3">State</th>
                <th scope="col" className="py-2 pr-3">Race</th>
                <th scope="col" className="py-2 pr-3">Last verified</th>
                <th scope="col" className="py-2">Cross-checked</th>
              </tr>
            </thead>
            <tbody>
              {races.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-2 pr-3">{r.stateName}</td>
                  <td className="py-2 pr-3">{raceLabel(r.office, r.special)}</td>
                  <td className="py-2 pr-3 tabular-nums whitespace-nowrap">{r.lastVerified ? formatDate(r.lastVerified) : "Not recorded"}</td>
                  <td className="py-2">{r.crossChecked ? "Yes" : "Not yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Race data is still being added.</p>
      )}

      <h2>Found a mistake?</h2>
      <p>Facts change as votes are counted. If something looks wrong or out of date, tell the course team so we can check it.</p>
    </div>
  );
}
