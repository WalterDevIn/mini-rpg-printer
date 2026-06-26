import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";
import { renderGridBlock } from "./renderGridBlock.js";
import { renderIconBlock } from "./renderIconBlock.js";
import { renderImageBlock } from "./renderImageBlock.js";
import { renderLineBlock } from "./renderLineBlock.js";
import { renderRuledTextBlock } from "./renderRuledTextBlock.js";
import { renderTextBlock } from "./renderTextBlock.js";

export function renderBlock(args) {
  if (args.block.type === BLOCK_TYPES.text) {
    return renderTextBlock(args);
  }

  if (args.block.type === BLOCK_TYPES.line) {
    return renderLineBlock(args);
  }

  if (args.block.type === BLOCK_TYPES.ruledText) {
    return renderRuledTextBlock(args);
  }

  if (args.block.type === BLOCK_TYPES.gridBlock) {
    return renderGridBlock(args);
  }

  if (args.block.type === BLOCK_TYPES.image) {
    return renderImageBlock(args);
  }

  if (args.block.type === BLOCK_TYPES.icon) {
    return renderIconBlock(args);
  }

  return el("article", {
    className: "block block--unknown",
    style: frameToCss(args.block.frame),
    textContent: `Bloque desconocido: ${args.block.type}`,
  });
}
