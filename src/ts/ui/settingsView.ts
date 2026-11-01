/**
 * Updates the selected-settings labels and theme preview from the form inputs.
 */
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

  if (selectedTheme) {
    selectedTheme.textContent = theme
      ? theme.value === "code-vibes"
        ? "Code vibes"
        : "Gaming"
      : "Game theme";
  }

  if (selectedPlayer) {
    selectedPlayer.textContent = player
      ? player.value === "orange"
        ? "Orange"
        : "Blue"
      : "Player";
  }

  if (selectedBoardSize) {
    selectedBoardSize.textContent = boardSize
      ? `${boardSize.value} Cards`
      : "Board Size";
  }

  if (previewImage) {
    if (theme) {
      previewImage.src =
        theme.value === "code-vibes"
          ? "./assets/img/code-theme/theme.svg"
          : "./assets/img/game-theme/theme.svg";
      previewImage.alt =
        theme.value === "code-vibes"
          ? "Code vibes theme preview"
          : "Gaming theme preview";
    } else {
      previewImage.src = "./assets/img/code-theme/theme.svg";
      previewImage.alt = "Theme preview";
    }
  }
}