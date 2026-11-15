# Profile deepening pass: instructions for agents

You are filling candidate profiles in a nonpartisan dataset for new voters about the 2026 U.S. midterms (held 2026-11-03; today is 2026-11-14). Read data/SCHEMA.md first and follow its neutrality rules strictly.

Load WebSearch/WebFetch via ToolSearch "select:WebSearch,WebFetch". Ballotpedia fetches come back empty: use campaign sites (issues/priorities pages), official .gov pages, congress.gov, and reputable news (AP, NPR, local papers, States Newsroom outlets, candidate questionnaires and debate coverage).

**You have plenty of time. Earlier agents stopped after about two minutes claiming they ran out; don't do that.** Work until every major candidate in your files has: a bio, a verified website (or null if you truly cannot confirm one), and positions on at least 4 of the 6 issues (economy, healthcare, immigration, education, climate, abortion). Expect to spend 60–100 tool calls. Stop only when that bar is met or you have tried at least two searches per missing item.

Rules:
- Each position is ONE plain-language sentence stating the candidate's own stance in their framing ("Says…", "Supports…", "Voted for…", "Signed…"), with a source URL you actually opened. Never write a position from memory alone.
- `website`: only a URL you fetched and saw to be the candidate's official site. Never guess a domain.
- Do NOT change status, winnerId, voteShare, crossChecked or factCheckNote.
- Other agents edit these files at the same time (one verifies `website` fields). Re-read each file right before writing, and change only bio/website/positions/sources of candidates. Save after each race.
- Keep the JSON valid: `python3 -c "import json,sys;json.load(open(sys.argv[1]))" <file>`.

Final reply: under 60 words, with the count of major candidates that have 4+ positions and the names of any still below the bar.
