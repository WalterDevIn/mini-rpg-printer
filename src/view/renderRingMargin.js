import { el } from "../shared/dom.js";

const RING_SQUARE_COUNT = 11;

export function renderRingMargin({ pageSide }) {
  return el("div", {
    className: `ring-margin ring-margin--${pageSide}`,
    attrs: {
      "aria-hidden": "true",
    },
  }, Array.from({ length: RING_SQUARE_COUNT }, () => el("div", {
    className: "ring-margin__slot",
  }, [
    el("div", { className: "ring-margin__connector" }),
  ])));
}
