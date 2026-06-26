import { PAGE_SPEC } from "../document/printSpec.js";
import { clamp, pointerToPageMm, safeReleasePointerCapture, snapMm } from "../shared/geometry.js";
import { focusEditable, readEditedText } from "./textEditing.js";

const CLICK_MOVE_THRESHOLD_PX = 4;

function getPageElementUnderPointer(event, fallbackPageElement) {
  const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
  return elementUnderPointer?.closest?.(".page") ?? fallbackPageElement;
}

function getPageIdFromElement(pageElement) {
  return pageElement?.dataset?.pageId ?? null;
}

function getDraggedFrame(event, block, targetPageElement, pointerOffsetMm) {
  const pointerMm = pointerToPageMm(event, targetPageElement);

  return {
    x: clamp(snapMm(pointerMm.x - pointerOffsetMm.x), 0, PAGE_SPEC.widthMm - block.frame.width),
    y: clamp(snapMm(pointerMm.y - pointerOffsetMm.y), 0, PAGE_SPEC.heightMm - block.frame.height),
  };
}

export function handleBlockPointerDown({ event, block, page, pageElement, editorState, controller }) {
  event.stopPropagation();

  const wasSelected = editorState.selection.blockId === block.id;
  const pointerInPage = pointerToPageMm(event, pageElement);
  const pointerOffsetMm = {
    x: pointerInPage.x - block.frame.x,
    y: pointerInPage.y - block.frame.y,
  };
  const startClient = { x: event.clientX, y: event.clientY };
  let moved = false;
  let activePageElement = pageElement;

  controller.commitTextEdit(readEditedText, { shouldRender: false });
  editorState.selection = { blockId: block.id, pageId: page.id };
  editorState.interaction.contextMenu = null;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const dxPx = Math.abs(moveEvent.clientX - startClient.x);
    const dyPx = Math.abs(moveEvent.clientY - startClient.y);

    if (dxPx > CLICK_MOVE_THRESHOLD_PX || dyPx > CLICK_MOVE_THRESHOLD_PX) {
      moved = true;
    }

    if (!moved) return;

    const targetPageElement = getPageElementUnderPointer(moveEvent, activePageElement);
    const targetPageId = getPageIdFromElement(targetPageElement);

    if (!targetPageId) return;

    activePageElement = targetPageElement;

    const nextFrame = getDraggedFrame(moveEvent, block, targetPageElement, pointerOffsetMm);

    if (editorState.interaction.draggingBlockId !== block.id) {
      controller.beginBlockDrag(block.id, targetPageId);
    }

    controller.moveBlock(block.id, targetPageId, nextFrame);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    if (wasSelected && !moved) {
      controller.startTextEdit(block.id);
      focusEditable(block.id);
      return;
    }

    if (moved) {
      const dropPageElement = getPageElementUnderPointer(upEvent, activePageElement);
      const dropPageId = getPageIdFromElement(dropPageElement) ?? editorState.selection.pageId ?? page.id;
      controller.endBlockDrag(block.id);
      controller.selectBlock(block.id, dropPageId);
      return;
    }

    controller.selectBlock(block.id, page.id);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function handleResizePointerDown({ event, block, pageElement, controller }) {
  event.stopPropagation();

  const startPointer = pointerToPageMm(event, pageElement);
  const startFrame = { ...block.frame };

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const current = pointerToPageMm(moveEvent, pageElement);
    const nextWidth = snapMm(startFrame.width + current.x - startPointer.x);
    const nextHeight = snapMm(startFrame.height + current.y - startPointer.y);

    controller.updateBlockFrame(block.id, {
      width: clamp(nextWidth, PAGE_SPEC.gridMm, PAGE_SPEC.widthMm - block.frame.x),
      height: clamp(nextHeight, PAGE_SPEC.gridMm, PAGE_SPEC.heightMm - block.frame.y),
    });
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
