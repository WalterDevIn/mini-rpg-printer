export function el(tagName, options = {}, children = []) {
  const element = document.createElement(tagName);

  if (options.className) element.className = options.className;
  if (options.textContent !== undefined) element.textContent = options.textContent;
  if (options.innerHTML !== undefined) element.innerHTML = options.innerHTML;
  if (options.title) element.title = options.title;
  if (options.type) element.type = options.type;
  if (options.disabled !== undefined) element.disabled = options.disabled;

  Object.entries(options.dataset ?? {}).forEach(([key, value]) => {
    element.dataset[key] = value;
  });

  Object.entries(options.style ?? {}).forEach(([key, value]) => {
    element.style[key] = value;
  });

  Object.entries(options.on ?? {}).forEach(([eventName, handler]) => {
    element.addEventListener(eventName, handler);
  });

  children.forEach((child) => {
    if (child === null || child === undefined) return;
    element.append(child);
  });

  return element;
}

export function icon(className) {
  return el("i", {
    className,
    innerHTML: "",
  });
}

export function iconButton({ iconClass, label, disabled = false, onClick }) {
  return el(
    "button",
    {
      className: "icon-button",
      type: "button",
      title: label,
      disabled,
      on: { click: onClick },
    },
    [icon(iconClass), el("span", { className: "sr-only", textContent: label })],
  );
}
