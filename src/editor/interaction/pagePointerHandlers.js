import { pointerToPageMm } from "../../shared/geometry.js";
import { startMarqueeSelectionSession } from "./marqueeSelectionSession.js";

const INTERACTIVE_PAGE_TARGET_SELECTOR = ".block, .resize-handle, .context-menu, .block-dock";

export function createPagePointerHandlers({ page, pageElement, editorState, controller }) {
  return {
    pointerdown(event) {
      if (isInteractivePageTarget(event.target)) return;

      if (editorState.activeTool && editorState.activeTool !== "select") {
        event.preventDefault();
        event.stopPropagation();
        const point = pointerToPageMm(event, pageElement, editorState.document.pageSpec);
        controller.createBlockAtPagePoint(editorState.activeTool, page.id, point);
        return;
      }

      if (event.button === 0 || event.button === 2) {
        startMarqueeSelectionSession({ event, page, pageElement, editorState, controller });
      }
    },

    contextmenu(event) {
      event.preventDefault();
    },
  };
}

function isInteractivePageTarget(target) {
  return Boolean(target.closest?.(INTERACTIVE_PAGE_TARGET_SELECTOR));
}
