import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getAllRaces, formatDate } from "@/lib/races";
import { raceLabel } from "@/lib/map-data";
import { getAllHouse } from "@/lib/house";

export const metadata: Metadata = pageMeta(
  "About and methodology | Midterm Map",
  "How Midterm Map chooses sources and checks facts, and the nonpartisan rules it follows.",
  "/about/",
);

export default function AboutPage() {
  const races = [...getAllRaces()].sort((a, b) => a.stateName.localeCompare(b.stateName));
  const crossChecked = races.filter((r) => r.crossChecked).length;
  const districts = getAllHouse().flatMap((h) => h.districts);
  const houseCalled = districts.filter((d) => d.status === "called").length;
  const houseUncalled = districts.filter((d) => d.status === "uncalled").length;
  const houseRunoff = districts.filter((d) => d.status === "runoff").length;
  return (
    <div className="prose-lesson mx-auto max-w-[720px] px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-semibold">About this site</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Midterm Map is a student project that helps new voters understand the 2026 U.S. Senate and governor races, and
        it shows U.S. House results too. It does not support or oppose any candidate or party.
      </p>

      <h2>Our nonpartisan rules</h2>
      <ul>
        <li>We describe what a candidate says or did, in the candidate&apos;s own framing (&ldquo;Says she will…&rdquo;, &ldquo;Voted for…&rdquo;). We don&apos;t say whether they are right or wrong.</li>
        <li>We look for every major Senate and governor candidate&apos;s position on the same six issues: economy, health care, immigration, education, climate and energy, and abortion. If we can&apos;t find a clear stance, we leave that issue blank.</li>
        <li>Every bio lists its sources, and every position links to the page it came from.</li>
        <li>House candidates are listed with results only, without bios or positions.</li>
        <li>If a result is not certain, we mark the race &ldquo;Uncalled&rdquo; and name no winner.</li>
        <li>The map is colored by which offices were on the ballot, never by party. Party labels all use the same neutral style.</li>
      </ul>

      <h2>Where the data comes from</h2>
      <p>
        Race data comes from public sources such as state election offices, official results pages, candidates&apos; campaign websites, voting records and news reports from reputable outlets. Each race lists its sources and the date we last
        checked it. In the Senate and governor races, major-party candidates get full profiles and other candidates are listed with name, party and vote share.
      </p>
      <p>
        Each source link names the site it goes to. &ldquo;Campaign site&rdquo; or &ldquo;Official site&rdquo; is the
        candidate&apos;s own page. A news outlet&apos;s name (such as AP or a local station) means a news report. Ballotpedia,
        The Green Papers and similar reference sites are summaries put together by others, so use them as a starting point and
        check the original where you can.
      </p>
      <p>
        Map shapes come from the U.S. Census Bureau via the <a href="https://github.com/topojson/us-atlas">us-atlas</a> project.
      </p>

      <h2>How we checked the results</h2>
      <p>
        Each race&apos;s vote shares and status come from the results sources listed on its card. We then cross-check the winner
        and status against a separate source, usually a tally based on Associated Press
        race calls or a second news report. We name a winner only when the state has certified the result, or when a major
        news organization has projected one and the second source agrees. If they disagree, or the count is still close, we mark the race &ldquo;Uncalled&rdquo; and
        name no winner.
      </p>
      <p>
        {crossChecked} of {races.length} Senate and governor races have been cross-checked this way. The table at the end of this page
        lists them, with the date each race was last verified.
      </p>
      <h2>U.S. House results</h2>
      <p>
        For each of the {districts.length} House districts, we show the candidates, their parties, their vote shares and any
        projected winner. We did not write bios or research positions for House candidates.
      </p>
      <p>
        Most House vote shares come from The Green Papers, a reference site. Some come from state results pages.{" "}
        {houseCalled} districts are called,{" "}
        {houseUncalled} {houseUncalled === 1 ? "has" : "have"} no projected winner yet and {houseRunoff}{" "}
        {houseRunoff === 1 ? "is" : "are"} headed to a runoff. A candidate has no vote share if the sources did not give
        one or no vote was held. Each state page shows when its House results were last verified.
      </p>

      <h2>Unofficial and certified results</h2>
      <p>
        Senate and governor results on this site are unofficial unless the race is marked as certified. House results are
        not marked, so treat them as unofficial. States finish counting and certify official
        results in the weeks after Election Day, and the numbers can change a little until then. When a Senate or governor
        race is marked as certified, every vote share shown for it comes from the state&apos;s certified count. Your state
        election office has the official results.
      </p>

      <h2>Last verified</h2>
      <p>Senate and governor races, by state.</p>
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
      <p>Results can change as votes are counted. If something looks wrong or out of date, tell the course team so we can check it.</p>
    </div>
  );
}
