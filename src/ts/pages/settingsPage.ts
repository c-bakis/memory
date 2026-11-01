import { getSelectedSettings } from "../state/settingsState";
import { updateSettingsPreview } from "../ui/settingsView";

/**
 * Initializes settings selection, preview updates, and game launch behavior.
 */
export function initSettingsPage(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );
  const committedSelections = new Map<string, string>();
  const saveButton = document.querySelector<HTMLButtonElement>("#save-btn");

  /**
   * Enables the save button once all required settings are selected.
   */
  function updateSaveButton(): void {
    saveButton?.toggleAttribute(
      "disabled",
      !["theme", "player", "board-size"].every((name) =>
        committedSelections.has(name),
      ),
    );
  }

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
        updateSaveButton();
        updateSettingsPreview();
      }
    };

    input.addEventListener("change", commitSelection);
    input.addEventListener("click", commitSelection);
  });

  /**
   * Restores the last committed settings after leaving a previewed option.
   */
  function restoreCommittedSelections(): void {
    inputs.forEach((input) => {
      input.checked = committedSelections.get(input.name) === input.value;
    });
    updateSettingsPreview();
  }

  updateSaveButton();
  updateSettingsPreview();

  saveButton?.addEventListener("click", () => {
    const settings = getSelectedSettings();

    sessionStorage.setItem("game-settings", JSON.stringify(settings));
    window.location.href = "game.html";
  });
}