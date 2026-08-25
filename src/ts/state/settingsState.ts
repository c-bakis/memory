
import type { GameSettings, Theme, Player, BoardSize } from "../types/settings";

export function getSelectedSettings(): GameSettings {
  const theme = document.querySelector<HTMLInputElement>(
    'input[name="theme"]:checked',
  )?.value as Theme;

  const player = document.querySelector<HTMLInputElement>(
    'input[name="player"]:checked',
  )?.value as Player;

  const boardSize = Number(
    document.querySelector<HTMLInputElement>(
      'input[name="board-size"]:checked',
    )?.value,
  ) as BoardSize;

  return {
    theme,
    player,
    boardSize,
  };
}