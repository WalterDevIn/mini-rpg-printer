import { getPageElementUnderPointer, getPageIdFromElement } from "./pageHitTesting.js";

export function commitMovedBlockDrop({
  event,
  activePageElement,
  latestPageId,
  latestFrame,
  block,
  activeSelectionIds,
  controller,
}) {
  const dropPageElement = getPageElementUnderPointer(event, activePageElement);
  const dropPageId = getPageIdFromElement(dropPageElement) ?? latestPageId;

  controller.commitBlockMove(block.id, dropPageId, latestFrame, { shouldRender: false });
  controller.selectBlocks(activeSelectionIds, dropPageId, { shouldRender: false });
  controller.endBlockDrop(block.id);
}

export function commitUnmovedPickedBlock({ activeSelectionIds, page, controller }) {
  controller.selectBlocks(activeSelectionIds, page.id);
}

export function commitPlainSelection({ activeSelectionIds, page, controller }) {
  controller.selectBlocks(activeSelectionIds, page.id);
}
