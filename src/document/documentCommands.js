import { getMinimumFrameSize } from "../blocks/blockConstraints.js";
import { constrainFrameToPage } from "../shared/geometry.js";
import { mergePlainObjects } from "../shared/objectMerge.js";
import { createBlock, createSpread } from "./documentFactory.js";
import { findBlockById, findPageById, getFirstPage } from "./documentQueries.js";

export function addSpread(documentModel) {
  const spread = createSpread();
  documentModel.spreads.push(spread);
  return spread;
}

export function addBlockToPage(documentModel, pageId, type, overrides = {}) {
  const page = pageId
    ? documentModel.spreads.flatMap((spread) => spread.pages).find((candidate) => candidate.id === pageId)
    : getFirstPage(documentModel);

  if (!page) {
    throw new Error("Cannot add block because the target page does not exist.");
  }

  const block = createBlock(type, overrides);
  page.blocks.push(block);
  return block;
}

export function cloneBlockToPage(documentModel, sourceBlock, targetPageId, frameOffset = { x: 5, y: 5 }) {
  const page = targetPageId
    ? findPageById(documentModel, targetPageId)?.page
    : getFirstPage(documentModel);

  if (!page || !sourceBlock) return null;

  const block = createBlock(sourceBlock.type, {
    frame: constrainFrameToPage({
      ...sourceBlock.frame,
      x: sourceBlock.frame.x + frameOffset.x,
      y: sourceBlock.frame.y + frameOffset.y,
    }, documentModel.pageSpec, getMinimumFrameSize(sourceBlock)),
    props: structuredClone(sourceBlock.props),
  });

  page.blocks.push(block);
  return block;
}

export function deleteBlock(documentModel, blockId) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return false;

  found.page.blocks = found.page.blocks.filter((block) => block.id !== blockId);
  return true;
}

export function deleteBlocks(documentModel, blockIds) {
  const ids = new Set(blockIds);
  let deleted = false;

  documentModel.spreads.forEach((spread) => {
    spread.pages.forEach((page) => {
      const nextBlocks = page.blocks.filter((block) => !ids.has(block.id));
      deleted = deleted || nextBlocks.length !== page.blocks.length;
      page.blocks = nextBlocks;
    });
  });

  return deleted;
}

export function moveBlockToPage(documentModel, blockId, targetPageId) {
  const foundBlock = findBlockById(documentModel, blockId);
  const foundTarget = findPageById(documentModel, targetPageId);

  if (!foundBlock || !foundTarget) return null;
  if (foundBlock.page.id === foundTarget.page.id) return foundBlock.block;

  foundBlock.page.blocks = foundBlock.page.blocks.filter((block) => block.id !== blockId);
  foundTarget.page.blocks.push(foundBlock.block);

  return foundBlock.block;
}

export function updateBlockFrame(documentModel, blockId, nextFrame) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.frame = constrainFrameToPage({
    ...found.block.frame,
    ...nextFrame,
  }, documentModel.pageSpec, getMinimumFrameSize(found.block));

  return found.block;
}

export function translateBlocks(documentModel, blockIds, delta) {
  return blockIds
    .map((blockId) => {
      const found = findBlockById(documentModel, blockId);
      if (!found) return null;

      found.block.frame = constrainFrameToPage({
        ...found.block.frame,
        x: found.block.frame.x + delta.x,
        y: found.block.frame.y + delta.y,
      }, documentModel.pageSpec, getMinimumFrameSize(found.block));

      return found.block;
    })
    .filter(Boolean);
}

export function updateBlockProps(documentModel, blockId, nextProps) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.props = mergePlainObjects(found.block.props, nextProps);

  return found.block;
}

export function updateBlocksProps(documentModel, blockIds, nextProps) {
  return blockIds
    .map((blockId) => updateBlockProps(documentModel, blockId, nextProps))
    .filter(Boolean);
}
