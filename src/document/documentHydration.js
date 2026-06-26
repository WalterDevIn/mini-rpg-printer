import { createPrintDocument } from "./documentFactory.js";
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
    spreads: storedDocument.spreads,
  };
}
