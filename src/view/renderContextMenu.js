import { findBlockById } from "../document/documentQueries.js";
import { el } from "../shared/dom.js";

const FONTS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
];

export function renderContextMenu({ editorState, controller }) {
  const menu = editorState.interaction.contextMenu;
  if (!menu) return null;

  const found = findBlockById(editorState.document, menu.blockId);
  if (!found) return null;

  const fontItems = FONTS.map((font) => {
    return el("button", {
      className: `context-menu__item${found.block.props.fontFamily === font ? " is-current" : ""}`,
      type: "button",
      style: { fontFamily: font },
      textContent: font,
      on: {
        click: () => controller.updateBlockProps(found.block.id, { fontFamily: font }),
      },
    });
  });

  return el("div", {
    className: "context-menu",
    style: {
      left: `${menu.x}px`,
      top: `${menu.y}px`,
    },
    on: {
      pointerdown: (event) => event.stopPropagation(),
      contextmenu: (event) => event.preventDefault(),
    },
  }, [
    el("div", { className: "context-menu__title", textContent: "Propiedades" }),
    el("div", { className: "context-menu__section-title", textContent: "Fuente" }),
    ...fontItems,
  ]);
}
