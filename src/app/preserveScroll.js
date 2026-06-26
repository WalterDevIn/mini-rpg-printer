const VIEWPORT_SELECTOR = ".editor-viewport";

export function captureViewportScroll(rootElement) {
  const viewport = rootElement.querySelector(VIEWPORT_SELECTOR);

  if (!viewport) {
    return { left: 0, top: 0, hasViewport: false };
  }

  return {
    left: viewport.scrollLeft,
    top: viewport.scrollTop,
    hasViewport: true,
  };
}

export function restoreViewportScroll(rootElement, scrollState) {
  if (!scrollState?.hasViewport) return;

  const viewport = rootElement.querySelector(VIEWPORT_SELECTOR);
  if (!viewport) return;

  viewport.scrollLeft = scrollState.left;
  viewport.scrollTop = scrollState.top;
}

export function withPreservedViewportScroll(rootElement, renderWork) {
  const scrollState = captureViewportScroll(rootElement);
  renderWork();
  restoreViewportScroll(rootElement, scrollState);

  requestAnimationFrame(() => {
    restoreViewportScroll(rootElement, scrollState);
  });
}
