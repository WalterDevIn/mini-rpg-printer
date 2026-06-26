import { getBlockDefinition } from "../blocks/blockRegistry.js";
import { PAGE_SPEC, PRINT_DOCUMENT_VERSION, PRINT_INTENT } from "./printSpec.js";
import { createId } from "../shared/createId.js";

export function createPage() {
  return {
    id: createId("page"),
    blocks: [],
  };
}

export function createSpread() {
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

export function createPrintDocument() {
  return {
    version: PRINT_DOCUMENT_VERSION,
    intent: PRINT_INTENT,
    pageSpec: PAGE_SPEC,
    spreads: [createSpread()],
  };
}
