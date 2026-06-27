import { getBlockDefinition } from "./blockRegistry.js";

export function canEditBlockText(block) {
  return getBlockDefinition(block.type).capabilities.canEditText === true;
}
