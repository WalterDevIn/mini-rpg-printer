import {
  getPrimarySelectedBlock,
  getSelectedBlockIds,
  isBlockSelected,
} from "./selectionHelpers.js";

export function getSelectedBlock(editorState) {
  return getPrimarySelectedBlock(editorState);
}

export function isEditingBlock(editorState, blockId) {
  return editorState.interaction.editingBlockId === blockId;
}

export function isSelectedBlock(editorState, blockId) {
  return isBlockSelected(editorState, blockId);
}

export function hasSelection(editorState) {
  return getSelectedBlockIds(editorState).length > 0;
}
