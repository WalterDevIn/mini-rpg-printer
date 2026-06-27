import { createPrintDocument, SPREAD_LAYOUTS } from "./documentFactory.js";
import { PRINT_DOCUMENT_VERSION } from "./printSpec.js";

export function hydratePrintDocument(storedDocument, { pageSpec }) {
  if (!storedDocument?.spreads?.length) {
    return createPrintDocument({ pageSpec });
  }

  return {
    ...storedDocument,
    version: storedDocument.version ?? PRINT_DOCUMENT_VERSION,
    intent: {
      ...storedDocument.intent,
      snapUnitMm: pageSpec.gridMm,
    },
    pageSpec,
    spreads: storedDocument.spreads.map(hydrateSpread),
  };
}

function hydrateSpread(spread) {
  const layout = spread.layout ?? SPREAD_LAYOUTS.pair;

  return {
    ...spread,
    layout,
    pageIds: spread.pages.map((page) => page.id),
  };
}
