@AGENTS.md

## How the app works

A mobile-first guessing game: a retired jersey is shown with its team
hidden, and the player has to name whoever wore it. See `README.md` for
setup/scripts and current MVP scope; this section is the architecture
overview.

**Flow:** `src/app/page.tsx` (landing) → `src/app/play/page.tsx`, which
dynamically imports `src/components/PlayGame.tsx` with `ssr: false`. That
component owns the entire game: it builds a round, drives the state
machine, and renders both the in-round screen and the end-of-round results
screen (there's no separate results route).

**Round setup** (`src/lib/game/round.ts`): `buildRound` Fisher-Yates
shuffles the full player pool and takes the first 5 — a fixed-length round,
no repeats, different order every play. The pool itself comes from
`src/data/players.json`, which is generated (never hand-edited) from
`data/players.csv` via `npm run data:build` — see `scripts/csv-to-json.ts`.
`src/lib/types.ts` defines the `RetiredPlayer` shape that flows through all
of this.

**Game state** (`src/lib/game/gameReducer.ts`): a plain reducer, no
external state library. `GameState` holds the round's players, the current
index, a `phase` (`"active" | "feedback" | "result"`), which hints have
been revealed for the current jersey, a running count of how many jerseys
have used a hint, and accumulated `results`. Actions: `REVEAL_HINT`,
`SET_GUESS`, `SUBMIT_GUESS`, `NEXT`. Key rule baked into `canRevealHint`:
the hint cap is 2 **jerseys** per round, not 2 hints total — revealing both
team and era on the same jersey only consumes one slot of the cap, because
`hintJerseyCount` only increments on the first hint revealed per jersey.
Each jersey allows exactly one guess (`SUBMIT_GUESS` moves phase to
`"feedback"`); there's no skip and no re-guessing in this fixed-5 mode.
`NEXT` either advances to the next jersey (resetting hints/guess) or, on
the last jersey, moves phase to `"result"`.

**Guess matching** (`src/lib/game/fuzzyMatch.ts`): guesses are normalized
(accents stripped, lowercased, punctuation removed) and compared against
the player's full name plus any `aliases`, using Levenshtein edit distance
with a small fixed threshold — so minor typos/nicknames still count as
correct, but wrong answers don't.

**Rendering:** `PlayGame.tsx` reads `current = state.players[state.currentIndex]`
each render and switches on `state.phase` to decide what to show — the
guess input, the feedback message, or (in the `"result"` phase branch) the
full round summary with a per-jersey correct/incorrect list, a share
button that copies a text summary to the clipboard, and a disabled
"Submit to Leaderboard" stub (leaderboards are out of scope for this MVP).
The jersey art itself is `JerseySilhouette` — a generated SVG placeholder
(team-neutral color, just the number) standing in for real jersey photos,
since no real photo asset pipeline exists yet on `main`.

**Why `PlayGame` must stay client-only:** the round is randomized in a
`useState` lazy initializer. If it ever rendered on the server, the
server-picked round and the client's first render would disagree and React
would throw a hydration mismatch — hence the `ssr: false` dynamic import in
`src/app/play/page.tsx`.
