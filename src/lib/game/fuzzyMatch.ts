import { distance } from "fastest-levenshtein";
import type { RetiredPlayer } from "@/lib/types";

const MATCH_THRESHOLD = 2;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function isCorrectGuess(guess: string, player: RetiredPlayer): boolean {
  const normalizedGuess = normalize(guess);
  if (!normalizedGuess) return false;

  const candidates = [player.playerName, ...player.aliases];
  return candidates.some(
    (candidate) => distance(normalizedGuess, normalize(candidate)) <= MATCH_THRESHOLD
  );
}
