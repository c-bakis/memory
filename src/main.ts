
import "./styles/style.scss";
import { initSettingsPage } from "./ts/pages/settingsPage";
import { initGamePage } from "./ts/pages/gamePage";
import { initResultPage } from "./ts/pages/resultPage";

const page = document.body.dataset.page;

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

if (page === "settings") {
  initSettingsPage();
}

if (page === "game") {
  initGamePage();
}

if (page === "result") {
  initResultPage();
}

const settings = JSON.parse(
  sessionStorage.getItem("game-settings") ?? "{}",
);

if (page === "game") {
  document.body.dataset.theme = settings.theme ?? "code-vibes";
  document.body.dataset.player = settings.player ?? "orange";
}