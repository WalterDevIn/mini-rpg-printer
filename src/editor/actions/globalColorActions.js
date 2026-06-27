import { createGlobalColor, normalizeGlobalColor, saveGlobalColors } from "../../settings/globalColorsStorage.js";

export function createGlobalColorActions({ editorState, render }) {
  function commitGlobalColors(colors) {
    editorState.globalColors = colors.map(normalizeGlobalColor).filter(Boolean);
    saveGlobalColors(editorState.globalColors);
    render();
  }

  return {
    addGlobalColor() {
      commitGlobalColors([
        ...editorState.globalColors,
        createGlobalColor({ name: `Color ${editorState.globalColors.length + 1}` }),
      ]);
    },

    updateGlobalColor(colorId, patch) {
      commitGlobalColors(editorState.globalColors.map((color) => (
        color.id === colorId ? { ...color, ...patch } : color
      )));
    },

    deleteGlobalColor(colorId) {
      commitGlobalColors(editorState.globalColors.filter((color) => color.id !== colorId));
    },
  };
}
