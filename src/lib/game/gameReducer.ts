import type { RetiredPlayer } from "@/lib/types";
import { isCorrectGuess } from "./fuzzyMatch";

export type HintType = "team" | "era";

export const HINT_CAP = 2;

export interface JerseyResult {
  player: RetiredPlayer;
  guess: string;
  correct: boolean;
  hintsUsed: HintType[];
}

export type GamePhase = "active" | "feedback" | "result";

export interface GameState {
  players: RetiredPlayer[];
  currentIndex: number;
  phase: GamePhase;
  revealedHints: HintType[];
  hintJerseyCount: number;
  currentGuess: string;
  results: JerseyResult[];
}

export type GameAction =
  | { type: "REVEAL_HINT"; hint: HintType }
  | { type: "SET_GUESS"; value: string }
  | { type: "SUBMIT_GUESS" }
  | { type: "NEXT" };

export function createGameState(players: RetiredPlayer[]): GameState {
  return {
    players,
    currentIndex: 0,
    phase: "active",
    revealedHints: [],
    hintJerseyCount: 0,
    currentGuess: "",
    results: [],
  };
}

export function canRevealHint(state: GameState, hint: HintType): boolean {
  if (state.phase !== "active") return false;
  if (state.revealedHints.includes(hint)) return false;
  if (state.revealedHints.length > 0) return true; // already hint-eligible this jersey
  return state.hintJerseyCount < HINT_CAP;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "REVEAL_HINT": {
      if (!canRevealHint(state, action.hint)) return state;
      const isFirstHintOnJersey = state.revealedHints.length === 0;
      return {
        ...state,
        revealedHints: [...state.revealedHints, action.hint],
        hintJerseyCount: isFirstHintOnJersey ? state.hintJerseyCount + 1 : state.hintJerseyCount,
      };
    }

    case "SET_GUESS": {
      if (state.phase !== "active") return state;
      return { ...state, currentGuess: action.value };
    }

    case "SUBMIT_GUESS": {
      if (state.phase !== "active") return state;
      const player = state.players[state.currentIndex];
      const correct = isCorrectGuess(state.currentGuess, player);
      const result: JerseyResult = {
        player,
        guess: state.currentGuess,
        correct,
        hintsUsed: state.revealedHints,
      };
      return {
        ...state,
        phase: "feedback",
        results: [...state.results, result],
      };
    }

    case "NEXT": {
      if (state.phase !== "feedback") return state;
      const isLastJersey = state.currentIndex === state.players.length - 1;
      if (isLastJersey) {
        return { ...state, phase: "result" };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        phase: "active",
        revealedHints: [],
        currentGuess: "",
      };
    }

    default:
      return state;
  }
}
