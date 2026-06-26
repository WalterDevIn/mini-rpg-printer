import { PAGE_SPEC } from "../document/printSpec.js";

const STORAGE_KEY = "mini-rpg-printer.editor-settings.v1";

export const DEFAULT_EDITOR_SETTINGS = {
  pageSpec: {
    widthMm: PAGE_SPEC.widthMm,
    heightMm: PAGE_SPEC.heightMm,
    gridMm: PAGE_SPEC.gridMm,
    background: PAGE_SPEC.background,
  },
};

export function loadEditorSettings() {
  try {
    const rawSettings = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSettings) return DEFAULT_EDITOR_SETTINGS;

    return normalizeEditorSettings(JSON.parse(rawSettings));
  } catch {
    return DEFAULT_EDITOR_SETTINGS;
  }
}

export function saveEditorSettings(settings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeEditorSettings(settings)));
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

export function updateEditorSettings(patch) {
  const nextSettings = normalizeEditorSettings({
    ...loadEditorSettings(),
    ...patch,
    pageSpec: {
      ...loadEditorSettings().pageSpec,
      ...patch.pageSpec,
    },
  });

  saveEditorSettings(nextSettings);
  return nextSettings;
}

function normalizeEditorSettings(settings) {
  const pageSpec = settings?.pageSpec ?? {};

  return {
    pageSpec: {
      widthMm: normalizeNumber(pageSpec.widthMm, DEFAULT_EDITOR_SETTINGS.pageSpec.widthMm, 30, 500),
      heightMm: normalizeNumber(pageSpec.heightMm, DEFAULT_EDITOR_SETTINGS.pageSpec.heightMm, 30, 700),
      gridMm: DEFAULT_EDITOR_SETTINGS.pageSpec.gridMm,
      background: pageSpec.background || DEFAULT_EDITOR_SETTINGS.pageSpec.background,
    },
  };
}

function normalizeNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
}
