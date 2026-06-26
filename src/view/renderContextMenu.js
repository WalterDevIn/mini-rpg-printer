import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { findBlockById } from "../document/documentQueries.js";
import { el } from "../shared/dom.js";
import {
  buttonGroup,
  checkboxControl,
  colorControl,
  field,
  numberControl,
  section,
  selectControl,
  toggleButton,
} from "./propertyControls.js";

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

const FONT_OPTIONS = FONTS.map((font) => ({ label: font, value: font }));

function updateCommonStyle(controller, block, patch) {
  controller.updateBlockProps(block.id, { style: patch });
}

function updateTextStyle(controller, block, patch) {
  controller.updateBlockProps(block.id, { textStyle: patch });
}

function renderCommonProperties({ block, controller }) {
  const style = getCommonStyle(block);

  return section("Bloque", [
    field("Color de fondo", colorControl({
      value: style.backgroundColor,
      onChange: (value) => updateCommonStyle(controller, block, { backgroundColor: value }),
    })),
    field("Fuente", selectControl({
      value: style.fontFamily,
      options: FONT_OPTIONS,
      onChange: (value) => updateCommonStyle(controller, block, { fontFamily: value }),
    })),
    field("Tamaño de fuente", numberControl({
      value: style.fontSizePt,
      min: 6,
      max: 72,
      step: 1,
      onChange: (value) => updateCommonStyle(controller, block, { fontSizePt: value }),
    })),
    field("Borde", checkboxControl({
      checked: style.hasBorder,
      onChange: (value) => updateCommonStyle(controller, block, { hasBorder: value }),
    })),
    field("Radio del borde", numberControl({
      value: style.borderRadiusMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateCommonStyle(controller, block, { borderRadiusMm: value }),
    })),
    field("Layer", numberControl({
      value: style.layer,
      min: 0,
      max: 999,
      step: 1,
      onChange: (value) => updateCommonStyle(controller, block, { layer: value }),
    })),
    field("Estilo", buttonGroup([
      toggleButton({
        label: "Negrita",
        active: style.bold,
        onClick: () => updateCommonStyle(controller, block, { bold: !style.bold }),
      }),
      toggleButton({
        label: "Cursiva",
        active: style.italic,
        onClick: () => updateCommonStyle(controller, block, { italic: !style.italic }),
      }),
      toggleButton({
        label: "Tachado",
        active: style.strike,
        onClick: () => updateCommonStyle(controller, block, { strike: !style.strike }),
      }),
    ])),
  ]);
}

function renderTextProperties({ block, controller }) {
  const textStyle = getTextStyle(block);

  if (block.type !== BLOCK_TYPES.text) return null;

  return section("Texto", [
    field("Disposición horizontal", selectControl({
      value: textStyle.horizontalAlign,
      options: [
        { label: "Izquierda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Derecha", value: "right" },
      ],
      onChange: (value) => updateTextStyle(controller, block, { horizontalAlign: value }),
    })),
    field("Disposición vertical", selectControl({
      value: textStyle.verticalAlign,
      options: [
        { label: "Arriba", value: "start" },
        { label: "Centro", value: "middle" },
        { label: "Abajo", value: "end" },
      ],
      onChange: (value) => updateTextStyle(controller, block, { verticalAlign: value }),
    })),
    field("Padding", checkboxControl({
      checked: textStyle.hasPadding,
      onChange: (value) => updateTextStyle(controller, block, { hasPadding: value }),
    })),
  ]);
}

export function renderContextMenu({ editorState, controller }) {
  const menu = editorState.interaction.contextMenu;
  if (!menu) return null;

  const found = findBlockById(editorState.document, menu.blockId);
  if (!found) return null;

  return el("div", {
    className: "context-menu property-menu",
    style: {
      left: `${menu.x}px`,
      top: `${menu.y}px`,
    },
    on: {
      pointerdown: (event) => event.stopPropagation(),
      contextmenu: (event) => event.preventDefault(),
    },
  }, [
    el("div", { className: "context-menu__title", textContent: "Editar bloque" }),
    renderCommonProperties({ block: found.block, controller }),
    renderTextProperties({ block: found.block, controller }),
  ]);
}
