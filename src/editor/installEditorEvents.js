import { readEditedText } from "./textEditing.js";

export function installEditorEvents({ editorState, controller }) {
  window.addEventListener("keydown", (event) => {
    if (editorState.interaction.editingBlockId) return;

    if (event.key === "Delete" || event.key === "Backspace") {
      controller.deleteSelectedBlock();
    }

    if (event.key === "Escape") {
      controller.closeContextMenu();
      controller.cancelTextEdit();
    }
  });

  window.addEventListener("pointerdown", (event) => {
    if (event.target.closest?.(".context-menu")) return;

    if (editorState.interaction.contextMenu) {
      controller.closeContextMenu();
    }
  });

  window.addEventListener("blur", () => {
    controller.commitTextEdit(readEditedText);
    controller.closeContextMenu();
  });
}
