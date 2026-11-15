# Race summary cleanup: instructions for agents

Each race file in data/races/ has a top-level `summary` shown to new voters at the top of the race card. Some contain notes meant for editors ("Percentages from Wikipedia and may update", "election-night partial counts differed"), jargon ("open contest"), or awkward phrasing.

For each of your files, rewrite `summary` as 1–2 plain sentences a first-time voter can follow:
- Say what kind of race it was (the sitting senator/governor ran again; or nobody held the seat going in, and why: retired, term-limited, lost the primary, died) and who won, with party in parentheses. For `status` "uncalled" or "runoff", say no winner has been declared yet and why (e.g. ranked-choice count on Nov 18), and name no winner.
- Use only facts already in the file (the old summary, candidates, status, winnerId, factCheckNote). Don't add new facts and don't browse.
- No sourcing or data-quality notes: move any such note into `factCheckNote` (append it) instead of deleting it.
- Neutral wording: "defeated" or "won", never "upset", "stunned", "crushed", "cruised".
- If a term like "special election", "incumbent" or "ranked-choice" is needed, use it plainly; the site has a glossary.

Change only `summary` and (when moving a note) `factCheckNote`. Re-read each file right before writing. Keep the JSON valid. Reply in under 40 words.
