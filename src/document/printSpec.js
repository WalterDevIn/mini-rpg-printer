export const PRINT_DOCUMENT_VERSION = 1;

export const PAGE_SPEC = {
  widthMm: 105,
  heightMm: 147.5,
  gridMm: 5,
  background: "white",
};

export const SPREAD_SPEC = {
  pagesPerSpread: 2,
  gapMm: 10,
};

export const PRINT_INTENT = {
  target: "pdf-print",
  unit: "mm",
  snapUnitMm: PAGE_SPEC.gridMm,
};
