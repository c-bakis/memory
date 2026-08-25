
import "./styles/style.scss";
import { initSettingsPage } from "./ts/pages/settingsPage";
// import { initGamePage } from "./pages/gamePage";
// import { initResultPage } from "./pages/resultPage";

const page = document.body.dataset.page;

if (page === "settings") {
  initSettingsPage();
}

// if (page === "game") {
//   initGamePage();
// }

// if (page === "result") {
//   initResultPage();
// }