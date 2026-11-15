# Results completion pass: instructions for agents

Dataset: nonpartisan 2026 U.S. midterm race files in data/races/ (schema: data/SCHEMA.md; today is 2026-11-14). In your files the candidate list or vote shares are incomplete: some candidates have `voteShare: null`, or the listed shares add up to well under 100% because minor candidates on the ballot are missing.

Load WebFetch via ToolSearch "select:WebSearch,WebFetch". WebSearch is out of budget this session: use WebFetch only. Good pages: the state election office's results page, and the Wikipedia article "2026 United States Senate election in <State>" / "2026 <State> gubernatorial election" (results table, not the infobox).

For each file:
1. Open a results page. Fill each null `voteShare` only with a figure you read on a page you opened. If two pages disagree, prefer the state election office; if you only have one page and it looks partial, still use it (all results on the site are labelled unofficial).
2. Add ballot candidates missing from the file: `id` (kebab-case name), `name`, `party` (use "Other" plus `partyLabel` for parties outside the schema list), `major: false`, `incumbent: false`, `voteShare`, `bio: null`, `website: null`, `positions: []`, `sources: [<page URL>]`. Don't add write-ins. Keep the order: winner first, then by vote share, descending.
3. Add the page URL to the race's `sources`, and set `lastVerified` to "2026-11-14".
4. If the page shows a different WINNER from the file's `winnerId`, do NOT change it: say so in your reply.

Don't touch status, winnerId, summary, crossChecked, factCheckNote, or any major candidate's bio/website/positions. You are the only writer of your files. Re-read each file right before writing, save after each race, keep the JSON valid, and put helper scripts in your own uniquely named scratchpad subfolder. Don't stop early: do every file. Leave a share null rather than guess.

Final reply, under 60 words: shares filled, candidates added, files you could not complete, any winner mismatch.
