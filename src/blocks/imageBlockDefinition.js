import { BLOCK_TYPES } from "./blockTypes.js";

export const IMAGE_BLOCK_DEFAULT_PROPS = {
  style: {
    backgroundColor: "#f8fafc",
    textColor: "#64748b",
    fontFamily: "Arial",
    fontSizePt: 9,
    hasBorder: true,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  image: {
    src: "",
    alt: "Imagen",
    objectFit: "contain",
  },
};

export const IMAGE_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.image,
  label: "Imagen",
  iconClass: "fa-regular fa-image",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 45,
    height: 35,
  },
  defaultProps: IMAGE_BLOCK_DEFAULT_PROPS,
};
