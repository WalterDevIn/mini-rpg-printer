import { SPREAD_LAYOUTS } from "../document/documentFactory.js";
import { createPagePointerHandlers } from "../editor/interaction/pagePointerHandlers.js";
import { el, iconButton } from "../shared/dom.js";
import { renderBlock } from "./renderBlock.js";
import { renderRingMargin } from "./renderRingMargin.js";

export function renderCanvas({ editorState, controller }) {
  const viewport = el("main", { className: "editor-viewport" });
  const spreadsElement = el("div", { className: "spreads" });

  let pageNumber = 1;

  editorState.document.spreads.forEach((spread, spreadIndex) => {
    const spreadElement = renderSpread({ spread, spreadIndex, pageNumber, editorState, controller });
    pageNumber += spread.pages.length;
    spreadsElement.appendChild(spreadElement);
  });

  viewport.appendChild(spreadsElement);
  return viewport;
}

function renderSpread({ spread, spreadIndex, pageNumber, editorState, controller }) {
  const spreadElement = el("div", {
    className: `spread spread--${spread.layout ?? SPREAD_LAYOUTS.pair}`,
  });
  const controls = renderSpreadControls({ spread, spreadIndex, controller });
  const pagesElement = el("div", { className: "spread__pages" });

  spread.pages.forEach((page, pageIndex) => {
    const pageSide = getPageSide({ spread, pageIndex });
    const pageElement = renderPage({ page, pageNumber: pageNumber + pageIndex, pageSide, editorState, controller });
    pagesElement.appendChild(pageElement);
  });

  spreadElement.appendChild(controls);
  spreadElement.appendChild(pagesElement);
  return spreadElement;
}

function renderSpreadControls({ spread, spreadIndex, controller }) {
  return el("div", { className: "spread__controls" }, [
    el("span", { className: "spread__kind", textContent: getSpreadLabel(spread) }),
    spread.layout === SPREAD_LAYOUTS.pair ? iconButton({
      iconClass: "fa-regular fa-copy",
      label: "Duplicar par debajo",
      onClick: () => controller.duplicateSpread(spreadIndex),
    }) : null,
    spread.layout === SPREAD_LAYOUTS.pair ? iconButton({
      iconClass: "fa-solid fa-plus",
      label: "Agregar par debajo",
      onClick: () => controller.insertSpreadAfter(spreadIndex),
    }) : null,
    iconButton({
      iconClass: "fa-regular fa-trash-can",
      label: "Eliminar par/página",
      onClick: () => controller.deleteSpread(spreadIndex),
    }),
  ]);
}

function renderPage({ page, pageNumber, pageSide, editorState, controller }) {
  const pageSpec = editorState.document.pageSpec;
  const isPlacingBlock = editorState.activeTool && editorState.activeTool !== "select";
  const pageElement = el("section", {
    className: `page page--${pageSide}${editorState.viewport.showGrid ? " is-grid-visible" : ""}${isPlacingBlock ? " is-placing-block" : ""}`,
    dataset: { pageId: page.id },
    style: {
      width: `${pageSpec.widthMm}mm`,
      height: `${pageSpec.heightMm}mm`,
      backgroundColor: pageSpec.background,
      backgroundSize: editorState.viewport.showGrid ? `${pageSpec.gridMm}mm ${pageSpec.gridMm}mm` : undefined,
    },
  });
  const handlers = createPagePointerHandlers({ page, pageElement, editorState, controller });

  pageElement.addEventListener("pointerdown", handlers.pointerdown);
  pageElement.addEventListener("contextmenu", handlers.contextmenu);

  if (editorState.viewport.showPageMargin) {
    pageElement.appendChild(renderRingMargin({ pageSide }));
  }

  page.blocks.forEach((block) => {
    pageElement.appendChild(renderBlock({ block, page, pageElement, editorState, controller }));
  });

  pageElement.appendChild(el("div", {
    className: "page__label",
    textContent: `Hoja ${pageNumber}`,
  }));

  return pageElement;
}

function getPageSide({ spread, pageIndex }) {
  if (spread.layout === SPREAD_LAYOUTS.singleStart) return "right";
  if (spread.layout === SPREAD_LAYOUTS.singleEnd) return "left";
  return pageIndex === 0 ? "left" : "right";
}

function getSpreadLabel(spread) {
  if (spread.layout === SPREAD_LAYOUTS.singleStart) return "Inicio · página derecha";
  if (spread.layout === SPREAD_LAYOUTS.singleEnd) return "Final · página izquierda";
  return "Par de páginas";
}
