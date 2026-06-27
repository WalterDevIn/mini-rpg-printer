import { BLOCK_TYPES } from "../../blocks/blockTypes.js";

export function getBlockDisplayName(block) {
  if (block.type === BLOCK_TYPES.text) return "Texto libre";
  if (block.type === BLOCK_TYPES.line) return "Línea";
  if (block.type === BLOCK_TYPES.ruledText) return "Texto normal";
  if (block.type === BLOCK_TYPES.gridBlock) return "Cuadrícula";
  if (block.type === BLOCK_TYPES.image) return "Imagen";
  if (block.type === BLOCK_TYPES.icon) return "Ícono";
  return block.type;
}
