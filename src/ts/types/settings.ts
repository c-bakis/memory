export type Theme = "code-vibes" | "gaming";
export type Player = "orange" | "blue";
export type BoardSize = 16 | 24 | 36;

export interface GameSettings {
	theme: Theme;
	player: Player;
	boardSize: BoardSize;
}

export interface GameResult {
	theme: Theme;
	startingPlayer: Player;
	scores: Record<Player, number>;
}
