/** Available visual themes for the game. */
export type Theme = "code-vibes" | "gaming";

/** Players who can take turns in a game. */
export type Player = "orange" | "blue";

/** Supported number of cards on the game board. */
export type BoardSize = 16 | 24 | 36;

/** User-selected options used to configure a game. */
export interface GameSettings {
	/** Theme used to display the game. */
	theme: Theme;
	/** Player who takes the first turn. */
	player: Player;
	/** Number of cards on the board. */
	boardSize: BoardSize;
}

/** Final settings and scores for a completed game. */
export interface GameResult {
	/** Theme used during the game. */
	theme: Theme;
	/** Player who started the game. */
	startingPlayer: Player;
	/** Final score for each player. */
	scores: Record<Player, number>;
}
