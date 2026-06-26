export const DEFAULT_COMMON_STYLE = {
  backgroundColor: "#ffffff",
  fontFamily: "Arial",
  fontSizePt: 11,
  hasBorder: true,
  borderRadiusMm: 0,
  layer: 2,
  bold: false,
  italic: false,
  strike: false,
};

export const DEFAULT_TEXT_STYLE = {
  horizontalAlign: "center",
  verticalAlign: "middle",
  hasPadding: true,
};

export function getCommonStyle(block) {
  return {
    ...DEFAULT_COMMON_STYLE,
    fontFamily: block.props.fontFamily ?? DEFAULT_COMMON_STYLE.fontFamily,
    fontSizePt: block.props.fontSizePt ?? DEFAULT_COMMON_STYLE.fontSizePt,
    ...block.props.style,
  };
}

export function getTextStyle(block) {
  return {
    ...DEFAULT_TEXT_STYLE,
    horizontalAlign: block.props.textAlign ?? DEFAULT_TEXT_STYLE.horizontalAlign,
    verticalAlign: block.props.verticalAlign ?? DEFAULT_TEXT_STYLE.verticalAlign,
    ...block.props.textStyle,
  };
}
