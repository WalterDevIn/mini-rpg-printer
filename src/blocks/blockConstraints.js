import { getBlockDefinition } from "./blockRegistry.js";

const DEFAULT_MINIMUM_FRAME_SIZE = {};

export function getMinimumFrameSize(block) {
  return getBlockDefinition(block.type).constraints.minFrame ?? DEFAULT_MINIMUM_FRAME_SIZE;
}
