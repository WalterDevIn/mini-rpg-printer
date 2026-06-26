import { DROP_ANIMATION_MS, PICKUP_ANIMATION_MS } from "./interactionConstants.js";

export function createDragGhost(sourceElement, event, pointerOffsetPx) {
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
  }, PICKUP_ANIMATION_MS);

  return ghost;
}

export function moveDragGhost(ghost, event, pointerOffsetPx) {
  if (!ghost) return;

  ghost.style.left = `${event.clientX - pointerOffsetPx.x}px`;
  ghost.style.top = `${event.clientY - pointerOffsetPx.y}px`;
}

export function dropDragGhost(ghost) {
  if (!ghost) return;

  ghost.classList.remove("is-picking", "is-dragging");
  ghost.classList.add("is-dropping");
  window.setTimeout(() => ghost.remove(), DROP_ANIMATION_MS);
}
