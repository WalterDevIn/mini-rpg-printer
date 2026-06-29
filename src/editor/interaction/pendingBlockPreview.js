import { getBlockDefinition } from "../../blocks/blockRegistry.js";
import { clamp, pointerToPageMm, snapMm } from "../../shared/geometry.js";

const PREVIEW_CLASS = "pending-block-preview";

export function updatePendingBlockPreview({ event, pageElement, editorState }) {
  if (!isPendingBlockTool(editorState)) {
    clearPendingBlockPreview(pageElement);
    return;
  }

  const definition = getBlockDefinition(editorState.activeTool);
  const point = pointerToPageMm(event, pageElement, editorState.document.pageSpec);
  const frame = getFrameUnderPointer(definition.defaultFrame, point, editorState.document.pageSpec);
  const preview = getOrCreatePreview(pageElement);

  preview.style.left = `${frame.x}mm`;
  preview.style.top = `${frame.y}mm`;
  preview.style.width = `${frame.width}mm`;
  preview.style.height = `${frame.height}mm`;
}

export function clearPendingBlockPreview(pageElement) {
  pageElement.querySelector(`.${PREVIEW_CLASS}`)?.remove();
}

function isPendingBlockTool(editorState) {
  return editorState.activeTool && editorState.activeTool !== "select";
}

function getOrCreatePreview(pageElement) {
  const existing = pageElement.querySelector(`.${PREVIEW_CLASS}`);
  if (existing) return existing;

  const preview = document.createElement("div");
  preview.className = PREVIEW_CLASS;
  pageElement.appendChild(preview);
  return preview;
}

function getFrameUnderPointer(defaultFrame, point, pageSpec) {
  const x = snapMm(point.x - defaultFrame.width / 2, pageSpec.gridMm);
  const y = snapMm(point.y - defaultFrame.height / 2, pageSpec.gridMm);

  return {
    ...defaultFrame,
    x: clamp(x, 0, pageSpec.widthMm - defaultFrame.width),
    y: clamp(y, 0, pageSpec.heightMm - defaultFrame.height),
  };
}
