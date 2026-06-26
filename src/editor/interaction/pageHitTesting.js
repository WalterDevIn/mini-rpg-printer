export function getPageElementUnderPointer(event, fallbackPageElement) {
  const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
  return elementUnderPointer?.closest?.(".page") ?? fallbackPageElement;
}

export function getPageIdFromElement(pageElement) {
  return pageElement?.dataset?.pageId ?? null;
}
