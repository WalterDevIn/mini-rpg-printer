import { lineBackgroundToCss } from "./gridCss.js";

export function commonStyleToCss(commonStyle) {
  return {
    zIndex: String(commonStyle.layer),
    color: colorWithOpacity(commonStyle.textColor, commonStyle.textOpacity),
    backgroundColor: colorWithOpacity(commonStyle.backgroundColor, commonStyle.backgroundOpacity),
    borderColor: colorWithOpacity(commonStyle.borderColor, commonStyle.borderOpacity),
    borderStyle: commonStyle.hasBorder ? "solid" : "none",
    borderRadius: `${commonStyle.borderRadiusMm}mm`,
    fontFamily: commonStyle.fontFamily,
    fontSize: `${commonStyle.fontSizePt}pt`,
    fontWeight: commonStyle.bold ? "700" : "400",
    fontStyle: commonStyle.italic ? "italic" : "normal",
    textDecoration: commonStyle.strike ? "line-through" : "none",
  };
}

export function textContainerStyleToCss(textStyle) {
  return {
    padding: `${textStyle.paddingMm}mm`,
    justifyItems: horizontalAlignToGridValue(textStyle.horizontalAlign),
    alignItems: verticalAlignToGridValue(textStyle.verticalAlign),
  };
}

export function textStyleToCss(textStyle) {
  return {
    textAlign: textStyle.horizontalAlign,
  };
}

export function ruledTextContainerStyleToCss(ruledTextStyle) {
  return {
    padding: `${ruledTextStyle.paddingMm}mm`,
    ...lineBackgroundToCss(ruledTextStyle),
  };
}

export function ruledTextStyleToCss(ruledTextStyle) {
  return {
    textAlign: ruledTextStyle.horizontalAlign,
    lineHeight: `${ruledTextStyle.lineHeightMm}mm`,
    transform: `translateY(${lineVerticalAlignToTextOffset(ruledTextStyle.lineVerticalAlign)})`,
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

  if (Number.isNaN(value)) return { r: 31, g: 35, b: 40 };

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function horizontalAlignToGridValue(horizontalAlign) {
  const map = {
    left: "start",
    center: "center",
    right: "end",
  };

  return map[horizontalAlign] ?? "center";
}

function verticalAlignToGridValue(verticalAlign) {
  const map = {
    start: "start",
    middle: "center",
    end: "end",
  };

  return map[verticalAlign] ?? "center";
}

function lineVerticalAlignToTextOffset(verticalAlign) {
  const map = {
    start: "-0.7mm",
    middle: "0mm",
    end: "0.7mm",
  };

  return map[verticalAlign] ?? "0mm";
}
