import { getCommonStyle } from "../blocks/blockStyle.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";

export function renderImageBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const image = getImageProps(block);
  const content = image.src
    ? el("img", {
      className: "block__image",
      attrs: {
        src: image.src,
        alt: image.alt,
      },
      style: {
        objectFit: image.objectFit,
      },
    })
    : el("div", {
      className: "block__image-placeholder",
      textContent: "Imagen vacía",
    });

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [content],
  });
}

function getImageProps(block) {
  return {
    src: "",
    alt: "Imagen",
    objectFit: "contain",
    ...block.props.image,
  };
}
