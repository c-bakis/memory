import type { GameResult, Player } from "../types/settings";

type ResultOutcome = Player | "draw" | "game-over";

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
  resultContainer.innerHTML = getResultTemplate(result, outcome);
  setupBackButton();
}

function getOutcome(result: GameResult): ResultOutcome {
  const { scores, startingPlayer } = result;
  if (scores.orange === scores.blue) return "draw";
  if (scores[startingPlayer] < scores[getOtherPlayer(startingPlayer)]) {
    return "game-over";
  }
  return startingPlayer;
}

function getOtherPlayer(player: Player): Player {
  return player === "orange" ? "blue" : "orange";
}

function getResultTemplate(result: GameResult, outcome: ResultOutcome): string {
  if (outcome === "game-over") return gameOverTemplate(result);
  if (outcome === "draw") return drawResultTemplate();
  if (outcome === "orange") return orangeWinnerTemplate(result);
  return blueWinnerTemplate(result);
}

function gameOverTemplate(result: GameResult): string {
  return `
    <section class="result__card result__card--game-over" aria-labelledby="result-title">
      <h1 class="result__title result__title-gameover" id="result-title">Game over</h1>
      <h2 class="result__subtitle">Final score</h2>
      ${scoreTemplate(result)}
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function orangeWinnerTemplate(result: GameResult): string {
  return `
    ${winnerConfettiTemplate()}
    <section class="result__card result__card--orange" aria-labelledby="result-title">
      <div class="result__outcome">
        <h2 class="result__subtitle">The winner is</h2>
        <h1 class="result__title result__outcome--orange result__title--player result__title--uppercase">Orange player</h1>
        <span
          class="result__medal result__medal--orange"
          aria-hidden="true"
        ></span>      </div>
      ${scoreTemplate(result)}
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function blueWinnerTemplate(result: GameResult): string {
  return `
    ${winnerConfettiTemplate()}
    <section class="result__card result__card--blue" aria-labelledby="result-title">
      <div class="result__outcome">
        <h2 class="result__subtitle">The winner is</h2>
        <h1 class="result__title result__outcome--blue result__title--player result__title--uppercase">Blue player</h1>
        <span
          class="result__medal result__medal--blue"
          aria-hidden="true"
        ></span>      </div>
      ${scoreTemplate(result)}
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function drawResultTemplate(): string {
  return `
    <section class="result__card result__card--draw" aria-labelledby="result-title">
      <div class="result__outcome">
        <h2 class="result__subtitle">It's a</h2>
        <h1 class="result__title result__title-gameover result__title--uppercase">draw</h1>
        <img class="result__draw-icon" src="/assets/img/code-theme/Neuer%20Ordner/Scale_Icon.png" alt="" />
      </div>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function winnerConfettiTemplate(): string {
  return `
<picture>
  <source
    media="(max-width: 1440px)"
    srcset="/assets/img/code-theme/Neuer%20Ordner/Confetti.png"
  />
  <img
    class="result__confetti"
    src="/assets/img/code-theme/Neuer%20Ordner/Confetti%20(1).png"
    alt=""
  />
</picture>
  `;
}

function scoreTemplate(result: GameResult): string {
  return `
    <section class="scoreboard" aria-label="Final scores">
      <div class="scoreboard__player scoreboard__player--blue">
        <dl><dt>Blue</dt><dd><output>${result.scores.blue}</output></dd></dl>
      </div>
      <div class="scoreboard__player scoreboard__player--orange">
        <dl><dt>Orange</dt><dd><output>${result.scores.orange}</output></dd></dl>
      </div>
    </section>
  `;
}

function renderMissingResult(): void {
  if (!resultContainer) return;
  resultContainer.innerHTML = `
    <section class="result__card">
      <h1 class="result__title">No game result found</h1>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function setupBackButton(): void {
  const backButton =
    resultContainer?.querySelector<HTMLAnchorElement>(".result__back");
  backButton?.addEventListener("click", () => {
    sessionStorage.removeItem("game-result");
  });
}
