import type { RetiredPlayer } from "@/lib/types";

export const ROUND_LENGTH = 5;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildRound(pool: RetiredPlayer[]): RetiredPlayer[] {
  return shuffle(pool).slice(0, ROUND_LENGTH);
}
