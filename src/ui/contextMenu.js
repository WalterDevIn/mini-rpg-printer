import { FONTS } from "../core/constants.js";
import { getBlockById, state } from "../core/state.js";
import { el } from "./dom.js";

export function openFontContextMenu({ blockId, clientX, clientY }) {
  state.selectedId = blockId;
  state.editingId = null;
  state.contextMenu = {
    kind: "font",
    blockId,
    x: clientX,
    y: clientY,
  };
}

export function closeContextMenu() {
  state.contextMenu = null;
}

export function contextMenuComponent({ render }) {
  if (!state.contextMenu) return null;

  const found = getBlockById(state.contextMenu.blockId);
  if (!found) return null;

  const items = FONTS.map((font) => {
    return el("button", {
      className: `context-menu__item${found.block.fontFamily === font ? " is-current" : ""}`,
      type: "button",
      style: { fontFamily: font },
      textContent: font,
      on: {
        click: () => {
          found.block.fontFamily = font;
          state.contextMenu = null;
          render();
        },
      },
    });
  });

  return el("div", {
    className: "context-menu",
    style: {
      left: `${state.contextMenu.x}px`,
      top: `${state.contextMenu.y}px`,
    },
    on: {
      pointerdown: (event) => event.stopPropagation(),
      contextmenu: (event) => event.preventDefault(),
    },
  }, [
    el("div", { className: "context-menu__title", textContent: "Fuente" }),
    ...items,
  ]);
}
