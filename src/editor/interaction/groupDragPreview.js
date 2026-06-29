import { DROP_ANIMATION_MS, PICKUP_ANIMATION_MS } from "./interactionConstants.js";

export function createGroupDragPreview({ pageElement, blockIds, event }) {
  const previews = blockIds
    .map((blockId) => {
      const element = pageElement.querySelector(`[data-block-id="${blockId}"]`);
      if (!element) return null;

      return {
        element,
        rect: element.getBoundingClientRect(),
      };
    })
    .filter(Boolean);

  const bounds = getGroupViewportBounds(previews);
  const pointerOffset = bounds
    ? { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    : { x: 0, y: 0 };
  const ghost = bounds ? createGroupGhost({ previews, bounds }) : null;

  previews.forEach((preview) => preview.element.classList.add("is-drag-source"));

  return {
    move(moveEvent) {
      if (!ghost) return;

      ghost.style.left = `${moveEvent.clientX - pointerOffset.x}px`;
      ghost.style.top = `${moveEvent.clientY - pointerOffset.y}px`;
    },

    restoreSources() {
      previews.forEach((preview) => preview.element.classList.remove("is-drag-source"));
    },

    removeGhost() {
      ghost?.remove();
    },

    dropGhost() {
      if (!ghost) return;

      ghost.classList.remove("is-picking", "is-dragging");
      ghost.classList.add("is-dropping");
      window.setTimeout(() => ghost.remove(), DROP_ANIMATION_MS);
    },
  };
}

function createGroupGhost({ previews, bounds }) {
  const ghost = document.createElement("div");
  ghost.className = "group-drag-ghost is-picking";
  ghost.style.left = `${bounds.left}px`;
  ghost.style.top = `${bounds.top}px`;
  ghost.style.width = `${bounds.width}px`;
  ghost.style.height = `${bounds.height}px`;

  previews.forEach((preview) => {
    const clone = preview.element.cloneNode(true);
    clone.classList.remove("is-selected", "is-editing", "is-dropping", "is-drag-source");
    clone.classList.add("group-drag-ghost__item");
    clone.style.left = `${preview.rect.left - bounds.left}px`;
    clone.style.top = `${preview.rect.top - bounds.top}px`;
    clone.style.width = `${preview.rect.width}px`;
    clone.style.height = `${preview.rect.height}px`;
    clone.querySelectorAll(".resize-handle, .line-endpoint-handle").forEach((handle) => handle.remove());
    ghost.appendChild(clone);
  });

  document.body.appendChild(ghost);
  window.setTimeout(() => {
    ghost.classList.remove("is-picking");
    ghost.classList.add("is-dragging");
  }, PICKUP_ANIMATION_MS);

  return ghost;
}

function getGroupViewportBounds(previews) {
  if (previews.length === 0) return null;

  const left = Math.min(...previews.map((preview) => preview.rect.left));
  const top = Math.min(...previews.map((preview) => preview.rect.top));
  const right = Math.max(...previews.map((preview) => preview.rect.right));
  const bottom = Math.max(...previews.map((preview) => preview.rect.bottom));

  return {
    left,
    top,
    width: Math.max(right - left, 1),
    height: Math.max(bottom - top, 1),
  };
}
