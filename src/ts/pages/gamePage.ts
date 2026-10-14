import type { GameSettings, Theme } from "../types/settings";

function addPoints(): void {
  console.log("Points added!");
}

export function initGamePage(): void {
  const settings = getGameSettings();
  createCards(settings.boardSize, settings.theme);
  console.log(settings);
  setupExitDialog();
}

function getGameSettings(): GameSettings {
  return JSON.parse(sessionStorage.getItem("game-settings") ?? "{}");
}

function setupExitDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>("#exit-dialog");
  const exitButton =
    document.querySelector<HTMLButtonElement>(".game-header__exit");
  const confirmButton =
    document.querySelector<HTMLButtonElement>("#exit-confirm");
  const cancelButton =
    document.querySelector<HTMLButtonElement>("#exit-cancel");

  exitButton?.addEventListener("click", () => dialog?.showModal());
  cancelButton?.addEventListener("click", () => dialog?.close());
  confirmButton?.addEventListener("click", returnToHomePage);
}

function returnToHomePage(): void {
  window.location.href = "settings.html";
}

let cards: number[] = [];
let activeCard: HTMLButtonElement | null = null;
let isResolvingMismatch: boolean = false;
const board = document.querySelector<HTMLDivElement>(".game-board");

const cardTemplate = (id: number, theme: Theme) => {
  return `
        <button data-id="card-${id}" class="game-card" aria-label="Card">
                        <span class="game-card__inner">
                    <span class="game-card__face game-card__face--back"></span>
                    <span class="game-card__face game-card__face--front" style="background-image: url('${cardImages[theme][id]}')"></span>
                </span>
        </button>
        `;
};
const pairIds: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];

const cardImages: Record<Theme, Record<number, string>> = {
  "code-vibes": {
    1: "./assets/img/code-theme/angular.svg",
    2: "./assets/img/code-theme/vue.svg",
    3: "./assets/img/code-theme/css.svg",
    4: "./assets/img/code-theme/django.svg",
    5: "./assets/img/code-theme/firebase.svg",
    6: "./assets/img/code-theme/git.svg",
    7: "./assets/img/code-theme/github.svg",
    8: "./assets/img/code-theme/html.svg",
    9: "./assets/img/code-theme/js.svg",
    10: "./assets/img/code-theme/node.svg",
    11: "./assets/img/code-theme/pc _rot.svg",
    12: "./assets/img/code-theme/python.svg",
    13: "./assets/img/code-theme/react.svg",
    14: "./assets/img/code-theme/sass.svg",
    15: "./assets/img/code-theme/sql.svg",
    16: "./assets/img/code-theme/terminal.svg",
    17: "./assets/img/code-theme/ts.svg",
    18: "./assets/img/code-theme/vscode.svg",
  },
  gaming: {
    1: "./assets/img/game-theme/Asset 3@2x 1.svg",
    2: "./assets/img/game-theme/Asset 4@2x 1.svg",
    3: "./assets/img/game-theme/Asset 5@2x 1.svg",
    4: "./assets/img/game-theme/Asset 6@2x 1.svg",
    5: "./assets/img/game-theme/Asset 8@2x 1.svg",
    6: "./assets/img/game-theme/Asset 8@2x 2.svg",
    7: "./assets/img/game-theme/Asset 9@2x 1.svg",
    8: "./assets/img/game-theme/play button@2x 1.svg",
    9: "./assets/img/game-theme/Asset 10@2x 1.svg",
    10: "./assets/img/game-theme/Asset 11@2x 1.svg",
    11: "./assets/img/game-theme/Asset 12@2x 1.svg",
    12: "./assets/img/game-theme/Asset 13@2x 1.svg",
    13: "./assets/img/game-theme/Asset 14@2x 1.svg",
    14: "./assets/img/game-theme/Asset 15@2x 1.svg",
    15: "./assets/img/game-theme/Asset 16@2x 1.svg",
    16: "./assets/img/game-theme/Asset 17@2x 1.svg",
    17: "./assets/img/game-theme/Asset 18@2x 1.svg",
    18: "./assets/img/game-theme/Asset 19@2x 1.svg",
  },
};

function createCards(boardSize: number, theme: Theme): void {
  if (!board) return;
  board.innerHTML = "";
  for (let i = 0; i < boardSize / 2; i++) {
    for (let j = 0; j < 2; j++) {
      cards.push(pairIds[i]);
    }
  }
  shuffleCards();
  board.innerHTML = cards.map((id) => cardTemplate(id, theme)).join("");
}

function shuffleCards(): void {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

board?.addEventListener("click", handleCardClick);

function handleCardClick(event: MouseEvent): void {
  const card = getClickedCard(event);
  if (!card || !canFlipCard(card)) return;
  card.classList.add("is-flipped");
  if (!activeCard) {
    activeCard = card;
    return;
  }
  const firstCard = activeCard;
  activeCard = null;
  resolveCards(firstCard, card);
}

function getClickedCard(event: MouseEvent): HTMLButtonElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLButtonElement>(".game-card");
}

function canFlipCard(card: HTMLButtonElement): boolean {
  return (
    !card.disabled &&
    !card.classList.contains("is-flipped") &&
    !isResolvingMismatch
  );
}

function resolveCards(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  if (compareCards(firstCard, secondCard)) {
    addPoints();
    dismissCards(firstCard, secondCard);
    return;
  }

  hideMismatchedCards(firstCard, secondCard);
}

function hideMismatchedCards(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  isResolvingMismatch = true;

  window.setTimeout(() => {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");
    isResolvingMismatch = false;
  }, 1000);
}

function compareCards(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.id === card2.dataset.id;
}

function dismissCards(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): void {
  card1.disabled = true;
  card2.disabled = true;
}
