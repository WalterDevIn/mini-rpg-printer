import { getLineStyle } from "../../../blocks/blockStyle.js";
import { field, numberControl, section, selectControl } from "../../propertyControls.js";
import { LINE_ANGLE_OPTIONS } from "../propertyOptions.js";
import { updateLineStyle } from "../propertyBindings.js";

export function renderLineSection({ block, controller }) {
  const lineStyle = getLineStyle(block);

  return section("Línea", [
    field("Ángulo", selectControl({
      value: String(lineStyle.angleDeg),
      options: LINE_ANGLE_OPTIONS,
      onChange: (value) => updateLineStyle(controller, { angleDeg: Number(value) }),
    })),
    field("Grosor", numberControl({
      value: lineStyle.thicknessMm,
      min: 0.25,
      max: 5,
      step: 0.25,
      onChange: (value) => updateLineStyle(controller, { thicknessMm: value }),
    })),
  ]);
}
