import { getSelectedSettings } from "../state/settingsState";
import { updateSettingsPreview } from "../ui/settingsView";

export function initSettingsPage(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );

  inputs.forEach((input) => {
    input.addEventListener("change", updateSettingsPreview);
  });

  updateSettingsPreview();

  const saveButton = document.querySelector<HTMLButtonElement>("#save-btn");

  saveButton?.addEventListener("click", () => {
    const settings = getSelectedSettings();

    sessionStorage.setItem("game-settings", JSON.stringify(settings));
    window.location.href = "game.html";
  });
}