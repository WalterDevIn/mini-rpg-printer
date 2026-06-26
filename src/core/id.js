let idCounter = 0;

export function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  idCounter += 1;
  return `id-${Date.now()}-${idCounter}`;
}
