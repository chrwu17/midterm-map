# Source verification sweep: instructions for agents

You are auditing candidate positions in a nonpartisan dataset for new voters about the 2026 U.S. midterms (today is 2026-11-14). Read data/SCHEMA.md first. Load WebSearch/WebFetch via ToolSearch "select:WebSearch,WebFetch".

Why: earlier agents wrote some positions whose cited page does not actually support the sentence (two confirmed cases so far), and 78 positions cite Wikipedia or OnTheIssues instead of a campaign page, official record or news report. On a voter-education site a wrongly attributed stance is the worst error we can make.

For EVERY position of EVERY major candidate in your files:
1. Open the `source` URL. Does the page support the `summary` sentence as that candidate's own stance?
2. Supported, and the source is a campaign page, .gov page, congress.gov or a news outlet: leave it.
3. Supported, but the source is Wikipedia or OnTheIssues: try to find a campaign, official or news page saying the same and swap the URL. If you can't, keep it as is.
4. Not supported, or the page is dead/blocked and you can't confirm it elsewhere: find a supporting source and fix the sentence to match it, or DELETE the position. Fewer true positions beat more doubtful ones.
5. Also fix wording that evaluates instead of describes (schema neutrality rules).

Rules:
- Change only `positions` (and add URLs to that candidate's `sources`). Don't touch status, winnerId, voteShare, crossChecked, factCheckNote, bio or website.
- You are the only agent writing your files. Still re-read each file right before writing, and save after each race.
- Put helper scripts in your own uniquely named subfolder of the scratchpad; the folder is shared.
- You have plenty of time. Don't stop early: open every source. If WebSearch runs out of budget, keep going with WebFetch.
- Keep the JSON valid and run a final `python3 -c "import json,sys;json.load(open(sys.argv[1]))" <file>` on each file.

Final reply, under 70 words: positions checked, kept, re-sourced, rewritten, deleted, and how many you could not open.
