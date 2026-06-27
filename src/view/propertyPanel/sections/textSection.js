import { getTextStyle } from "../../../blocks/blockStyle.js";
import { field, numberControl, section, selectControl } from "../../propertyControls.js";
import { HORIZONTAL_OPTIONS, VERTICAL_OPTIONS } from "../propertyOptions.js";
import { updateTextStyle } from "../propertyBindings.js";

export function renderTextSection({ block, controller }) {
  const textStyle = getTextStyle(block);

  return section("Texto", [
    field("Horizontal", selectControl({
      value: textStyle.horizontalAlign,
      options: HORIZONTAL_OPTIONS,
      onChange: (value) => updateTextStyle(controller, { horizontalAlign: value }),
    })),
    field("Vertical", selectControl({
      value: textStyle.verticalAlign,
      options: VERTICAL_OPTIONS,
      onChange: (value) => updateTextStyle(controller, { verticalAlign: value }),
    })),
    field("Relleno", numberControl({
      value: textStyle.paddingMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateTextStyle(controller, { paddingMm: value }),
    })),
  ]);
}
