import { createSelection } from "../selectionHelpers.js";
import { createDragGhost, dropDragGhost, moveDragGhost } from "./dragGhost.js";
import { createGroupDragPreview } from "./groupDragPreview.js";

export function createBlockDragPreview({
  block,
  blockElement,
  editorState,
  pageElement,
  pointerOffsetPx,
  activeSelectionIds,
}) {
  let ghost = null;
  let groupPreview = null;

  return {
    begin(event, targetPageId) {
      editorState.selection = createSelection(activeSelectionIds, targetPageId);
      editorState.interaction.mode = "dragging-block";
      editorState.interaction.pickingBlockId = block.id;
      editorState.interaction.draggingBlockId = block.id;
      editorState.interaction.droppingBlockId = null;
      editorState.interaction.contextMenu = null;

      blockElement.classList.add("is-drag-source");
      ghost = createDragGhost(blockElement, event, pointerOffsetPx);
      groupPreview = createGroupDragPreview({
        pageElement,
        blockIds: activeSelectionIds,
        sourceBlockId: block.id,
      });
    },

    move(event, delta) {
      moveDragGhost(ghost, event, pointerOffsetPx);
      groupPreview?.move(delta);
    },

    clearSource() {
      blockElement.classList.remove("is-drag-source");
    },

    clearGroup() {
      groupPreview?.clear();
    },

    dropGhost() {
      dropDragGhost(ghost);
    },
  };
}
