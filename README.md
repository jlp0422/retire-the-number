# Retire the Number

A mobile-first guessing game: a retired jersey hangs with its team hidden, and you have to name the player who wore it. Fixed round of 5 jerseys, with two on-demand hints (team, era) capped at 2 per round and fuzzy-matched guessing.

This is the **Stage 1 MVP** — see "Current status" below for what's real vs. placeholder.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is designed mobile-first (iPhone/Safari viewport); desktop is not polished yet.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run data:build` | Regenerate `src/data/players.json` from `data/players.csv` |

## Project structure

- `data/players.csv` — source spreadsheet (playerName, aliases, team, teamId, league, number, era, imageFile, difficulty)
- `scripts/csv-to-json.ts` — manual conversion script; re-run after editing the CSV
- `src/data/players.json` — generated, bundled directly into the app (not fetched at runtime)
- `src/lib/types.ts` — `RetiredPlayer` schema
- `src/lib/game/` — pure game logic: fuzzy matching (`fuzzyMatch.ts`), round building (`round.ts`), the state machine (`gameReducer.ts`)
- `src/components/JerseySilhouette.tsx` — placeholder jersey graphic (see below)
- `src/components/PlayGame.tsx` — the game screen + result screen (client-only, see comment in `src/app/play/page.tsx` for why)
- `src/app/page.tsx` — landing screen
- `src/app/play/page.tsx` — game route wrapper

## Current status (placeholder content)

No real spreadsheet or jersey photos exist yet, so:
- `data/players.csv` holds 12 **fictional** players ("Sample Player A", etc.) across the Lakers/Celtics/Bulls/Knicks, just enough to exercise the game loop.
- Jerseys are rendered as a generated SVG silhouette (`JerseySilhouette`, team-neutral tone, number only) instead of real cropped photos.
- The background behind the jersey is a CSS wood-tone placeholder (`.wood-panel` in `globals.css`), standing in for the official generated hanger artwork.

To bring in real content: replace `data/players.csv`, run `npm run data:build`, and swap `JerseySilhouette` for real photos (`imageFile` is already threaded through the schema).

## Scope

Auth0, a leaderboard, Endless mode, the skip mechanic, multi-sport support, and a reveal animation are all out of scope for this MVP — see the project spec for the full staged plan.
