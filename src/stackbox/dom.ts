import type { TSBContentBlock } from "./index";

// ----------------------------------------
// DOM lib, intended to be run in a BROWSER
// ----------------------------------------
export function htmlElementToBlock(el: ChildNode): TSBContentBlock | false {
  // Only include elements and text nodes (ignore comments, etc.)
  if (![1, 3].includes(parseInt(String(el.nodeType), 10))) {
    return false;
  }

  const type = el.nodeName.toLowerCase().replace(/[^a-z]+/g, "");
  const children = Array.from(el.childNodes)
    .map(htmlElementToBlock)
    .filter(Boolean);
  const blockObj = {
    type,
    text: type === "text" ? el.textContent : undefined,
    children: children.length ? children : undefined
  };

  // @ts-ignore
  return blockObj;
}

/**
 * HTML string to JSON
 */
export function htmlToJSON(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return {
    blocks: Array.from(doc.body.childNodes)
      .map(htmlElementToBlock)
      .filter(Boolean)
  };
}

function camelCaseToHyphen(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

/**
 * CSS Styles object to inline string
 */
function styleToString(style: any) {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      style[key] +
      ";",
    ""
  );
}

/**
 * Helper function to create and return a DOM element
 * Example: domEl('div', { text: 'Hello there!', style: { backgroundColor: '#777', padding: 5 }})
 */
export function domEl(
  tag: string,
  attributes: { [key: string]: any } = {},
  children: any[] = []
) {
  const el = document.createElement(tag);

  for (const attr in attributes) {
    // Text content
    if (attr === "text") {
      el.appendChild(document.createTextNode(attributes[attr]));
      continue;
    }
    // innerHTML
    if (attr === "html") {
      el.innerHTML = attributes[attr];
      continue;
    }
    // Style object to inline CSS
    if (attr === "style") {
      el.setAttribute("style", styleToString(attributes[attr]));
      continue;
    }
    // Data attrs
    if (attr.startsWith("data")) {
      el.setAttribute(camelCaseToHyphen(attr), attributes[attr]);
      continue;
    }
    // Events
    if (attr.startsWith("on")) {
      el.addEventListener(
        attr.replace("on", "").toLowerCase(),
        attributes[attr]
      );
      continue;
    }
    // Everything else
    if (attributes.hasOwnProperty(attr)) {
      el.setAttribute(attr, attributes[attr]);
    }
  }

  // Children
  if (children && children.length > 0) {
    const fragment = document.createDocumentFragment();

    children.forEach((child) => {
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      fragment.appendChild(child);
    });

    el.appendChild(fragment);
  }

  return el;
}
