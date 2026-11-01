import { getSelectedSettings } from "../state/settingsState";
import { updateSettingsPreview } from "../ui/settingsView";

export function initSettingsPage(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );
  const committedSelections = new Map<string, string>();

  inputs.forEach((input) => {
    if (input.checked) committedSelections.set(input.name, input.value);
  });

  inputs.forEach((input) => {
    const label = input.closest("label");
    label?.addEventListener("pointerenter", () => {
      input.checked = true;
      updateSettingsPreview();
    });
    label?.addEventListener("pointerleave", restoreCommittedSelections);

    const commitSelection = () => {
      if (input.checked) {
        committedSelections.set(input.name, input.value);
        updateSettingsPreview();
      }
    };

    input.addEventListener("change", commitSelection);
    input.addEventListener("click", commitSelection);
  });

  function restoreCommittedSelections(): void {
    inputs.forEach((input) => {
      input.checked = committedSelections.get(input.name) === input.value;
    });
    updateSettingsPreview();
  }

  updateSettingsPreview();

  const saveButton = document.querySelector<HTMLButtonElement>("#save-btn");

  saveButton?.addEventListener("click", () => {
    const settings = getSelectedSettings();

    sessionStorage.setItem("game-settings", JSON.stringify(settings));
    window.location.href = "game.html";
  });
}