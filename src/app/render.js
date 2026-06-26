import { deleteSelectedBlock, finishCurrentEdit, state } from "../core/state.js";
import { contextMenuComponent, closeContextMenu } from "../ui/contextMenu.js";
import { el } from "../ui/dom.js";
import { spreadsComponent } from "../ui/page.js";
import { toolbarComponent } from "../ui/toolbar.js";

let appRoot = null;

function readEditedText(blockId) {
  return document.querySelector(`[data-editable-id="${blockId}"]`)?.innerText;
}

export function setAppRoot(root) {
  appRoot = root;
}

export function renderError(error) {
  if (!appRoot) return;

  appRoot.innerHTML = `
    <main class="boot-error">
      <h1>No se pudo iniciar el editor</h1>
      <p>Hay un error de JavaScript. Abrí la consola del navegador para ver el detalle.</p>
      <pre>${String(error?.stack || error)}</pre>
    </main>
  `;
}

export function render() {
  if (!appRoot) return;

  appRoot.innerHTML = "";

  const shell = el("div", { className: "app-shell" }, [
    toolbarComponent({ render }),
    spreadsComponent({ render }),
    contextMenuComponent({ render }),
  ]);

  appRoot.appendChild(shell);
}

export function installGlobalEvents() {
  window.addEventListener("keydown", (event) => {
    if (state.editingId) return;

    if (event.key === "Delete" || event.key === "Backspace") {
      if (deleteSelectedBlock()) render();
    }

    if (event.key === "Escape") {
      closeContextMenu();
      state.editingId = null;
      render();
    }
  });

  window.addEventListener("pointerdown", (event) => {
    if (event.target.closest?.(".context-menu")) return;

    if (state.contextMenu) {
      closeContextMenu();
      render();
    }
  });

  window.addEventListener("blur", () => {
    finishCurrentEdit(readEditedText);
    closeContextMenu();
    render();
  });
}
