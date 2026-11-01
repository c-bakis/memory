import type { GameResult, Player } from "./types/settings";

/** Possible outcomes displayed on the result page. */
export type ResultOutcome = Player | "draw";

/**
 * Creates the HTML for a single memory card.
 *
 * @param id - Identifier shared by the two cards in a pair.
 * @param image - Image URL displayed on the card's front.
 * @returns HTML markup for the card.
 */
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

/**
 * Creates the result-page HTML for the given game outcome.
 *
 * @param result - Final scores and settings for the completed game.
 * @param outcome - Winning player or draw.
 * @returns HTML markup for the corresponding outcome.
 */
export function getResultTemplate(
  result: GameResult,
  outcome: ResultOutcome,
): string {
  if (outcome === "draw") return drawResultTemplate();
  if (outcome === "orange") return orangeWinnerTemplate();
  return blueWinnerTemplate();
}

/**
 * Creates the temporary game-over screen with the final scores.
 *
 * @param result - Final scores and settings for the completed game.
 * @returns HTML markup for the game-over screen.
 */
export function gameOverTemplate(result: GameResult): string {
  return `
    <section class="result__card result__card--game-over" aria-labelledby="result-title">
      <h1 class="result__title result__title-gameover" id="result-title">Game over</h1>
      ${scoreTemplate(result)}
    </section>
  `;
}

/**
 * Creates fallback HTML for when no game result is available.
 *
 * @returns HTML markup with a link back to the settings page.
 */
export function missingResultTemplate(): string {
  return `
    <section class="result__card">
      <h1 class="result__title">No game result found</h1>
      <a class="game-action-button result__back" href="settings.html">Back to start</a>
    </section>
  `;
}

/**
 * Creates the result-page HTML for an orange-player victory.
 *
 * @returns HTML markup for the orange-player victory.
 */
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

/**
 * Creates the result-page HTML for a blue-player victory.
 *
 * @returns HTML markup for the blue-player victory.
 */
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

/**
 * Creates the result-page HTML for a draw.
 *
 * @returns HTML markup for a draw.
 */
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

/**
 * Creates the decorative confetti markup used on winner screens.
 *
 * @returns HTML markup for the confetti decoration.
 */
function winnerConfettiTemplate(): string {
  return `
<div class="result__confetti" aria-hidden="true"></div>
  `;
}

/**
 * Creates the scoreboard markup for a completed game.
 *
 * @param result - Final scores and settings for the completed game.
 * @returns HTML markup displaying both players' scores.
 */
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
