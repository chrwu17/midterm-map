# No-Wikipedia pass: agent instructions

Goal, set by the project owner: zero Wikipedia citations. Read `CLAUDE.md`, `data/SCHEMA.md` and the Ground rules in `data/CERTIFIED-PASS.md` (strict fetch rules) first. Backup: `data/.backup/2026-11-25-pre-wikipedia`.

Never just delete a link. For each wikipedia.org URL, including mirrors (no Wikiwand, DBpedia or copied text):
1. Open another publisher's page (official site, state results page, Green Papers, news, campaign site) and check each fact the Wikipedia link supported.
2. Supported: cite that page. If the sources left in the list already support every fact and you opened them, drop the link.
3. Not supported anywhere you can open: cut or narrow that fact. Never leave an uncited bio fact. Do not cut a candidate or winner; report it instead.
4. Results: all shares in a race or district from one openable non-Wikipedia count. If the count differs, change every share.  Keep `resultsCertified` only if its existing proof still stands.
5. Minor candidates: cite a results page listing them.
6. Notes: rewrite so they describe where the current data comes from. No claim of a check that no longer applies.
7. Positions: re-source, narrow to what a page supports, or delete if no openable page supports it, and report each deletion.
8. Positions citing ontheissues.org in your files: try to re-source; otherwise leave and report.
Rate limits (429): stop on that site for at least a minute, then one retry; stop if refused again.
Finish with the validators and `grep -ci wikipedia` on your files. Reply under 300 words: links removed by type, facts cut, shares changed, deletions, remaining links and why, OnTheIssues left, any fetch-rule breach.
