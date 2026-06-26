const VIEWPORT_MARGIN_PX = 8;
const DEFAULT_MENU_WIDTH_PX = 260;
const DEFAULT_MENU_HEIGHT_PX = 520;

export function getFloatingMenuStyle({ x, y, width = DEFAULT_MENU_WIDTH_PX, height = DEFAULT_MENU_HEIGHT_PX }) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const menuWidth = Math.min(width, viewportWidth - VIEWPORT_MARGIN_PX * 2);
  const menuHeight = Math.min(height, viewportHeight - VIEWPORT_MARGIN_PX * 2);

  return {
    left: `${clamp(x, VIEWPORT_MARGIN_PX, viewportWidth - menuWidth - VIEWPORT_MARGIN_PX)}px`,
    top: `${clamp(y, VIEWPORT_MARGIN_PX, viewportHeight - menuHeight - VIEWPORT_MARGIN_PX)}px`,
    width: `${menuWidth}px`,
    maxHeight: `${menuHeight}px`,
  };
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}
