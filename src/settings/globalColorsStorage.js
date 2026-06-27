import { createId } from "../shared/createId.js";

const STORAGE_KEY = "mini-rpg-printer.global-colors.v1";
const DEFAULT_COLORS = [];

export function loadGlobalColors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_COLORS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_COLORS;

    return parsed.map(normalizeGlobalColor).filter(Boolean);
  } catch {
    return DEFAULT_COLORS;
  }
}

export function saveGlobalColors(colors) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colors.map(normalizeGlobalColor).filter(Boolean)));
}

export function createGlobalColor({ name = "Color global", hex = "#2563eb", opacity = 1 } = {}) {
  return normalizeGlobalColor({
    id: createId("color"),
    name,
    hex,
    opacity,
  });
}

export function normalizeGlobalColor(color) {
  if (!color || typeof color !== "object") return null;

  return {
    id: String(color.id || createId("color")),
    name: String(color.name || "Color global"),
    hex: normalizeHex(color.hex || color.color || "#2563eb"),
    opacity: clampOpacity(color.opacity),
  };
}

export function normalizeHex(value) {
  const text = String(value ?? "").trim();
  const withHash = text.startsWith("#") ? text : `#${text}`;

  if (/^#[0-9a-fA-F]{6}$/.test(withHash)) return withHash.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return "#2563eb";
}

function clampOpacity(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.min(Math.max(number, 0), 1);
}
