import { el } from "../../shared/dom.js";
import { colorControl, numberControl, textControl } from "../propertyControls.js";

export function colorReferenceControl({
  label,
  globalColors,
  colorId,
  color,
  opacity,
  onGlobalChange,
  onColorChange,
  onOpacityChange,
}) {
  const selectedGlobalColor = globalColors.find((globalColor) => globalColor.id === colorId);
  const previewHex = selectedGlobalColor?.hex ?? color;
  const previewOpacity = selectedGlobalColor?.opacity ?? opacity;

  return el("details", { className: "color-picker" }, [
    el("summary", { className: "color-picker__summary" }, [
      el("span", {
        className: "color-picker__swatch",
        style: { backgroundColor: colorWithOpacity(previewHex, previewOpacity) },
      }),
      el("span", {
        className: "color-picker__summary-text",
        textContent: selectedGlobalColor ? selectedGlobalColor.name : "Local",
      }),
      el("span", { className: "color-picker__chevron", textContent: "▾" }),
    ]),
    el("div", { className: "color-picker__panel" }, [
      el("div", { className: "color-picker__title", textContent: `Color de ${label.toLowerCase()}` }),
      renderGlobalChoices({ globalColors, colorId, onGlobalChange }),
      el("div", { className: "color-picker__separator" }),
      el("div", { className: "color-picker__subtitle", textContent: "Color local" }),
      el("div", { className: "color-picker__local" }, [
        colorControl({ value: color, onChange: onColorChange }),
        textControl({ value: color, placeholder: "#2563eb", onChange: onColorChange }),
        numberControl({ value: opacity, min: 0, max: 1, step: 0.05, onChange: onOpacityChange }),
      ]),
    ]),
  ]);
}

function renderGlobalChoices({ globalColors, colorId, onGlobalChange }) {
  return el("div", { className: "color-picker__choices" }, [
    colorChoice({
      label: "Local",
      hex: "#ffffff",
      opacity: 0,
      active: !colorId,
      onClick: () => onGlobalChange(""),
    }),
    ...globalColors.map((globalColor) => colorChoice({
      label: globalColor.name,
      hex: globalColor.hex,
      opacity: globalColor.opacity,
      active: colorId === globalColor.id,
      onClick: () => onGlobalChange(globalColor.id),
    })),
  ]);
}

function colorChoice({ label, hex, opacity, active, onClick }) {
  return el("button", {
    className: `color-picker__choice${active ? " is-active" : ""}`,
    type: "button",
    title: label,
    on: { click: onClick },
  }, [
    el("span", {
      className: "color-picker__swatch",
      style: { backgroundColor: colorWithOpacity(hex, opacity) },
    }),
    el("span", { className: "color-picker__choice-label", textContent: label }),
  ]);
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
