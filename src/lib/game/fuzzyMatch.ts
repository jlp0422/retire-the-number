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

// First and last name alone should count — "Jordan" or "Michael" both
// clear "Michael Jordan" without needing every name spelled out.
function nameParts(fullName: string): string[] {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return [];
  return [parts[0], parts[parts.length - 1]];
}

export function isCorrectGuess(guess: string, player: RetiredPlayer): boolean {
  const normalizedGuess = normalize(guess);
  if (!normalizedGuess) return false;

  const candidates = [player.playerName, ...player.aliases, ...nameParts(player.playerName)];
  return candidates.some(
    (candidate) => distance(normalizedGuess, normalize(candidate)) <= MATCH_THRESHOLD
  );
}
