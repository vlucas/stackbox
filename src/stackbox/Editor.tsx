import * as React from "react";
import { domEl } from "./dom";
import { TextContentBlock } from "./blocks/Text";

// Types
import type { TSBJSONFormat } from "./index";
import type { TSBContentBlock } from "./blocks/_Base";

/**
 * Stackbox Editor
 */
export class StackboxEditor {
  name: string;
  json?: TSBJSONFormat;
  blocks: TSBContentBlock[];
  _baseEl: HTMLElement;

  constructor(name: string, json?: TSBJSONFormat) {
    this.name = name.replace(/[^\W]+/g, "");
    this.blocks = [];
    this._baseEl = domEl("div", {
      id: `sb_editor_${name}`,
      class: "sb_editor",
      contenteditable: false, // @NOTE: This makes a NESTED contenteditable div with blocks...
      onKeyDown: this.onKeyDown.bind(this)
    });

    if (json) {
      this.fromJSON(json);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    const keyCode = e.keyCode;

    switch (keyCode) {
      case 13: // Enter or Return (new line)
        if (e.shiftKey) {
          return;
        }
        this.addBlock(new TextContentBlock());
        e.preventDefault();
        return;
    }
    //console.log("key press =", e.keyCode);
  }

  getBlocks() {
    return this.blocks;
  }

  addBlock(block: TSBContentBlock, position?: number) {
    const pos = position ? position : this.blocks.length;
    this.blocks.splice(pos, 0, block);

    const blockEl = block.renderBlock();

    // Insert at same DOM position
    this._baseEl.insertBefore(blockEl, this._baseEl.childNodes[pos]);
    block.focus();
  }

  toJSON() {
    return this.json;
  }

  fromJSON(json: TSBJSONFormat) {
    this.json = json;
  }

  renderInto(el: HTMLElement) {
    if (this.blocks.length === 0) {
      this.blocks.push(new TextContentBlock());
    }

    this.blocks.forEach((block) => {
      this._baseEl.appendChild(block.renderBlock());
    });

    el.innerHTML = "";
    el.appendChild(this._baseEl);

    return this._baseEl;
  }
}

/**
 * Create new Editor object to track changes, etc.
 */
export function createStackboxEditor() {
  return new StackboxEditor("myEditor");
}

/**
 * React Editor component
 * Used to mount Stackbox into a React Node
 */
export function ReactEditor({ editor }: { editor: StackboxEditor }) {
  const el = React.useRef(null);

  React.useEffect(() => {
    if (el.current) {
      editor.renderInto(el.current);
    }
  }, [editor]);

  return (
    <div className="sb_editor" ref={el}>
      Loading...
    </div>
  );
}
