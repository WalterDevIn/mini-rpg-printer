import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { createBlockElement, createEditableTextElement } from "./blockChrome.js";
import { textContainerStyleToCss, textStyleToCss } from "./blockStyleCss.js";

export function renderLabeledBlock({ block, page, pageElement, editorState, controller }) {
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const textStyle = getTextStyle(block);
  const label = getLabelProps(block);

  const content = el("div", {
    className: "block__content block__content--labeled",
    style: textContainerStyleToCss(textStyle),
    on: {
      pointerdown: (event) => {
        if (isEditing) event.stopPropagation();
      },
    },
  }, [
    createEditableTextElement({
      block,
      isEditing,
      controller,
      style: textStyleToCss(textStyle),
    }),
    label.position === "placeholder" && !block.props.text
      ? el("span", { className: "labeled-block__placeholder", textContent: label.text })
      : null,
  ]);

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [
      label.position === "placeholder" ? null : el("span", {
        className: `labeled-block__label labeled-block__label--${label.position}`,
        textContent: label.text,
        style: labelToCss(label),
      }),
      content,
    ],
  });
}

function getLabelProps(block) {
  return {
    text: block.props.label?.text ?? "Etiqueta",
    position: block.props.label?.position ?? "fieldsetTopLeft",
    fontSizePt: block.props.label?.fontSizePt ?? 8,
    backgroundColor: block.props.label?.backgroundColor ?? "#ffffff",
    backgroundOpacity: clampNumber(block.props.label?.backgroundOpacity, 0, 1, 1),
    paddingXmm: clampNumber(block.props.label?.paddingXmm, 0, 10, 1),
    paddingYmm: clampNumber(block.props.label?.paddingYmm, 0, 10, 0.25),
    marginMm: clampNumber(block.props.label?.marginMm, 0, 20, 1),
  };
}

function labelToCss(label) {
  return {
    fontSize: `${label.fontSizePt}pt`,
    backgroundColor: colorWithOpacity(label.backgroundColor, label.backgroundOpacity),
    padding: `${label.paddingYmm}mm ${label.paddingXmm}mm`,
    "--label-margin": `${label.marginMm}mm`,
  };
}

function colorWithOpacity(hex, opacity) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
}

function hexToRgb(hex) {
  const normalized = String(hex ?? "").replace("#", "");
  const value = Number.parseInt(normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized, 16);

  if (Number.isNaN(value)) return { r: 255, g: 255, b: 255 };

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function clampNumber(value, min, max, fallback) {
  if (typeof value !== "number") return fallback;
  return Math.min(Math.max(value, min), max);
}
