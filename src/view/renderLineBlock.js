import { getCommonStyle, getLineStyle } from "../blocks/blockStyle.js";
import { handleLineEndpointPointerDown } from "../editor/blockInteraction.js";
import { isSelectedBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";
import { commonStyleToCss } from "./blockStyleCss.js";

export function renderLineBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const resolvedCommonCss = commonStyleToCss(commonStyle, editorState.globalColors);
  const lineStyle = getLineStyle(block);
  const isSelected = isSelectedBlock(editorState, block.id);
  const svg = createLineSvg({ lineStyle, color: resolvedCommonCss.color });

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
    children: [
      svg,
      isSelected ? createEndpointHandle({ endpoint: "start", point: lineStyle.start, block, pageElement, controller }) : null,
      isSelected ? createEndpointHandle({ endpoint: "end", point: lineStyle.end, block, pageElement, controller }) : null,
    ],
  });
}

function createLineSvg({ lineStyle, color }) {
  return el("svg", {
    className: "line-block__svg",
    attrs: {
      viewBox: `0 0 ${Math.max(lineStyle.start.x, lineStyle.end.x, 1)} ${Math.max(lineStyle.start.y, lineStyle.end.y, 1)}`,
      preserveAspectRatio: "none",
    },
  }, [
    el("line", {
      className: "line-block__segment",
      attrs: {
        x1: String(lineStyle.start.x),
        y1: String(lineStyle.start.y),
        x2: String(lineStyle.end.x),
        y2: String(lineStyle.end.y),
        stroke: color,
        "stroke-width": String(lineStyle.thicknessMm),
        "stroke-linecap": "round",
        vectorEffect: "non-scaling-stroke",
      },
    }),
  ]);
}

function createEndpointHandle({ endpoint, point, block, pageElement, controller }) {
  return el("button", {
    className: `line-endpoint-handle line-endpoint-handle--${endpoint}`,
    type: "button",
    title: endpoint === "start" ? "Mover inicio de línea" : "Mover final de línea",
    dataset: { endpoint },
    style: {
      left: `${point.x}mm`,
      top: `${point.y}mm`,
    },
    on: {
      pointerdown: (event) => handleLineEndpointPointerDown({ event, block, endpoint, pageElement, controller }),
    },
  });
}
