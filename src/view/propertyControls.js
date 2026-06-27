import { el } from "../shared/dom.js";

function stopEditorShortcut(event) {
  event.stopPropagation();
}

export function field(label, control, { className = "" } = {}) {
  return el("label", { className: `property-field${className ? ` ${className}` : ""}` }, [
    el("span", { className: "property-field__label", textContent: label }),
    control,
  ]);
}

export function selectControl({ value, options, onChange }) {
  const select = el("select", {
    className: "property-control",
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.value),
    },
  }, options.map((option) => el("option", {
    value: option.value,
    textContent: option.label,
  })));

  select.value = value;
  return select;
}

export function textControl({ value, placeholder = "", onChange }) {
  return el("input", {
    className: "property-control",
    type: "text",
    value,
    attrs: {
      placeholder,
    },
    on: {
      keydown: stopEditorShortcut,
      input: (event) => onChange(event.target.value),
      change: (event) => onChange(event.target.value),
    },
  });
}

export function numberControl({ value, min, max, step = 1, onChange }) {
  function commitValue(event) {
    const nextValue = Number(event.target.value);
    if (Number.isFinite(nextValue)) onChange(nextValue);
  }

  return el("input", {
    className: "property-control",
    type: "number",
    value: String(value),
    attrs: {
      min: String(min),
      max: String(max),
      step: String(step),
    },
    on: {
      keydown: stopEditorShortcut,
      input: commitValue,
      change: commitValue,
    },
  });
}

export function opacityControl({ value, onChange }) {
  return numberControl({
    value,
    min: 0,
    max: 1,
    step: 0.05,
    onChange,
  });
}

export function colorControl({ value, onChange }) {
  return el("input", {
    className: "property-control property-control--color",
    type: "color",
    value,
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.value),
      input: (event) => onChange(event.target.value),
    },
  });
}

export function colorOpacityControl({ color, opacity, onColorChange, onOpacityChange }) {
  return el("div", { className: "property-color-row" }, [
    colorControl({ value: color, onChange: onColorChange }),
    el("div", { className: "property-opacity" }, [
      opacityControl({ value: opacity, onChange: onOpacityChange }),
      el("span", { className: "property-opacity__suffix", textContent: "α" }),
    ]),
  ]);
}

export function checkboxControl({ checked, onChange }) {
  return el("input", {
    className: "property-control property-control--checkbox",
    type: "checkbox",
    checked,
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.checked),
    },
  });
}

export function toggleButton({ label, active, title, onClick }) {
  return el("button", {
    className: `property-toggle${active ? " is-active" : ""}`,
    type: "button",
    title,
    textContent: label,
    on: {
      keydown: stopEditorShortcut,
      click: onClick,
    },
  });
}

export function buttonGroup(children) {
  return el("div", { className: "property-button-group" }, children);
}

export function section(title, children) {
  return el("section", { className: "property-section" }, [
    el("div", { className: "property-section__title", textContent: title }),
    el("div", { className: "property-section__body" }, children),
  ]);
}
