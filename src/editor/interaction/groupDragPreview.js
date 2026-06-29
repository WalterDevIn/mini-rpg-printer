export function createGroupDragPreview({ pageElement, blockIds }) {
  const previews = blockIds
    .map((blockId) => {
      const element = pageElement.querySelector(`[data-block-id="${blockId}"]`);
      if (!element) return null;

      element.classList.add("is-drag-source");
      return { element };
    })
    .filter(Boolean);

  return {
    move() {},

    clear() {
      previews.forEach((preview) => {
        preview.element.classList.remove("is-drag-source");
      });
    },
  };
}
