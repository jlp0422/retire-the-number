import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { RetiredPlayer } from "../src/lib/types";

// Manual conversion, re-run by hand whenever data/players.csv is updated.
// No live/synced pipeline — see spec's "Data re-ingestion" decision.

const CSV_PATH = resolve(__dirname, "../data/players.csv");
const OUT_PATH = resolve(__dirname, "../src/data/players.json");

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header.trim()] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

function slugify(teamId: string, number: string, playerName: string): string {
  const playerSlug = playerName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${teamId.toLowerCase()}-${number}-${playerSlug}`;
}

const rows = parseCsv(readFileSync(CSV_PATH, "utf-8"));

const players: RetiredPlayer[] = rows.map((row) => ({
  id: slugify(row.teamId, row.number, row.playerName),
  playerName: row.playerName,
  aliases: row.aliases ? row.aliases.split(";").map((a) => a.trim()).filter(Boolean) : [],
  team: row.team,
  teamId: row.teamId,
  league: row.league,
  number: row.number,
  era: row.era,
  imageFile: row.imageFile,
  difficulty: row.difficulty as RetiredPlayer["difficulty"],
  ratingScore: Number(row.ratingScore),
}));

players.forEach((p) => {
  if (!Number.isInteger(p.ratingScore) || p.ratingScore < 1 || p.ratingScore > 10) {
    throw new Error(`${p.id}: ratingScore must be an integer 1-10, got "${p.ratingScore}"`);
  }
});

writeFileSync(OUT_PATH, JSON.stringify(players, null, 2) + "\n");
console.log(`Wrote ${players.length} players to ${OUT_PATH}`);
