import { getCommonStyle, getLineStyle } from "../blocks/blockStyle.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";

export function renderLineBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const lineStyle = getLineStyle(block);
  const line = el("div", {
    className: "block__line",
    style: {
      height: `${lineStyle.thicknessMm}mm`,
      backgroundColor: commonStyle.backgroundColor,
      transform: `rotate(${lineStyle.angleDeg}deg)`,
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
      hasBorder: false,
    },
    children: [line],
  });
}
