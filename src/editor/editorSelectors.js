import { findBlockById } from "../document/documentQueries.js";

export function getSelectedBlock(editorState) {
  if (!editorState.selection.blockId) return null;
  return findBlockById(editorState.document, editorState.selection.blockId);
}

export function isEditingBlock(editorState, blockId) {
  return editorState.interaction.editingBlockId === blockId;
}

export function hasSelection(editorState) {
  return Boolean(editorState.selection.blockId);
}
