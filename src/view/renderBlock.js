import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";
import { renderTextBlock } from "./renderTextBlock.js";

export function renderBlock(args) {
  if (args.block.type === BLOCK_TYPES.text) {
    return renderTextBlock(args);
  }

  return el("article", {
    className: "block block--unknown",
    style: frameToCss(args.block.frame),
    textContent: `Bloque desconocido: ${args.block.type}`,
  });
}
