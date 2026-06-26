import { hasSelection } from "../editor/editorSelectors.js";
import { el, iconButton } from "../shared/dom.js";

export function renderToolbar({ editorState, controller }) {
  return el("header", { className: "toolbar" }, [
    el("div", { className: "toolbar__title", textContent: "Mini RPG Printer" }),
    el("div", { className: "toolbar__group" }, [
      iconButton({
        iconClass: "fa-solid fa-font",
        label: "Agregar bloque de texto",
        onClick: () => controller.addTextBlock(),
      }),
      iconButton({
        iconClass: "fa-regular fa-clone",
        label: "Agregar par de hojas",
        onClick: () => controller.addSpread(),
      }),
      iconButton({
        iconClass: "fa-regular fa-trash-can",
        label: "Borrar bloque seleccionado",
        disabled: !hasSelection(editorState),
        onClick: () => controller.deleteSelectedBlock(),
      }),
      iconButton({
        iconClass: "fa-solid fa-table-cells",
        label: editorState.viewport.showGrid ? "Ocultar grilla" : "Mostrar grilla",
        active: editorState.viewport.showGrid,
        onClick: () => controller.toggleGrid(),
      }),
    ]),
    el("div", { className: "toolbar__spacer" }),
    el("div", {
      className: "hint",
      textContent: "Documento imprimible · Bloques en mm · Snap 5 mm · Click derecho abre propiedades",
    }),
  ]);
}
