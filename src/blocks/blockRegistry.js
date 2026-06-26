import { GRID_BLOCK_DEFINITION } from "./gridBlockDefinition.js";
import { ICON_BLOCK_DEFINITION } from "./iconBlockDefinition.js";
import { IMAGE_BLOCK_DEFINITION } from "./imageBlockDefinition.js";
import { LINE_BLOCK_DEFINITION } from "./lineBlockDefinition.js";
import { RULED_TEXT_BLOCK_DEFINITION } from "./ruledTextBlockDefinition.js";
import { BLOCK_TYPES } from "./blockTypes.js";
import { TEXT_BLOCK_DEFINITION } from "./textBlockDefinition.js";

const BLOCK_DEFINITIONS = {
  [BLOCK_TYPES.text]: TEXT_BLOCK_DEFINITION,
  [BLOCK_TYPES.line]: LINE_BLOCK_DEFINITION,
  [BLOCK_TYPES.ruledText]: RULED_TEXT_BLOCK_DEFINITION,
  [BLOCK_TYPES.gridBlock]: GRID_BLOCK_DEFINITION,
  [BLOCK_TYPES.image]: IMAGE_BLOCK_DEFINITION,
  [BLOCK_TYPES.icon]: ICON_BLOCK_DEFINITION,
};

export function getBlockDefinition(type) {
  const definition = BLOCK_DEFINITIONS[type];

  if (!definition) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return definition;
}

export function listBlockDefinitions() {
  return Object.values(BLOCK_DEFINITIONS);
}
