import { getRuledTextStyle } from "../../../blocks/blockStyle.js";
import {
  checkboxControl,
  colorOpacityControl,
  field,
  numberControl,
  section,
  selectControl,
} from "../../propertyControls.js";
import { HORIZONTAL_OPTIONS, VERTICAL_OPTIONS } from "../propertyOptions.js";
import { updateRuledTextStyle } from "../propertyBindings.js";

export function renderRuledTextSection({ block, controller }) {
  const ruledTextStyle = getRuledTextStyle(block);

  return section("Texto normal", [
    field("Horizontal", selectControl({
      value: ruledTextStyle.horizontalAlign,
      options: HORIZONTAL_OPTIONS,
      onChange: (value) => updateRuledTextStyle(controller, { horizontalAlign: value }),
    })),
    field("Vertical línea", selectControl({
      value: ruledTextStyle.lineVerticalAlign,
      options: VERTICAL_OPTIONS,
      onChange: (value) => updateRuledTextStyle(controller, { lineVerticalAlign: value }),
    })),
    field("Relleno", numberControl({
      value: ruledTextStyle.paddingMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateRuledTextStyle(controller, { paddingMm: value }),
    })),
    field("Mostrar líneas", checkboxControl({
      checked: ruledTextStyle.showLines,
      onChange: (value) => updateRuledTextStyle(controller, { showLines: value }),
    })),
    field("Líneas", colorOpacityControl({
      color: ruledTextStyle.lineColor,
      opacity: ruledTextStyle.lineOpacity,
      onColorChange: (value) => updateRuledTextStyle(controller, { lineColor: value }),
      onOpacityChange: (value) => updateRuledTextStyle(controller, { lineOpacity: value }),
    }), { className: "property-field--color" }),
  ]);
}
