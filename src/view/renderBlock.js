import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { handleBlockPointerDown, handleResizePointerDown } from "../editor/blockInteraction.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";

function getBlockClassName({ block, editorState, isSelected, isEditing }) {
  return [
    "block",
    `block--${block.type}`,
    isSelected ? "is-selected" : "",
    isEditing ? "is-editing" : "",
    editorState.interaction.pickingBlockId === block.id ? "is-picking" : "",
    editorState.interaction.draggingBlockId === block.id ? "is-dragging" : "",
    editorState.interaction.droppingBlockId === block.id ? "is-dropping" : "",
  ].filter(Boolean).join(" ");
}

function getContentPlaceItems(textStyle) {
  const verticalMap = {
    start: "start",
    middle: "center",
    end: "end",
  };

  const horizontalMap = {
    left: "start",
    center: "center",
    right: "end",
  };

  return `${verticalMap[textStyle.verticalAlign]} ${horizontalMap[textStyle.horizontalAlign]}`;
}

function renderTextBlock({ block, page, pageElement, editorState, controller }) {
  const isSelected = editorState.selection.blockId === block.id;
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const textStyle = getTextStyle(block);

  const blockElement = el("article", {
    className: getBlockClassName({ block, editorState, isSelected, isEditing }),
    style: {
      ...frameToCss(block.frame),
      zIndex: String(commonStyle.layer),
      backgroundColor: commonStyle.backgroundColor,
      borderStyle: commonStyle.hasBorder ? "solid" : "none",
      borderRadius: `${commonStyle.borderRadiusMm}mm`,
      fontFamily: commonStyle.fontFamily,
      fontSize: `${commonStyle.fontSizePt}pt`,
      fontWeight: commonStyle.bold ? "700" : "400",
      fontStyle: commonStyle.italic ? "italic" : "normal",
      textDecoration: commonStyle.strike ? "line-through" : "none",
      textAlign: textStyle.horizontalAlign,
    },
    on: {
      pointerdown: (event) => {
        if (isEditing) return;
        handleBlockPointerDown({ event, block, page, pageElement, editorState, controller });
      },
      contextmenu: (event) => {
        event.preventDefault();
        event.stopPropagation();
        controller.openBlockContextMenu(block.id, event.clientX, event.clientY, readEditedText);
      },
    },
  });

  const content = el("div", {
    className: "block__content block__content--text",
    textContent: block.props.text,
    dataset: { editableId: block.id },
    style: {
      padding: textStyle.hasPadding ? "1mm" : "0",
      placeItems: getContentPlaceItems(textStyle),
    },
    on: {
      pointerdown: (event) => {
        if (isEditing) event.stopPropagation();
      },
      keydown: (event) => {
        if (!isEditing) return;

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          controller.commitTextEdit(readEditedText);
        }

        if (event.key === "Escape") {
          event.preventDefault();
          controller.cancelTextEdit();
        }
      },
    },
  });
  content.contentEditable = isEditing ? "true" : "false";

  blockElement.appendChild(content);

  if (isSelected && !isEditing) {
    blockElement.appendChild(el("button", {
      className: "resize-handle",
      type: "button",
      title: "Redimensionar",
      on: {
        pointerdown: (event) => handleResizePointerDown({ event, block, pageElement, controller }),
      },
    }));
  }

  return blockElement;
}

export function renderBlock(args) {
  if (args.block.type === BLOCK_TYPES.text) {
    return renderTextBlock(args);
  }

  return el("article", {
    className: "block block--unknown",
    style: frameToCss(args.block.frame),
    textContent: `Bloque desconocido: ${args.block.type}`,
  });
}
