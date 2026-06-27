import { getInternalGridStyle } from "../../../blocks/blockStyle.js";
import { colorOpacityControl, field, section } from "../../propertyControls.js";
import { updateGridColor, updateInternalGridStyle } from "../propertyBindings.js";

export function renderGridSection({ block, controller }) {
  const gridStyle = getInternalGridStyle(block);

  return section("Cuadrícula interna", [
    field("Cuadrícula", colorOpacityControl({
      color: gridStyle.color,
      opacity: gridStyle.opacity,
      onColorChange: (value) => updateGridColor(controller, value),
      onOpacityChange: (value) => updateInternalGridStyle(controller, { opacity: value }),
    }), { className: "property-field--color" }),
  ]);
}
