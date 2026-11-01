import type { GameResult, Player } from "./types/settings";

export type ResultOutcome = Player | "draw";

export function cardTemplate(id: number, image: string): string {
  return `
        <button data-id="card-${id}" class="game-card" aria-label="Card">
                        <span class="game-card__inner">
                    <span class="game-card__face game-card__face--back"></span>
                    <span class="game-card__face game-card__face--front" style="background-image: url('${image}')"></span>
                </span>
        </button>
        `;
}

export function getResultTemplate(
  result: GameResult,
  outcome: ResultOutcome,
): string {
  if (outcome === "draw") return drawResultTemplate();
  if (outcome === "orange") return orangeWinnerTemplate();
  return blueWinnerTemplate();
}

export function gameOverTemplate(result: GameResult): string {
  return `
    <section class="result__card result__card--game-over" aria-labelledby="result-title">
      <h1 class="result__title result__title-gameover" id="result-title">Game over</h1>
      ${scoreTemplate(result)}
    </section>
  `;
}

export function missingResultTemplate(): string {
  return `
    <section class="result__card">
      <h1 class="result__title">No game result found</h1>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function orangeWinnerTemplate(): string {
  return `
    ${winnerConfettiTemplate()}
    <section class="result__card result__card--orange" aria-labelledby="result-title">
      <div class="result__outcome">
        <h2 class="result__subtitle">The winner is</h2>
        <h1 class="result__title result__outcome--orange result__title--player">Orange Player</h1>
        <span
          class="result__medal result__medal--orange"
          aria-hidden="true"
        ></span>
      </div>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function blueWinnerTemplate(): string {
  return `
    ${winnerConfettiTemplate()}
    <section class="result__card result__card--blue" aria-labelledby="result-title">
      <div class="result__outcome">
        <h2 class="result__subtitle">The winner is</h2>
        <h1 class="result__title result__outcome--blue result__title--player">Blue Player</h1>
        <span
          class="result__medal result__medal--blue"
          aria-hidden="true"
        ></span>
      </div>
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
        <span class="result__draw-icon" aria-hidden="true">
          <span class="result__draw-icon-shape"></span>
        </span>
      </div>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

function winnerConfettiTemplate(): string {
  return `
<div class="result__confetti" aria-hidden="true"></div>
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
