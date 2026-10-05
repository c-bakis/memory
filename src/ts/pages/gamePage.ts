import type { GameSettings } from "../types/settings";

export function initGamePage(): void {
    const settings: GameSettings = JSON.parse(
        sessionStorage.getItem("game-settings") ?? "{}"
    )
    createCards(settings.boardSize);
    console.log(settings);
  const dialog = document.querySelector<HTMLDialogElement>("#exit-dialog");
  const exitButton =
    document.querySelector<HTMLButtonElement>(".game-header__exit");
  const confirmButton =
    document.querySelector<HTMLButtonElement>("#exit-confirm");
  const cancelButton = document.querySelector<HTMLButtonElement>("#exit-cancel");

  exitButton?.addEventListener("click", () => dialog?.showModal());
  cancelButton?.addEventListener("click", () => dialog?.close());
  confirmButton?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function createCards(boardSize: number): void {
    const board = document.querySelector<HTMLDivElement>(".game-board");
    if (!board) return;
    board.innerHTML = "";
    for(let i = 0; i < boardSize; i++) {
        const card = `
        <button class="game-card" aria-label="Card">
                        <span class="game-card__inner">
                    <span class="game-card__face game-card__face--back"></span>
                    <span class="game-card__face game-card__face--front"></span>
                </span>
        </button>
        `;
        board.innerHTML += card;
    }

}