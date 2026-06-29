import { el, iconButton } from "../shared/dom.js";
import { renderBlock } from "./renderBlock.js";
import { renderRingMargin } from "./renderRingMargin.js";

const A4_SPEC = {
  widthMm: 210,
  heightMm: 297,
};

export function renderPrintPreview({ editorState, controller }) {
  if (editorState.ui?.printPreviewOpen !== true) return null;

  const pages = getPrintablePages(editorState.document.spreads);
  const sheets = createDuplexSheets(pages);

  return el("section", { className: "print-preview" }, [
    el("div", { className: "print-preview__bar" }, [
      el("div", { className: "print-preview__title", textContent: "Previa de impresión doble faz" }),
      el("div", { className: "print-preview__hint", textContent: "Frente: impares · Dorso: pares alineadas para cara/contracara" }),
      iconButton({
        iconClass: "fa-solid fa-xmark",
        label: "Cerrar previa de impresión",
        onClick: () => controller.closePrintPreview(),
      }),
    ]),
    el("div", { className: "print-preview__body" }, sheets.map((sheet, sheetIndex) => renderSheet({
      sheet,
      sheetIndex,
      editorState,
      controller,
    }))),
  ]);
}

function renderSheet({ sheet, sheetIndex, editorState, controller }) {
  return el("article", { className: "print-sheet-preview" }, [
    el("div", { className: "print-sheet-preview__label", textContent: `Hoja física ${sheetIndex + 1}` }),
    el("div", { className: "print-sheet-preview__faces" }, [
      renderSheetFace({ title: "Frente", slots: sheet.front, editorState, controller }),
      renderSheetFace({ title: "Dorso", slots: sheet.back, editorState, controller }),
    ]),
  ]);
}

function renderSheetFace({ title, slots, editorState, controller }) {
  return el("section", { className: "print-face" }, [
    el("div", { className: "print-face__title", textContent: title }),
    el("div", {
      className: "print-face__page",
      style: {
        width: `${A4_SPEC.widthMm}mm`,
        height: `${A4_SPEC.heightMm}mm`,
      },
    }, slots.map((slot) => renderPrintSlot({ slot, editorState, controller }))),
  ]);
}

function renderPrintSlot({ slot, editorState, controller }) {
  if (!slot.page) {
    return el("div", {
      className: "print-slot print-slot--empty",
      style: getSlotStyle(slot),
      textContent: "Vacío",
    });
  }

  const pageElement = el("section", {
    className: "print-slot page page--print",
    style: {
      ...getSlotStyle(slot),
      backgroundColor: editorState.document.pageSpec.background,
    },
  });
  const previewState = createPreviewEditorState(editorState);
  const previewController = createPreviewController(controller);

  pageElement.appendChild(renderRingMargin({ pageSide: slot.pageSide }));

  slot.page.blocks.forEach((block) => {
    pageElement.appendChild(renderBlock({
      block,
      page: slot.page,
      pageElement,
      editorState: previewState,
      controller: previewController,
    }));
  });

  pageElement.appendChild(el("div", {
    className: "print-slot__number",
    textContent: `${slot.pageNumber}`,
  }));

  return pageElement;
}

function getSlotStyle(slot) {
  return {
    left: `${slot.x}mm`,
    top: `${slot.y}mm`,
    width: `${slot.width}mm`,
    height: `${slot.height}mm`,
  };
}

function getPrintablePages(spreads) {
  const pages = [];
  let pageNumber = 1;

  spreads.forEach((spread) => {
    spread.pages.forEach((page) => {
      pages.push({ page, pageNumber });
      pageNumber += 1;
    });
  });

  return pages;
}

function createDuplexSheets(pages) {
  const sheetCount = Math.max(1, Math.ceil(pages.length / 4));

  return Array.from({ length: sheetCount }, (_, sheetIndex) => {
    const firstPageIndex = sheetIndex * 4;
    return {
      front: [
        createSlot(0, pages[firstPageIndex]),
        createSlot(1, pages[firstPageIndex + 2]),
      ],
      back: [
        createSlot(0, pages[firstPageIndex + 1]),
        createSlot(1, pages[firstPageIndex + 3]),
      ],
    };
  });
}

function createSlot(slotIndex, pageEntry) {
  const pageWidth = 105;
  const pageHeight = 147.5;
  const row = slotIndex === 0 ? 0 : 1;

  return {
    page: pageEntry?.page ?? null,
    pageNumber: pageEntry?.pageNumber ?? null,
    pageSide: getPageSideFromNumber(pageEntry?.pageNumber),
    x: 0,
    y: row * pageHeight,
    width: pageWidth,
    height: pageHeight,
  };
}

function getPageSideFromNumber(pageNumber) {
  if (!pageNumber) return "left";
  return pageNumber % 2 === 0 ? "left" : "right";
}

function createPreviewEditorState(editorState) {
  return {
    ...editorState,
    selection: { blockId: null, blockIds: [], pageId: null },
    interaction: {
      mode: "idle",
      editingBlockId: null,
      pickingBlockId: null,
      draggingBlockId: null,
      droppingBlockId: null,
      contextMenu: null,
      marquee: null,
    },
    activeTool: "select",
  };
}

function createPreviewController(controller) {
  return {
    ...controller,
    openBlockContextMenu() {},
    commitTextEdit() {},
    cancelTextEdit() {},
  };
}
