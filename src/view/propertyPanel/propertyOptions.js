export const FONTS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
];

export const FONT_OPTIONS = FONTS.map((font) => ({ label: font, value: font }));

export const HORIZONTAL_OPTIONS = [
  { label: "Izquierda", value: "left" },
  { label: "Centro", value: "center" },
  { label: "Derecha", value: "right" },
];

export const VERTICAL_OPTIONS = [
  { label: "Arriba", value: "start" },
  { label: "Centro", value: "middle" },
  { label: "Abajo", value: "end" },
];

export const LINE_ANGLE_OPTIONS = [
  { label: "0°", value: "0" },
  { label: "45°", value: "45" },
  { label: "90°", value: "90" },
];

export const IMAGE_FIT_OPTIONS = [
  { label: "Contener", value: "contain" },
  { label: "Cubrir", value: "cover" },
  { label: "Estirar", value: "fill" },
];
