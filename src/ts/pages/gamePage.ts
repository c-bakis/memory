import type { GameSettings } from "../types/settings";

function addPoints(): void {
    console.log("Points added!");
}

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

let cards: number[] = [];
let activeCard: HTMLButtonElement | null = null;
const board = document.querySelector<HTMLDivElement>(".game-board");

const cardTemplate = (id: number) => {
  return `
        <button data-id="card-${id}" class="game-card" aria-label="Card">
                        <span class="game-card__inner">
                    <span class="game-card__face game-card__face--back"></span>
                    <span class="game-card__face game-card__face--front"></span>
                </span>
        </button>
        `;
}
const pairIds: number[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
]

function createCards(boardSize: number): void {
    if (!board) return;
    board.innerHTML = "";
    for(let i = 0; i < boardSize / 2; i++) {
      for(let j = 0; j < 2; j++) {
        cards.push(pairIds[i]);
      }
    }
    shuffleCards();
    board.innerHTML = cards.map(cardTemplate).join("");
}

function shuffleCards(): void {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

board?.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLButtonElement>(".game-card");
  if (!card || card === activeCard) return;
  if (activeCard) {
    if (compareCards(activeCard, card)) {
        console.log("Cards match!");
        addPoints();
        dismissCards(activeCard, card);
        activeCard = null;
    } else {
        console.log("Cards do not match!");
        activeCard = null;
    }
  } else {
      activeCard = card;
  }
});

function compareCards(card1: HTMLButtonElement, card2: HTMLButtonElement): boolean {
    return card1.dataset.id === card2.dataset.id;
}

function dismissCards(card1: HTMLButtonElement, card2: HTMLButtonElement): void {
    card1.disabled = true;
    card2.disabled = true;
}