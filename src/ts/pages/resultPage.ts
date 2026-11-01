import type { GameResult, Player } from "../types/settings";
import {
  gameOverTemplate,
  getResultTemplate,
  missingResultTemplate,
  type ResultOutcome,
} from "../template";

const gameOverDuration = 2000;
const resultContainer = document.querySelector<HTMLElement>("#result-content");

/**
 * Initializes the result page from the saved game result.
 */
export function initResultPage(): void {
  document.body.dataset.theme = "code-vibes";
  const result = getGameResult();
  if (!resultContainer) return;
  if (!result) {
    renderMissingResult();
    return;
  }
  document.body.dataset.theme = result.theme;
  renderResult(result);
}

/**
 * Reads and validates the saved game result from session storage.
 *
 * @returns The saved game result, or null if it is missing or invalid.
 */
function getGameResult(): GameResult | null {
  const savedResult = sessionStorage.getItem("game-result");
  if (!savedResult) return null;
  try {
    return validateGameResult(JSON.parse(savedResult));
  } catch (error) {
    console.error("Could not read the saved game result.", error);
    return null;
  }
}

/**
 * Checks that an unknown value has the expected game result structure.
 *
 * @param value - Value to validate.
 * @returns The validated game result, or null if the value is invalid.
 */
function validateGameResult(value: unknown): GameResult | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<GameResult>;
  if (!isTheme(candidate.theme) || !isScore(candidate.scores?.orange))
    return null;
  if (!isScore(candidate.scores?.blue)) return null;
  if (!isPlayer(candidate.startingPlayer)) return null;
  return {
    theme: candidate.theme,
    startingPlayer: candidate.startingPlayer,
    scores: candidate.scores,
  };
}

/**
 * Checks whether a value is a supported game theme.
 *
 * @param value - Value to check.
 * @returns True if the value is a supported theme.
 */
function isTheme(value: unknown): value is GameResult["theme"] {
  return value === "code-vibes" || value === "gaming";
}

/**
 * Checks whether a value is a finite, non-negative score.
 *
 * @param value - Value to check.
 * @returns True if the value is a valid score.
 */
function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/**
 * Checks whether a value identifies a supported player.
 *
 * @param value - Value to check.
 * @returns True if the value is a supported player.
 */
function isPlayer(value: unknown): value is Player {
  return value === "orange" || value === "blue";
}

/**
 * Shows the game-over screen, then renders the final outcome.
 *
 * @param result - Final scores and settings for the completed game.
 */
function renderResult(result: GameResult): void {
  const outcome = getOutcome(result);
  if (!resultContainer) return;
  resultContainer.innerHTML = gameOverTemplate(result);
  window.setTimeout(() => {
    resultContainer.innerHTML = getResultTemplate(result, outcome);
    setupBackButton();
  }, gameOverDuration);
}

/**
 * Determines the winner or whether the game ended in a draw.
 *
 * @param result - Final game result used to determine the outcome.
 * @returns The winning player or "draw" when scores are tied.
 */
function getOutcome(result: GameResult): ResultOutcome {
  const { scores } = result;
  if (scores.orange === scores.blue) return "draw";
  return scores.orange > scores.blue ? "orange" : "blue";
}

/**
 * Displays a fallback message when no valid game result is available.
 */
function renderMissingResult(): void {
  if (!resultContainer) return;
  resultContainer.innerHTML = missingResultTemplate();
}

/**
 * Removes the saved game result when the player returns to the start.
 */
function setupBackButton(): void {
  const backButton =
    resultContainer?.querySelector<HTMLAnchorElement>(".result__back");
  backButton?.addEventListener("click", () => {
    sessionStorage.removeItem("game-result");
  });
}
