import { getBlockDefinition } from "../blocks/blockRegistry.js";
import { PAGE_SPEC, PRINT_DOCUMENT_VERSION, PRINT_INTENT } from "./printSpec.js";
import { createId } from "../shared/createId.js";

export function createPrintDocument() {
  return {
    version: PRINT_DOCUMENT_VERSION,
    intent: PRINT_INTENT,
    pageSpec: PAGE_SPEC,
    spreads: [createSpread()],
  };
}

export function createSpread() {
  return {
    id: createId("spread"),
    pageIds: [createPage().id, createPage().id],
    pages: [],
  };
}

export function createPage() {
  return {
    id: createId("page"),
    blocks: [],
  };
}

export function createSpreadWithPages() {
  const pages = [createPage(), createPage()];

  return {
    id: createId("spread"),
    pageIds: pages.map((page) => page.id),
    pages,
  };
}

export function createBlock(type, overrides = {}) {
  const definition = getBlockDefinition(type);

  return {
    id: createId("block"),
    type,
    frame: {
      ...definition.defaultFrame,
      ...overrides.frame,
    },
    props: {
      ...definition.defaultProps,
      ...overrides.props,
    },
  };
}

export function createInitialPrintDocument() {
  return {
    version: PRINT_DOCUMENT_VERSION,
    intent: PRINT_INTENT,
    pageSpec: PAGE_SPEC,
    spreads: [createSpreadWithPages()],
  };
}
