import { getCommonStyle, getLineStyle } from "../blocks/blockStyle.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";
import { commonStyleToCss } from "./blockStyleCss.js";

export function renderLineBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const resolvedCommonCss = commonStyleToCss(commonStyle, editorState.globalColors);
  const lineStyle = getLineStyle(block);
  const line = el("div", {
    className: "block__line",
    style: {
      height: `${lineStyle.thicknessMm}mm`,
      backgroundColor: resolvedCommonCss.backgroundColor,
    },
  });

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle: {
      ...commonStyle,
      backgroundColor: "transparent",
      backgroundOpacity: 0,
      backgroundColorId: "",
      hasBorder: false,
    },
    style: {
      transform: `rotate(${lineStyle.angleDeg}deg)`,
    },
    children: [line],
  });
}
