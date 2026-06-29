import { SPREAD_LAYOUTS } from "../document/documentFactory.js";
import { el } from "../shared/dom.js";

export function renderPageTreeSidebar({ editorState }) {
  const pageItems = getPageTreeItems(editorState.document.spreads);

  return el("aside", { className: "page-tree-sidebar" }, [
    el("div", { className: "page-tree-sidebar__header" }, [
      el("div", { className: "page-tree-sidebar__title", textContent: "Páginas" }),
      el("div", { className: "page-tree-sidebar__count", textContent: `${pageItems.length}` }),
    ]),
    el("nav", { className: "page-tree", attrs: { "aria-label": "Árbol de páginas" } }, [
      el("div", { className: "page-tree__root" }, pageItems.map(renderPageItem)),
    ]),
  ]);
}

function renderPageItem(item) {
  return el("div", { className: "page-tree__item", dataset: { pageId: item.page.id } }, [
    el("button", {
      className: "page-tree__page-button",
      type: "button",
      title: item.label,
    }, [
      el("i", { className: getPageIconClass(item), attrs: { "aria-hidden": "true" } }),
      el("span", { className: "page-tree__page-name", textContent: item.label }),
      el("span", { className: "page-tree__page-side", textContent: item.sideLabel }),
    ]),
    el("div", { className: "page-tree__children page-tree__children--empty", textContent: "Elementos: próximamente" }),
  ]);
}

function getPageTreeItems(spreads) {
  const items = [];
  let pageNumber = 1;

  spreads.forEach((spread) => {
    spread.pages.forEach((page, pageIndex) => {
      const side = getPageSide({ spread, pageIndex });
      items.push({
        page,
        side,
        label: `Página ${pageNumber}`,
        sideLabel: side === "left" ? "Izq." : "Der.",
      });
      pageNumber += 1;
    });
  });

  return items;
}

function getPageSide({ spread, pageIndex }) {
  if (spread.layout === SPREAD_LAYOUTS.singleStart) return "right";
  if (spread.layout === SPREAD_LAYOUTS.singleEnd) return "left";
  return pageIndex === 0 ? "left" : "right";
}

function getPageIconClass(item) {
  return item.side === "left" ? "fa-regular fa-file-lines" : "fa-regular fa-file";
}
