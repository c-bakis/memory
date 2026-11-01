import type { GameResult, GameSettings, Player, Theme } from "../types/settings";
import { cardTemplate } from "../template";

let totalPairs = 0;

/**
 * Initializes the game using the settings saved in session storage.
 */
export function initGamePage(): void {
  const settings = getGameSettings();
  currentPlayer = settings.player;
  totalPairs = settings.boardSize / 2;
  createCards(settings.boardSize, settings.theme);
  console.log(settings);
  setupExitDialog();
}

/**
 * Retrieves the current game settings from session storage.
 *
 * @returns The settings saved for the current game.
 */
function getGameSettings(): GameSettings {
  return JSON.parse(sessionStorage.getItem("game-settings") ?? "{}");
}

/**
 * Connects the exit dialog buttons to their actions.
 */
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

/**
 * Navigates back to the settings page.
 */
function returnToHomePage(): void {
  window.location.href = "settings.html";
}

let cards: number[] = [];
let activeCard: HTMLButtonElement | null = null;
let isResolvingMismatch: boolean = false;
let currentPlayer: Player;

const scores: Record<Player, number> = {
  orange: 0,
  blue: 0,
};
const board = document.querySelector<HTMLDivElement>(".game-board");

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

/**
 * Creates and shuffles the cards for the selected board and theme.
 *
 * @param boardSize - Number of cards to create.
 * @param theme - Theme used to select each card image.
 */
function createCards(boardSize: number, theme: Theme): void {
  if (!board) return;
  board.innerHTML = "";
  for (let i = 0; i < boardSize / 2; i++) {
    for (let j = 0; j < 2; j++) {
      cards.push(pairIds[i]);
    }
  }
  shuffleCards();
  board.innerHTML = cards
    .map((id) => cardTemplate(id, cardImages[theme][id]))
    .join("");
}

/**
 * Randomizes the order of the cards.
 */
function shuffleCards(): void {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

board?.addEventListener("click", handleCardClick);

/**
 * Handles a board click and resolves a pair when two cards are selected.
 *
 * @param event - Click event dispatched from the game board.
 */
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

/**
 * Finds the game card containing the click target.
 *
 * @param event - Click event to inspect.
 * @returns The clicked card, or null if the click was outside a card.
 */
function getClickedCard(event: MouseEvent): HTMLButtonElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLButtonElement>(".game-card");
}

/**
 * Checks whether a card can currently be flipped.
 *
 * @param card - Card to check.
 * @returns True if the card can be flipped.
 */
function canFlipCard(card: HTMLButtonElement): boolean {
  return (
    !card.disabled &&
    !card.classList.contains("is-flipped") &&
    !card.classList.contains("is-unflipping") &&
    !isResolvingMismatch
  );
}

/**
 * Compares a pair and either awards a point or starts the mismatch flow.
 *
 * @param firstCard - First selected card.
 * @param secondCard - Second selected card.
 */
function resolveCards(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  if (compareCards(firstCard, secondCard)) {
    dismissCards(firstCard, secondCard);
    window.setTimeout(() => {
    addPointsToScore(currentPlayer, 1);
    }, 400);
    return;
  }

  hideMismatchedCards(firstCard, secondCard);
}

/**
 * Locks card selection while mismatched cards are shown before flipping back.
 *
 * @param firstCard - First mismatched card.
 * @param secondCard - Second mismatched card.
 */
function hideMismatchedCards(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  isResolvingMismatch = true;

  window.setTimeout(() => {
    flipCardsBack(firstCard, secondCard);
  }, 1000);
}

/**
 * Flips both mismatched cards back and waits for their transitions to finish.
 *
 * @param firstCard - First card to flip back.
 * @param secondCard - Second card to flip back.
 */
function flipCardsBack(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  let pendingTransitions = 0;
  const onCardFlippedBack = (): void => {
    pendingTransitions--;
    if (pendingTransitions === 0) completeMismatchResolution();
  };

  for (const card of [firstCard, secondCard]) {
    if (flipCardBack(card, onCardFlippedBack)) pendingTransitions++;
  }

  if (pendingTransitions === 0) completeMismatchResolution();
}

/**
 * Flips one card back and registers a callback for its transition completion.
 *
 * @param card - Card to flip back.
 * @param onFlippedBack - Callback invoked when the card's flip transition ends.
 * @returns True if the card has an inner element and the flip was started.
 */
function flipCardBack(
  card: HTMLButtonElement,
  onFlippedBack: () => void,
): boolean {
  const inner = card.querySelector<HTMLElement>(".game-card__inner");
  if (!inner) return false;

  const handleTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== inner || event.propertyName !== "transform") return;
    inner.removeEventListener("transitionend", handleTransitionEnd);
    card.classList.remove("is-unflipping");
    onFlippedBack();
  };

  inner.addEventListener("transitionend", handleTransitionEnd);
  card.classList.add("is-unflipping");
  card.classList.remove("is-flipped");
  return true;
}

/**
 * Ends mismatch resolution and switches to the next player.
 */
function completeMismatchResolution(): void {
  isResolvingMismatch = false;
  switchPlayer();
}

/**
 * Checks whether two cards represent the same pair.
 *
 * @param card1 - First card to compare.
 * @param card2 - Second card to compare.
 * @returns True if both cards have the same identifier.
 */
function compareCards(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): boolean {
  return card1.dataset.id === card2.dataset.id;
}

/**
 * Disables a matched pair so it cannot be selected again.
 *
 * @param card1 - First matched card.
 * @param card2 - Second matched card.
 */
function dismissCards(
  card1: HTMLButtonElement,
  card2: HTMLButtonElement,
): void {
  card1.disabled = true;
  card2.disabled = true;
}

/**
 * Adds points to a player's score and checks whether the game is complete.
 *
 * @param player - Player receiving the points.
 * @param points - Number of points to add.
 */
function addPointsToScore(player: Player, points: number): void {
  scores[player] += points;
  updateScoreDisplay(player);
  if (scores.orange + scores.blue === totalPairs) finishGame();
}

/**
 * Saves the final game result and navigates to the result page.
 */
function finishGame(): void {
  const settings = getGameSettings();
  const result: GameResult = {
    theme: settings.theme,
    startingPlayer: settings.player,
    scores,
  };
  sessionStorage.setItem("game-result", JSON.stringify(result));
  window.location.href = "result.html";
}

/**
 * Updates the displayed score for a player.
 *
 * @param player - Player whose score display should be updated.
 */
function updateScoreDisplay(player: Player): void {
  const scoreElement = document.getElementById(`${player}-score`);
  if (scoreElement) {
    scoreElement.textContent = scores[player].toString();
  }
}

/**
 * Changes the active player and updates the document state.
 */
function switchPlayer(): void {
  currentPlayer = currentPlayer === "orange" ? "blue" : "orange";
  document.body.dataset.player = currentPlayer;
}