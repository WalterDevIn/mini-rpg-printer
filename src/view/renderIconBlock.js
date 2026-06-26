import { getCommonStyle } from "../blocks/blockStyle.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";

export function renderIconBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const icon = getIconProps(block);
  const iconElement = el("i", {
    className: `block__fontawesome-icon ${icon.className}`,
    attrs: {
      "aria-hidden": "true",
    },
  });

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [
      el("div", { className: "block__icon-content" }, [iconElement]),
    ],
  });
}

function getIconProps(block) {
  return {
    className: "fa-solid fa-star",
    ...block.props.icon,
  };
}
