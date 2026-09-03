export interface RetiredPlayer {
  id: string;
  playerName: string;
  aliases: string[];
  team: string;
  teamId: string;
  league: string;
  number: string;
  era: string;
  imageFile: string;
  difficulty: "easy" | "medium" | "hard";
  ratingScore: number;
}
