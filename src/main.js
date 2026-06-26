import { createEditorApp } from "./app/createEditorApp.js";

function start() {
  const rootElement = document.querySelector("#app");

  if (!rootElement) {
    throw new Error("No existe el elemento #app en index.html");
  }

  createEditorApp({ rootElement }).start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
