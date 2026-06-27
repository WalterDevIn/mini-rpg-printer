const VIEWPORT_SELECTOR = ".editor-viewport";
const SCROLLABLE_PANEL_SELECTOR = ".context-menu, .global-colors-panel__body, .color-picker__panel";

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

export function capturePanelScroll(rootElement) {
  return Array.from(rootElement.querySelectorAll(SCROLLABLE_PANEL_SELECTOR)).map((element, index) => ({
    index,
    selector: getPanelSelector(element),
    left: element.scrollLeft,
    top: element.scrollTop,
  }));
}

export function restorePanelScroll(rootElement, scrollStates) {
  scrollStates?.forEach((scrollState) => {
    const candidates = Array.from(rootElement.querySelectorAll(scrollState.selector));
    const element = candidates[scrollState.index] ?? candidates[0];
    if (!element) return;

    element.scrollLeft = scrollState.left;
    element.scrollTop = scrollState.top;
  });
}

export function withPreservedViewportScroll(rootElement, renderWork) {
  const viewportScrollState = captureViewportScroll(rootElement);
  const panelScrollState = capturePanelScroll(rootElement);

  renderWork();
  restoreViewportScroll(rootElement, viewportScrollState);
  restorePanelScroll(rootElement, panelScrollState);

  requestAnimationFrame(() => {
    restoreViewportScroll(rootElement, viewportScrollState);
    restorePanelScroll(rootElement, panelScrollState);
  });
}

function getPanelSelector(element) {
  if (element.classList.contains("context-menu")) return ".context-menu";
  if (element.classList.contains("global-colors-panel__body")) return ".global-colors-panel__body";
  return ".color-picker__panel";
}
