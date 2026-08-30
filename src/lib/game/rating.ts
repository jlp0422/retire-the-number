export const RATING_MIN = 1;
export const RATING_MAX = 10;
export const DEFAULT_USER_RATING = 5;

// Scaled down from chess Elo's 400, since our scale spans 9 points (1-10)
// rather than chess's ~thousands — keeps rating gaps meaningfully decisive.
const RATING_DIVISOR = 3;

// Bounds a single jersey's max swing to K_FACTOR (~0.6), so one round (5
// jerseys) can move a rating by roughly 3 points in the most extreme case.
const K_FACTOR = 0.6;

export function expectedScore(userRating: number, playerDifficulty: number): number {
  return 1 / (1 + 10 ** ((playerDifficulty - userRating) / RATING_DIVISOR));
}

export function clampRating(rating: number): number {
  return Math.min(RATING_MAX, Math.max(RATING_MIN, rating));
}

export function applyJerseyResult(
  currentUserRating: number,
  playerDifficulty: number,
  correct: boolean,
): number {
  const expected = expectedScore(currentUserRating, playerDifficulty);
  const actual = correct ? 1 : 0;
  return clampRating(currentUserRating + K_FACTOR * (actual - expected));
}

export function applyRoundResults(
  startingRating: number,
  results: readonly { player: { ratingScore: number }; correct: boolean }[],
): number {
  return results.reduce(
    (rating, r) => applyJerseyResult(rating, r.player.ratingScore, r.correct),
    startingRating,
  );
}
