import { BLOCK_TYPES } from "./blockTypes.js";

export const LABELED_BLOCK_DEFAULT_PROPS = {
  text: "",
  style: {
    backgroundColor: "#ffffff",
    backgroundOpacity: 0,
    textColor: "#1f2328",
    textOpacity: 1,
    borderColor: "#8b96a5",
    borderOpacity: 1,
    fontFamily: "Arial",
    fontSizePt: 11,
    hasBorder: true,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  textStyle: {
    horizontalAlign: "left",
    verticalAlign: "middle",
    paddingMm: 1.5,
  },
  label: {
    text: "Etiqueta",
    position: "fieldsetTopLeft",
    fontSizePt: 8,
    backgroundColor: "#ffffff",
    backgroundOpacity: 1,
    paddingXmm: 1,
    paddingYmm: 0.25,
    marginMm: 1,
  },
};

export const LABELED_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.labeled,
  label: "Etiquetado",
  iconClass: "fa-solid fa-tag",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 55,
    height: 18,
  },
  defaultProps: LABELED_BLOCK_DEFAULT_PROPS,
};
