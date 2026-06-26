import { finishCurrentEdit, state } from "../core/state.js";
import { el } from "./dom.js";
import { closeContextMenu } from "./contextMenu.js";
import { textBlockComponent } from "./textBlock.js";

function readEditedText(blockId) {
  return document.querySelector(`[data-editable-id="${blockId}"]`)?.innerText;
}

export function pageComponent(page, pageNumber, { render }) {
  const pageElement = el("section", {
    className: `page${state.showGrid ? " is-grid-visible" : ""}`,
    dataset: { pageId: page.id },
    on: {
      pointerdown: (event) => {
        if (event.target !== pageElement) return;
        finishCurrentEdit(readEditedText);
        state.selectedId = null;
        closeContextMenu();
        render();
      },
      contextmenu: (event) => {
        event.preventDefault();
        finishCurrentEdit(readEditedText);
        closeContextMenu();
        render();
      },
    },
  });

  page.blocks.forEach((block) => {
    pageElement.appendChild(textBlockComponent(block, pageElement, { render }));
  });

  pageElement.appendChild(el("div", {
    className: "page__label",
    textContent: `Hoja ${pageNumber}`,
  }));

  return pageElement;
}

export function spreadsComponent({ render }) {
  const viewport = el("main", { className: "editor-viewport" });
  const spreads = el("div", { className: "spreads" });

  let pageNumber = 1;

  state.spreads.forEach((spread) => {
    const spreadElement = el("div", { className: "spread" });

    spread.pages.forEach((page) => {
      spreadElement.appendChild(pageComponent(page, pageNumber, { render }));
      pageNumber += 1;
    });

    spreads.appendChild(spreadElement);
  });

  viewport.appendChild(spreads);
  return viewport;
}
