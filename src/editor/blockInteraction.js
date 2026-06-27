import { startBlockDragSession } from "./interaction/blockDragSession.js";
import { startBlockResizeSession } from "./interaction/blockResizeSession.js";
import { startLineEndpointDragSession } from "./interaction/lineEndpointDragSession.js";

export function handleBlockPointerDown(args) {
  startBlockDragSession(args);
}

export function handleResizePointerDown(args) {
  startBlockResizeSession(args);
}

export function handleLineEndpointPointerDown(args) {
  startLineEndpointDragSession(args);
}
