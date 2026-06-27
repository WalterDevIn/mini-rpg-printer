import { getLineStyle } from "../../../blocks/blockStyle.js";
import { checkboxControl, field, numberControl, section } from "../../propertyControls.js";
import { updateLineStyle } from "../propertyBindings.js";

export function renderLineSection({ block, controller }) {
  const lineStyle = getLineStyle(block);

  return section("Línea", [
    field("Snap 1mm", checkboxControl({
      checked: lineStyle.useMillimeterSnap,
      onChange: (value) => updateLineStyle(controller, { useMillimeterSnap: value }),
    })),
    field("Grosor", numberControl({
      value: lineStyle.thicknessMm,
      min: 0.1,
      max: 10,
      step: 0.25,
      onChange: (value) => updateLineStyle(controller, { thicknessMm: value }),
    })),
    field("Inicio X", numberControl({
      value: lineStyle.start.x,
      min: 0,
      max: block.frame.width,
      step: lineStyle.useMillimeterSnap ? 1 : 0.5,
      onChange: (value) => updateLineStyle(controller, { start: { ...lineStyle.start, x: value } }),
    })),
    field("Inicio Y", numberControl({
      value: lineStyle.start.y,
      min: 0,
      max: block.frame.height,
      step: lineStyle.useMillimeterSnap ? 1 : 0.5,
      onChange: (value) => updateLineStyle(controller, { start: { ...lineStyle.start, y: value } }),
    })),
    field("Final X", numberControl({
      value: lineStyle.end.x,
      min: 0,
      max: block.frame.width,
      step: lineStyle.useMillimeterSnap ? 1 : 0.5,
      onChange: (value) => updateLineStyle(controller, { end: { ...lineStyle.end, x: value } }),
    })),
    field("Final Y", numberControl({
      value: lineStyle.end.y,
      min: 0,
      max: block.frame.height,
      step: lineStyle.useMillimeterSnap ? 1 : 0.5,
      onChange: (value) => updateLineStyle(controller, { end: { ...lineStyle.end, y: value } }),
    })),
  ]);
}
