<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project: Retire the Number

Mobile-first retired-jersey guessing game. Stage 1 MVP: NBA only, Lakers/Celtics/Bulls/Knicks, fixed 5-jersey round, no auth/leaderboard/DB. See `README.md` for structure and current status, and the project spec (kept outside this repo) for the full staged plan (V1 adds Auth0 + Neon leaderboards + Endless mode).

Key things to know before touching this code:
- **Content is placeholder.** `data/players.csv` has 12 fictional players; jerseys render via the generated `JerseySilhouette` SVG, not real photos. Don't "fix" fake names like "Sample Player A" — that's intentional until real data is supplied.
- **Data pipeline is real, only the content isn't.** Edit `data/players.csv`, then run `npm run data:build` to regenerate `src/data/players.json`. Never hand-edit the generated JSON.
- **`src/components/PlayGame.tsx` is loaded via `next/dynamic({ ssr: false })`** from `src/app/play/page.tsx`. It builds a randomized round in a `useState` lazy initializer — this must stay client-only (no SSR) or the random round will mismatch on hydration.
- **Game rules live in `src/lib/game/gameReducer.ts`**: hint cap is 2 jerseys per round (not 2 hints total — using both hint types on one jersey only counts once), single guess attempt per jersey, no skip in fixed-5 mode.
<!-- END:project-context -->
