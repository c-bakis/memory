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
  const previewImage = document.querySelector<HTMLImageElement>(
    ".settings__preview-img--theme",
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

  if (previewImage && theme) {
    previewImage.src = theme.value === "code-vibes" ? "./assets/img/code-theme/theme.svg" : "./assets/img/game-theme/theme.svg";
    previewImage.alt = theme.value === "code-vibes" ? "Code vibes theme preview" : "Gaming theme preview";
  }
}