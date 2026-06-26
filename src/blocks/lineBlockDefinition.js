import { BLOCK_TYPES } from "./blockTypes.js";

export const LINE_BLOCK_DEFAULT_PROPS = {
  style: {
    backgroundColor: "#111827",
    textColor: "#111827",
    fontFamily: "Arial",
    fontSizePt: 11,
    hasBorder: false,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  line: {
    angleDeg: 0,
    thicknessMm: 0.75,
  },
};

export const LINE_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.line,
  label: "Línea",
  iconClass: "fa-solid fa-minus",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 40,
    height: 1,
  },
  defaultProps: LINE_BLOCK_DEFAULT_PROPS,
};
