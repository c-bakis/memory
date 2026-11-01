import type { GameResult, Player } from "../types/settings";
import {
  gameOverTemplate,
  getResultTemplate,
  missingResultTemplate,
  type ResultOutcome,
} from "../template";

const gameOverDuration = 2000;
const resultContainer = document.querySelector<HTMLElement>("#result-content");

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

function isTheme(value: unknown): value is GameResult["theme"] {
  return value === "code-vibes" || value === "gaming";
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPlayer(value: unknown): value is Player {
  return value === "orange" || value === "blue";
}

function renderResult(result: GameResult): void {
  const outcome = getOutcome(result);
  if (!resultContainer) return;
  resultContainer.innerHTML = gameOverTemplate(result);
  window.setTimeout(() => {
    resultContainer.innerHTML = getResultTemplate(result, outcome);
    setupBackButton();
  }, gameOverDuration);
}

function getOutcome(result: GameResult): ResultOutcome {
  const { scores } = result;
  if (scores.orange === scores.blue) return "draw";
  return scores.orange > scores.blue ? "orange" : "blue";
}

function renderMissingResult(): void {
  if (!resultContainer) return;
  resultContainer.innerHTML = missingResultTemplate();
}

function setupBackButton(): void {
  const backButton =
    resultContainer?.querySelector<HTMLAnchorElement>(".result__back");
  backButton?.addEventListener("click", () => {
    sessionStorage.removeItem("game-result");
  });
}
