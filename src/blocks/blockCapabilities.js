import { BLOCK_TYPES } from "./blockTypes.js";

export function canEditBlockText(block) {
  return [BLOCK_TYPES.text, BLOCK_TYPES.ruledText, BLOCK_TYPES.gridBlock].includes(block.type);
}
