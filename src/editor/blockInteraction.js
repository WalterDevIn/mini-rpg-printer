import { PAGE_SPEC } from "../document/printSpec.js";
import { clamp, pointerToPageMm, safeReleasePointerCapture, snapMm } from "../shared/geometry.js";
import { focusEditable, readEditedText } from "./textEditing.js";

const CLICK_MOVE_THRESHOLD_PX = 4;
const HOLD_TO_PICKUP_MS = 170;

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

function setBlockElementFrame(element, frame) {
  element.style.left = `${frame.x}mm`;
  element.style.top = `${frame.y}mm`;
  element.style.width = `${frame.width}mm`;
  element.style.height = `${frame.height}mm`;
}

function createDragGhost(sourceElement, event, pointerOffsetPx) {
  const rect = sourceElement.getBoundingClientRect();
  const ghost = sourceElement.cloneNode(true);

  ghost.classList.remove("is-selected", "is-editing", "is-dropping");
  ghost.classList.add("drag-ghost", "is-picking");
  ghost.style.left = `${event.clientX - pointerOffsetPx.x}px`;
  ghost.style.top = `${event.clientY - pointerOffsetPx.y}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;

  ghost.querySelectorAll(".resize-handle").forEach((handle) => handle.remove());
  document.body.appendChild(ghost);

  window.setTimeout(() => {
    ghost.classList.remove("is-picking");
    ghost.classList.add("is-dragging");
  }, 150);

  return ghost;
}

function moveGhost(ghost, event, pointerOffsetPx) {
  ghost.style.left = `${event.clientX - pointerOffsetPx.x}px`;
  ghost.style.top = `${event.clientY - pointerOffsetPx.y}px`;
}

function dropGhost(ghost) {
  if (!ghost) return;

  ghost.classList.remove("is-picking", "is-dragging");
  ghost.classList.add("is-dropping");
  window.setTimeout(() => ghost.remove(), 180);
}

export function handleBlockPointerDown({ event, block, page, pageElement, editorState, controller }) {
  event.stopPropagation();
  event.preventDefault();

  const blockElement = event.currentTarget;
  const wasSelected = editorState.selection.blockId === block.id;
  const pointerInPage = pointerToPageMm(event, pageElement);
  const pointerOffsetMm = {
    x: pointerInPage.x - block.frame.x,
    y: pointerInPage.y - block.frame.y,
  };
  const blockRect = blockElement.getBoundingClientRect();
  const pointerOffsetPx = {
    x: event.clientX - blockRect.left,
    y: event.clientY - blockRect.top,
  };
  const startClient = { x: event.clientX, y: event.clientY };

  let moved = false;
  let pickedUp = false;
  let released = false;
  let activePageElement = pageElement;
  let latestFrame = { ...block.frame };
  let latestPageId = page.id;
  let ghost = null;

  function beginPickup(pickupEvent, targetPageId = page.id) {
    if (pickedUp || released) return;

    pickedUp = true;
    latestPageId = targetPageId;
    editorState.selection = { blockId: block.id, pageId: targetPageId };
    editorState.interaction.mode = "dragging-block";
    editorState.interaction.pickingBlockId = block.id;
    editorState.interaction.draggingBlockId = block.id;
    editorState.interaction.droppingBlockId = null;
    editorState.interaction.contextMenu = null;

    blockElement.classList.add("is-drag-source");
    ghost = createDragGhost(blockElement, pickupEvent, pointerOffsetPx);
  }

  const holdTimer = window.setTimeout(() => {
    beginPickup(event, page.id);
  }, HOLD_TO_PICKUP_MS);

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
    latestPageId = targetPageId;
    latestFrame = getDraggedFrame(moveEvent, block, targetPageElement, pointerOffsetMm);

    beginPickup(moveEvent, targetPageId);
    moveGhost(ghost, moveEvent, pointerOffsetPx);
  };

  const up = (upEvent) => {
    released = true;
    window.clearTimeout(holdTimer);
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    blockElement.classList.remove("is-drag-source");

    if (wasSelected && !moved && !pickedUp) {
      controller.startTextEdit(block.id);
      focusEditable(block.id);
      return;
    }

    if (pickedUp) {
      if (moved) {
        const dropPageElement = getPageElementUnderPointer(upEvent, activePageElement);
        const dropPageId = getPageIdFromElement(dropPageElement) ?? latestPageId;
        controller.commitBlockMove(block.id, dropPageId, latestFrame, { shouldRender: false });
        controller.selectBlock(block.id, dropPageId, { shouldRender: false });
        dropGhost(ghost);
        controller.endBlockDrop(block.id);
        return;
      }

      dropGhost(ghost);
      controller.selectBlock(block.id, page.id);
      return;
    }

    controller.selectBlock(block.id, page.id);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function handleResizePointerDown({ event, block, pageElement, controller }) {
  event.stopPropagation();
  event.preventDefault();

  const blockElement = event.currentTarget.closest(".block");
  const startPointer = pointerToPageMm(event, pageElement);
  const startFrame = { ...block.frame };
  let latestFrame = { ...startFrame };

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const current = pointerToPageMm(moveEvent, pageElement);
    const nextWidth = snapMm(startFrame.width + current.x - startPointer.x);
    const nextHeight = snapMm(startFrame.height + current.y - startPointer.y);

    latestFrame = {
      ...startFrame,
      width: clamp(nextWidth, PAGE_SPEC.gridMm, PAGE_SPEC.widthMm - startFrame.x),
      height: clamp(nextHeight, PAGE_SPEC.gridMm, PAGE_SPEC.heightMm - startFrame.y),
    };

    setBlockElementFrame(blockElement, latestFrame);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    controller.commitBlockResize(block.id, latestFrame);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
