import { describe, expect, it } from "vitest";
import { applyJerseyResult, applyRoundResults, expectedScore } from "./rating";

describe("expectedScore", () => {
  it("is 0.5 for an evenly matched user and player", () => {
    expect(expectedScore(5, 5)).toBeCloseTo(0.5);
  });

  it("is low when the player is much harder than the user", () => {
    expect(expectedScore(5, 10)).toBeLessThan(0.1);
  });

  it("is high when the player is much easier than the user", () => {
    expect(expectedScore(5, 1)).toBeGreaterThan(0.9);
  });
});

describe("applyJerseyResult", () => {
  it("increases rating more for a correct guess against a harder player", () => {
    const vsHarder = applyJerseyResult(5, 8, true) - 5;
    const vsEven = applyJerseyResult(5, 5, true) - 5;
    expect(vsHarder).toBeGreaterThan(vsEven);
  });

  it("decreases rating more for a missed guess against an easier player", () => {
    const missEasy = 5 - applyJerseyResult(5, 2, false);
    const missHarder = 5 - applyJerseyResult(5, 8, false);
    expect(missEasy).toBeGreaterThan(missHarder);
  });

  it("clamps at the floor of 1", () => {
    expect(applyJerseyResult(1, 1, false)).toBe(1);
  });

  it("clamps at the ceiling of 10", () => {
    expect(applyJerseyResult(10, 10, true)).toBe(10);
  });
});

describe("applyRoundResults", () => {
  it("matches manually chaining applyJerseyResult in order", () => {
    const results = [
      { player: { ratingScore: 3 }, correct: true },
      { player: { ratingScore: 8 }, correct: false },
      { player: { ratingScore: 5 }, correct: true },
    ];

    const expected = results.reduce(
      (rating, r) => applyJerseyResult(rating, r.player.ratingScore, r.correct),
      5,
    );

    expect(applyRoundResults(5, results)).toBe(expected);
  });

  it("returns the starting rating unchanged for an empty round", () => {
    expect(applyRoundResults(5, [])).toBe(5);
  });
});
