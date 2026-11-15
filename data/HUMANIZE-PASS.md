# Humanize pass: instructions for agents

The user wants every piece of prose in this dataset to read like a person wrote it. Dataset: nonpartisan 2026 U.S. midterm race files in data/races/ (schema and neutrality rules: data/SCHEMA.md). Readers are new voters with little political knowledge.

First invoke the Skill tool with "humanizer:humanizer" and follow it. Then, for each of your files, edit three kinds of text:
1. each major candidate's `positions[].summary`
2. each major candidate's `bio`
3. the race `summary`

What good looks like for a position: one plain sentence a first-time voter can read aloud, e.g. "Says he would end the state income tax and cut property taxes." Fix the clunky patterns an earlier accuracy sweep left behind: "Lists X among the goals she and Lt. Gov.-elect John Giles outlined at a Tucson victory rally, according to KOLD", stacked qualifiers, "according to <outlet>" tails (the site already shows the source next to each sentence), quote fragments wedged into a sentence, jargon without need.

Accuracy comes first. These sentences were each checked against their cited page, and about a quarter had to be corrected because they claimed more than the page said. So:
- Never strengthen a claim. If the page only shows the candidate *listing* something as a goal, don't turn it into "will" or "supports a plan to". "Says cutting costs is one of her goals" is fine; "Will cut costs" is not.
- Keep the attribution verb honest: "says", "said in May 2025", "voted for", "signed", "has called for". Keep dates where the stance is old.
- For any position where your rewrite changes more than word order or trims a tail, re-open the `source` URL with WebFetch (load it via ToolSearch "select:WebFetch") and confirm the new sentence says no more than the page. If you can't open it, make only the safest trim.
- No facts added or removed in bios and race summaries; names, numbers, dates, offices stay exactly as they are.
- Neutral: describe, never evaluate. No "upset", "stunned", "controversial", "common-sense".
- Don't touch `source`, `sources`, `website`, `voteShare`, `status`, `winnerId`, `crossChecked`, `factCheckNote`, or minor candidates.

You are the only writer of your files. Re-read each file right before writing, save after each race, keep the JSON valid, and put helper scripts in your own uniquely named scratchpad subfolder. Do every file. At the end run `node /Users/christian/latino-politics/scripts/validate-data.mjs --quiet` and confirm no errors in your files.

Final reply, under 70 words: sentences rewritten, how many you re-checked against the source, how many you left as they were, and any you could not make both natural and accurate.
