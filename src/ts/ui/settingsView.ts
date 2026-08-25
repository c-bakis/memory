export function updateSettingsPreview(): void {
  const selectedTheme = document.querySelector<HTMLOutputElement>(
    "#selected-theme",
  );
  const selectedPlayer = document.querySelector<HTMLOutputElement>(
    "#selected-player",
  );
  const selectedBoardSize = document.querySelector<HTMLOutputElement>(
    "#selected-board-size",
  );

  const theme = document.querySelector<HTMLInputElement>(
    'input[name="theme"]:checked',
  );
  const player = document.querySelector<HTMLInputElement>(
    'input[name="player"]:checked',
  );
  const boardSize = document.querySelector<HTMLInputElement>(
    'input[name="board-size"]:checked',
  );

  if (selectedTheme && theme) {
    selectedTheme.textContent =
      theme.value === "code-vibes" ? "Code vibes" : "Gaming";
  }

  if (selectedPlayer && player) {
    selectedPlayer.textContent =
      player.value === "orange" ? "Orange" : "Blue";
  }

  if (selectedBoardSize && boardSize) {
    selectedBoardSize.textContent = `${boardSize.value} Cards`;
  }
}