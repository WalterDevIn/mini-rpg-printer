import {
  colorOpacityControl,
  field,
  numberControl,
  section,
  selectControl,
  textControl,
} from "../../propertyControls.js";
import { updateLabeledStyle } from "../propertyBindings.js";

const LABEL_POSITION_OPTIONS = [
  { value: "placeholder", label: "Placeholder" },
  { value: "fieldsetTopLeft", label: "Fieldset arriba izquierda" },
  { value: "fieldsetTopCenter", label: "Fieldset arriba centro" },
  { value: "fieldsetTopRight", label: "Fieldset arriba derecha" },
  { value: "insideTopLeft", label: "Dentro arriba izquierda" },
  { value: "insideTopRight", label: "Dentro arriba derecha" },
  { value: "outsideTopLeft", label: "Fuera arriba izquierda" },
];

export function renderLabeledSection({ block, controller }) {
  const label = {
    text: block.props.label?.text ?? "Etiqueta",
    position: block.props.label?.position ?? "fieldsetTopLeft",
    fontSizePt: block.props.label?.fontSizePt ?? 8,
    backgroundColor: block.props.label?.backgroundColor ?? "#ffffff",
    backgroundOpacity: block.props.label?.backgroundOpacity ?? 1,
    paddingXmm: block.props.label?.paddingXmm ?? 1,
    paddingYmm: block.props.label?.paddingYmm ?? 0.25,
    marginMm: block.props.label?.marginMm ?? 1,
  };

  return section("Etiqueta", [
    field("Texto", textControl({
      value: label.text,
      placeholder: "Etiqueta",
      onChange: (value) => updateLabeledStyle(controller, { text: value }),
    })),
    field("Posición", selectControl({
      value: label.position,
      options: LABEL_POSITION_OPTIONS,
      onChange: (value) => updateLabeledStyle(controller, { position: value }),
    })),
    field("Tamaño", numberControl({
      value: label.fontSizePt,
      min: 4,
      max: 32,
      step: 1,
      onChange: (value) => updateLabeledStyle(controller, { fontSizePt: value }),
    })),
    field("Fondo etiqueta", colorOpacityControl({
      color: label.backgroundColor,
      opacity: label.backgroundOpacity,
      onColorChange: (value) => updateLabeledStyle(controller, { backgroundColor: value }),
      onOpacityChange: (value) => updateLabeledStyle(controller, { backgroundOpacity: value }),
    }), { className: "property-field--color" }),
    field("Padding X", numberControl({
      value: label.paddingXmm,
      min: 0,
      max: 10,
      step: 0.25,
      onChange: (value) => updateLabeledStyle(controller, { paddingXmm: value }),
    })),
    field("Padding Y", numberControl({
      value: label.paddingYmm,
      min: 0,
      max: 10,
      step: 0.25,
      onChange: (value) => updateLabeledStyle(controller, { paddingYmm: value }),
    })),
    field("Margen", numberControl({
      value: label.marginMm,
      min: 0,
      max: 20,
      step: 0.25,
      onChange: (value) => updateLabeledStyle(controller, { marginMm: value }),
    })),
  ]);
}
