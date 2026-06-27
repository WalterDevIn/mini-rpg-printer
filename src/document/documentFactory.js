import { getBlockDefinition } from "../blocks/blockRegistry.js";
import { createId } from "../shared/createId.js";
import { PAGE_SPEC, PRINT_DOCUMENT_VERSION, PRINT_INTENT } from "./printSpec.js";

export const SPREAD_LAYOUTS = {
  singleStart: "single-start",
  pair: "pair",
  singleEnd: "single-end",
};

export function createPage(overrides = {}) {
  return {
    id: createId("page"),
    blocks: [],
    ...overrides,
  };
}

export function createSpread({ layout = SPREAD_LAYOUTS.pair, pages = null } = {}) {
  const spreadPages = pages ?? createPagesForLayout(layout);

  return {
    id: createId("spread"),
    layout,
    pageIds: spreadPages.map((page) => page.id),
    pages: spreadPages,
  };
}

export function cloneSpread(sourceSpread) {
  const pages = sourceSpread.pages.map((page) => createPage({
    blocks: page.blocks.map(cloneBlock),
  }));

  return createSpread({
    layout: sourceSpread.layout ?? SPREAD_LAYOUTS.pair,
    pages,
  });
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
    props: structuredClone({
      ...definition.defaultProps,
      ...overrides.props,
    }),
  };
}

export function cloneBlock(sourceBlock) {
  return {
    id: createId("block"),
    type: sourceBlock.type,
    frame: structuredClone(sourceBlock.frame),
    props: structuredClone(sourceBlock.props),
  };
}

export function createPrintDocument({ pageSpec = PAGE_SPEC } = {}) {
  return {
    version: PRINT_DOCUMENT_VERSION,
    intent: {
      ...PRINT_INTENT,
      snapUnitMm: pageSpec.gridMm,
    },
    pageSpec,
    spreads: [createSpread()],
  };
}

function createPagesForLayout(layout) {
  if (layout === SPREAD_LAYOUTS.singleStart || layout === SPREAD_LAYOUTS.singleEnd) {
    return [createPage()];
  }

  return [createPage(), createPage()];
}
