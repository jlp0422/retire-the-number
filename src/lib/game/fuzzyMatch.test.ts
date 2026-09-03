import { describe, expect, it } from "vitest";
import { isCorrectGuess } from "./fuzzyMatch";
import type { RetiredPlayer } from "@/lib/types";

const jordan: RetiredPlayer = {
  id: "chi-23-michael-jordan",
  playerName: "Michael Jordan",
  aliases: ["Michael Jordan", "MJ"],
  team: "Bulls",
  teamId: "CHI",
  league: "NBA",
  number: "23",
  era: "1984-1998",
  imageFile: "chi-23-michael-jordan.jpg",
  difficulty: "easy",
  ratingScore: 2,
};

const oneal: RetiredPlayer = {
  id: "lal-34-shaquille-oneal",
  playerName: "Shaquille O'Neal",
  aliases: ["Shaquille O'Neal", "Shaq"],
  team: "Lakers",
  teamId: "LAL",
  league: "NBA",
  number: "34",
  era: "1996-2004",
  imageFile: "lal-34-shaquille-oneal.jpg",
  difficulty: "hard",
  ratingScore: 8,
};

const yao: RetiredPlayer = {
  id: "hou-11-yao-ming",
  playerName: "Yao Ming",
  aliases: ["Yao Ming", "Yao"],
  team: "Rockets",
  teamId: "HOU",
  league: "NBA",
  number: "11",
  era: "2002-2011",
  imageFile: "hou-11-yao-ming.png",
  difficulty: "medium",
  ratingScore: 5,
};

describe("isCorrectGuess", () => {
  it("accepts the full name", () => {
    expect(isCorrectGuess("Michael Jordan", jordan)).toBe(true);
  });

  it("accepts a known alias/nickname", () => {
    expect(isCorrectGuess("MJ", jordan)).toBe(true);
    expect(isCorrectGuess("Shaq", oneal)).toBe(true);
  });

  it("accepts first name only", () => {
    expect(isCorrectGuess("Michael", jordan)).toBe(true);
    expect(isCorrectGuess("Shaquille", oneal)).toBe(true);
  });

  it("accepts last name only", () => {
    expect(isCorrectGuess("Jordan", jordan)).toBe(true);
    expect(isCorrectGuess("O'Neal", oneal)).toBe(true);
  });

  it("accepts last name with punctuation stripped", () => {
    expect(isCorrectGuess("ONeal", oneal)).toBe(true);
  });

  it("is not fooled by a single-word full name splitting into duplicate parts", () => {
    // "Yao" is both the alias and the derived first-name part; should still match.
    expect(isCorrectGuess("Yao", yao)).toBe(true);
    expect(isCorrectGuess("Ming", yao)).toBe(true);
  });

  it("rejects an unrelated guess", () => {
    expect(isCorrectGuess("LeBron", jordan)).toBe(false);
  });

  it("rejects an empty guess", () => {
    expect(isCorrectGuess("   ", jordan)).toBe(false);
  });
});
