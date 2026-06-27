import { cloneBlockToPage } from "../../document/documentCommands.js";
import { findBlockById, getFirstPage } from "../../document/documentQueries.js";
import { createSelection } from "../selectionHelpers.js";

export function createClipboardActions({ editorState, render, mutateDocument }) {
  return {
    copySelectedBlock() {
      const found = findBlockById(editorState.document, editorState.selection.blockId);
      if (!found) return;

      editorState.clipboard.block = structuredClone(found.block);
    },

    pasteCopiedBlock() {
      const copiedBlock = editorState.clipboard.block;
      if (!copiedBlock) return;

      const targetPageId = editorState.selection.pageId ?? getFirstPage(editorState.document)?.id;
      const block = mutateDocument((documentModel) => cloneBlockToPage(documentModel, copiedBlock, targetPageId));
      if (!block) return;

      editorState.selection = createSelection([block.id], targetPageId);
      editorState.interaction.contextMenu = null;
      editorState.interaction.editingBlockId = null;
      editorState.clipboard.block = structuredClone(block);
      render();
    },
  };
}
