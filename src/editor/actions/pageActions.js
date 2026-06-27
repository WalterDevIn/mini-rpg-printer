import {
  addFirstSinglePage,
  addLastSinglePage,
  addSpread as addSpreadToDocument,
  deleteSpread as deleteSpreadFromDocument,
  duplicateSpreadAfter,
  insertSpreadAfter,
} from "../../document/documentCommands.js";
import { updateEditorSettings } from "../../settings/editorSettingsStorage.js";
import { createSelection } from "../selectionHelpers.js";

export function createPageActions({ editorState, render, mutateDocument }) {
  function clearPageInteraction() {
    editorState.selection = createSelection([]);
    editorState.interaction.contextMenu = null;
    editorState.interaction.editingBlockId = null;
  }

  return {
    addSpread() {
      mutateDocument((documentModel) => addSpreadToDocument(documentModel));
      clearPageInteraction();
      render();
    },

    insertSpreadAfter(spreadIndex) {
      mutateDocument((documentModel) => insertSpreadAfter(documentModel, spreadIndex));
      clearPageInteraction();
      render();
    },

    duplicateSpread(spreadIndex) {
      mutateDocument((documentModel) => duplicateSpreadAfter(documentModel, spreadIndex));
      clearPageInteraction();
      render();
    },

    deleteSpread(spreadIndex) {
      mutateDocument((documentModel) => deleteSpreadFromDocument(documentModel, spreadIndex));
      clearPageInteraction();
      render();
    },

    addFirstSinglePage() {
      mutateDocument((documentModel) => addFirstSinglePage(documentModel));
      clearPageInteraction();
      render();
    },

    addLastSinglePage() {
      mutateDocument((documentModel) => addLastSinglePage(documentModel));
      clearPageInteraction();
      render();
    },

    updatePageSize(patch) {
      const nextSettings = updateEditorSettings({ pageSpec: patch });
      editorState.settings = nextSettings;
      mutateDocument((documentModel) => {
        documentModel.pageSpec = nextSettings.pageSpec;
        documentModel.intent = {
          ...documentModel.intent,
          snapUnitMm: nextSettings.pageSpec.gridMm,
        };
        return documentModel;
      });
      render();
    },

    toggleGrid() {
      editorState.viewport.showGrid = !editorState.viewport.showGrid;
      render();
    },

    togglePageMargin() {
      editorState.viewport.showPageMargin = !editorState.viewport.showPageMargin;
      render();
    },
  };
}
