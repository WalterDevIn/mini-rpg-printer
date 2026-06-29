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
  const isGroupDrag = activeSelectionIds.length > 1;

  return {
    begin(event, targetPageId) {
      editorState.selection = createSelection(activeSelectionIds, targetPageId);
      editorState.interaction.mode = "dragging-block";
      editorState.interaction.pickingBlockId = block.id;
      editorState.interaction.draggingBlockId = block.id;
      editorState.interaction.droppingBlockId = null;
      editorState.interaction.contextMenu = null;

      if (isGroupDrag) {
        groupPreview = createGroupDragPreview({
          pageElement,
          blockIds: activeSelectionIds,
          event,
        });
        return;
      }

      blockElement.classList.add("is-drag-source");
      ghost = createDragGhost(blockElement, event, pointerOffsetPx);
    },

    move(event, delta) {
      if (isGroupDrag) {
        groupPreview?.move(event, delta);
        return;
      }

      moveDragGhost(ghost, event, pointerOffsetPx);
    },

    clearSource() {
      if (isGroupDrag) return;
      blockElement.classList.remove("is-drag-source");
    },

    clearGroup() {
      groupPreview?.restoreSources();
    },

    dropGhost() {
      if (isGroupDrag) {
        groupPreview?.dropGhost();
        return;
      }

      dropDragGhost(ghost);
    },

    removeGhost() {
      if (isGroupDrag) {
        groupPreview?.removeGhost();
      }
    },
  };
}
