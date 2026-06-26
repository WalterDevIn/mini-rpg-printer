import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { hasSelection } from "../editor/editorSelectors.js";
import { el, iconButton } from "../shared/dom.js";

export function renderToolbar({ editorState, controller }) {
  return el("header", { className: "toolbar" }, [
    el("div", { className: "toolbar__title", textContent: "Mini RPG Printer" }),
    el("div", { className: "toolbar__group" }, [
      iconButton({
        iconClass: "fa-solid fa-font",
        label: "Agregar texto libre",
        onClick: () => controller.addBlock(BLOCK_TYPES.text),
      }),
      iconButton({
        iconClass: "fa-solid fa-minus",
        label: "Agregar línea",
        onClick: () => controller.addBlock(BLOCK_TYPES.line),
      }),
      iconButton({
        iconClass: "fa-solid fa-align-left",
        label: "Agregar texto normal",
        onClick: () => controller.addBlock(BLOCK_TYPES.ruledText),
      }),
      iconButton({
        iconClass: "fa-solid fa-border-all",
        label: "Agregar bloque de cuadrícula",
        onClick: () => controller.addBlock(BLOCK_TYPES.gridBlock),
      }),
      iconButton({
        iconClass: "fa-regular fa-image",
        label: "Agregar imagen",
        onClick: () => controller.addBlock(BLOCK_TYPES.image),
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
      textContent: "Documento imprimible · Bloques en mm · Click derecho abre propiedades",
    }),
  ]);
}
