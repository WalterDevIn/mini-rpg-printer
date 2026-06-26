const MENU_MARGIN_PX = 8;
const MENU_WIDTH_PX = 300;
const MENU_MAX_HEIGHT_PX = 520;

export function getSafeMenuPosition({ x, y }) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxLeft = Math.max(MENU_MARGIN_PX, viewportWidth - MENU_WIDTH_PX - MENU_MARGIN_PX);
  const maxTop = Math.max(MENU_MARGIN_PX, viewportHeight - MENU_MAX_HEIGHT_PX - MENU_MARGIN_PX);

  return {
    left: clamp(x, MENU_MARGIN_PX, maxLeft),
    top: clamp(y, MENU_MARGIN_PX, maxTop),
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
