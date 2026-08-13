"use client";

import { useState } from "react";
import Link from "next/link";
import playersData from "@/data/players.json";
import type { RetiredPlayer } from "@/lib/types";
import { buildRound } from "@/lib/game/round";
import {
  canRevealHint,
  createGameState,
  gameReducer,
  HINT_CAP,
  type GameAction,
  type GameState,
  type HintType,
} from "@/lib/game/gameReducer";
import { JerseySilhouette } from "@/components/JerseySilhouette";

const PLAYERS = playersData as RetiredPlayer[];

// Rendered only via next/dynamic with ssr:false (see app/play/page.tsx) —
// the round is randomized, so it must never be computed during SSR/hydration.
export default function PlayGame() {
  const [state, setState] = useState<GameState>(() => createGameState(buildRound(PLAYERS)));
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  function dispatch(action: GameAction) {
    setState((prev) => gameReducer(prev, action));
  }

  function playAgain() {
    setShareStatus("idle");
    setState(createGameState(buildRound(PLAYERS)));
  }

  if (state.phase === "result") {
    const score = state.results.filter((r) => r.correct).length;

    async function handleShare() {
      const summary = `Retire the Number: ${score}/${state.results.length} correct, ${state.hintJerseyCount} hint${
        state.hintJerseyCount === 1 ? "" : "s"
      } used.`;
      try {
        await navigator.clipboard.writeText(summary);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      } catch {
        // clipboard unavailable — silently ignore, non-critical action
      }
    }

    return (
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-10">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">Results</h1>
          <p className="text-foreground/70">
            {score}/{state.results.length} correct · {state.hintJerseyCount} hint
            {state.hintJerseyCount === 1 ? "" : "s"} used
          </p>
        </div>

        <ul className="flex w-full max-w-sm flex-col gap-2">
          {state.results.map((result, i) => (
            <li
              key={result.player.id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                result.correct
                  ? "border-success/30 bg-success-surface"
                  : "border-error/30 bg-error-surface"
              }`}
            >
              <JerseySilhouette
                number={result.player.number}
                className="h-14 w-auto shrink-0 rounded-md"
              />
              <div className="flex flex-1 flex-col">
                <span className="font-medium text-foreground">
                  #{i + 1} · {result.player.playerName}
                </span>
                <span className="text-foreground/60">
                  {result.correct ? "Correct" : `You guessed: ${result.guess || "(blank)"}`}
                  {result.hintsUsed.length > 0 ? ` · hints: ${result.hintsUsed.join(", ")}` : ""}
                </span>
              </div>
              <span className={result.correct ? "text-success" : "text-error"}>
                {result.correct ? "✓" : "✕"}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <button
            onClick={playAgain}
            className="w-full rounded-full bg-wood-dark px-6 py-3.5 text-base font-medium text-surface transition-colors hover:bg-wood-mid"
          >
            Play Again
          </button>
          <Link href="/" className="w-full rounded-full border border-disabled px-6 py-3 text-center text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-muted">
            Change Mode / Sport
          </Link>
          <div className="flex w-full gap-3">
            <button
              onClick={handleShare}
              className="flex-1 rounded-full border border-brass px-4 py-2.5 text-sm font-medium text-wood-dark transition-colors hover:bg-brass/10"
            >
              {shareStatus === "copied" ? "Copied!" : "Share"}
            </button>
            <button
              disabled
              aria-disabled="true"
              className="flex-1 rounded-full border border-disabled px-4 py-2.5 text-sm text-foreground/35"
            >
              Submit to Leaderboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const current = state.players[state.currentIndex];
  const currentResult = state.results[state.currentIndex];
  const isLastJersey = state.currentIndex === state.players.length - 1;

  function handleGuessSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.phase !== "active" || !state.currentGuess.trim()) return;
    dispatch({ type: "SUBMIT_GUESS" });
  }

  function hintLabel(hint: HintType) {
    if (hint === "team") return `Team: ${current.team}`;
    return `Era: ${current.era}`;
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="grid grid-cols-3 items-center px-6 pt-4 text-xs uppercase tracking-wider text-foreground/50">
        <Link href="/" aria-label="Exit to home" className="justify-self-start text-foreground/50 hover:text-foreground">
          ← Exit
        </Link>
        <span className="justify-self-center">Jersey {state.currentIndex + 1}/{state.players.length}</span>
        <span className="justify-self-end">Hints used: {state.hintJerseyCount}/{HINT_CAP}</span>
      </div>

      <div className="wood-panel mx-4 mt-3 flex flex-1 items-center justify-center rounded-2xl">
        <JerseySilhouette number={current.number} className="h-[85%] max-h-80 w-auto drop-shadow-lg" />
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex justify-center gap-3">
          {(["team", "era"] as HintType[]).map((hint) => {
            const revealed = state.revealedHints.includes(hint);
            const disabled = !revealed && !canRevealHint(state, hint);
            return (
              <button
                key={hint}
                type="button"
                disabled={revealed || disabled}
                onClick={() => dispatch({ type: "REVEAL_HINT", hint })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  revealed
                    ? "border-brass bg-brass/15 text-wood-dark"
                    : disabled
                      ? "border-disabled/60 text-foreground/30"
                      : "border-brass text-wood-dark hover:bg-brass/10"
                }`}
              >
                {revealed ? hintLabel(hint) : hint === "team" ? "Reveal Team" : "Reveal Era"}
              </button>
            );
          })}
        </div>

        {state.phase === "feedback" && currentResult ? (
          <div
            className={`rounded-xl border px-4 py-3 text-center text-sm font-medium ${
              currentResult.correct
                ? "border-success/30 bg-success-surface text-success"
                : "border-error/30 bg-error-surface text-error"
            }`}
          >
            {currentResult.correct
              ? `Correct! It's ${current.playerName}.`
              : `Not quite — it was ${current.playerName}.`}
          </div>
        ) : (
          <form onSubmit={handleGuessSubmit} className="flex gap-2">
            <input
              autoFocus
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Who wore this number?"
              value={state.currentGuess}
              onChange={(e) => dispatch({ type: "SET_GUESS", value: e.target.value })}
              className="flex-1 rounded-full border border-disabled bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-brass"
            />
            <button
              type="submit"
              className="rounded-full bg-wood-dark px-5 py-3 text-sm font-medium text-surface transition-colors hover:bg-wood-mid disabled:opacity-40"
              disabled={!state.currentGuess.trim()}
            >
              Guess
            </button>
          </form>
        )}

        {state.phase === "feedback" && (
          <button
            onClick={() => dispatch({ type: "NEXT" })}
            className="rounded-full bg-wood-dark px-6 py-3.5 text-base font-medium text-surface transition-colors hover:bg-wood-mid"
          >
            {isLastJersey ? "See Results" : "Next"}
          </button>
        )}
      </div>
    </main>
  );
}
