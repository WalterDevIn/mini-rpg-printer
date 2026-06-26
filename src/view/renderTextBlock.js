import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { handleBlockPointerDown, handleResizePointerDown } from "../editor/blockInteraction.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";
import { commonStyleToCss, textContainerStyleToCss, textStyleToCss } from "./blockStyleCss.js";

export function renderTextBlock({ block, page, pageElement, editorState, controller }) {
  const isSelected = editorState.selection.blockId === block.id;
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const textStyle = getTextStyle(block);

  const blockElement = el("article", {
    className: getBlockClassName({ block, editorState, isSelected, isEditing }),
    style: {
      ...frameToCss(block.frame),
      ...commonStyleToCss(commonStyle),
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
    style: textContainerStyleToCss(textStyle),
    on: {
      pointerdown: (event) => {
        if (isEditing) event.stopPropagation();
      },
    },
  });

  const text = el("div", {
    className: "block__text",
    textContent: block.props.text,
    dataset: { editableId: block.id },
    style: textStyleToCss(textStyle),
    on: {
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
  text.contentEditable = isEditing ? "true" : "false";

  content.appendChild(text);
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
