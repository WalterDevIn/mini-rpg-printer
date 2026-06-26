import { findBlockById } from "../document/documentQueries.js";
import { el } from "../shared/dom.js";
import { getBlockDisplayName, renderCommonProperties, renderSpecificProperties } from "./blockPropertySections.js";
import { getFloatingMenuStyle } from "./floatingMenuPosition.js";

export function renderContextMenu({ editorState, controller }) {
  const menu = editorState.interaction.contextMenu;
  if (!menu) return null;

  const found = findBlockById(editorState.document, menu.blockId);
  if (!found) return null;

  return el("div", {
    className: "context-menu property-menu",
    style: getFloatingMenuStyle({ x: menu.x, y: menu.y }),
    on: {
      pointerdown: (event) => event.stopPropagation(),
      pointerup: (event) => event.stopPropagation(),
      click: (event) => event.stopPropagation(),
      keydown: (event) => event.stopPropagation(),
      contextmenu: (event) => event.preventDefault(),
    },
  }, [
    el("div", { className: "context-menu__title", textContent: `Editar ${getBlockDisplayName(found.block)}` }),
    renderCommonProperties({ block: found.block, controller }),
    renderSpecificProperties({ block: found.block, controller }),
  ]);
}
