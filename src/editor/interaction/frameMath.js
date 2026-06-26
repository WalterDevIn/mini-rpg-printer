import { PAGE_SPEC } from "../../document/printSpec.js";
import { clamp, pointerToPageMm, snapMm } from "../../shared/geometry.js";

export function getPointerOffsetInBlockMm(event, block, pageElement) {
  const pointerInPage = pointerToPageMm(event, pageElement);

  return {
    x: pointerInPage.x - block.frame.x,
    y: pointerInPage.y - block.frame.y,
  };
}

export function getPointerOffsetInElementPx(event, element) {
  const rect = element.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function getDraggedFrame(event, block, targetPageElement, pointerOffsetMm) {
  const pointerMm = pointerToPageMm(event, targetPageElement);

  return {
    x: clamp(snapMm(pointerMm.x - pointerOffsetMm.x), 0, PAGE_SPEC.widthMm - block.frame.width),
    y: clamp(snapMm(pointerMm.y - pointerOffsetMm.y), 0, PAGE_SPEC.heightMm - block.frame.height),
  };
}

export function getResizedFrame(event, { pageElement, startPointer, startFrame }) {
  const current = pointerToPageMm(event, pageElement);
  const nextWidth = snapMm(startFrame.width + current.x - startPointer.x);
  const nextHeight = snapMm(startFrame.height + current.y - startPointer.y);

  return {
    ...startFrame,
    width: clamp(nextWidth, PAGE_SPEC.gridMm, PAGE_SPEC.widthMm - startFrame.x),
    height: clamp(nextHeight, PAGE_SPEC.gridMm, PAGE_SPEC.heightMm - startFrame.y),
  };
}

export function setBlockElementFrame(element, frame) {
  element.style.left = `${frame.x}mm`;
  element.style.top = `${frame.y}mm`;
  element.style.width = `${frame.width}mm`;
  element.style.height = `${frame.height}mm`;
}
