import { domEl } from "../dom";

export interface TSBContentBlock {
  _id: string;
  _blockEl: HTMLElement;
  _config: TSBBlockConfig;
  type: string;
  focus: () => void;
  render: () => HTMLElement;
  renderBlock: () => HTMLElement;
}

export type TSBBlockConfig = {
  isEditable?: boolean;
};

export const SB_BLOCK_CONFIG_DEFAULT: TSBBlockConfig = {
  isEditable: true
};

export class SBContentBlock implements TSBContentBlock {
  _id = "";
  _blockEl;
  _config: TSBBlockConfig;
  type = "";

  constructor(config?: TSBBlockConfig) {
    this._id = "some-random-id-generated-here";
    this._config = config || SB_BLOCK_CONFIG_DEFAULT;
    this._blockEl = domEl("div", {
      class: "sb_contentBlock",
      id: this._id
    });
  }

  focus() {
    const fc = this._blockEl.firstChild || this._blockEl;

    // Selection API works more reliably than focus()
    let s = window.getSelection();
    let r = document.createRange();
    r.setStart(fc, fc.childNodes.length);
    r.setEnd(fc, fc.childNodes.length);

    if (s) {
      s.removeAllRanges();
      s.addRange(r);
    }
  }

  isEmpty(): boolean {
    return false;
  }

  render() {
    return domEl("div", { text: "[default block, no content]" });
  }

  // Render content block with wrapper, draggable handles, controls, id, etc.
  renderBlock() {
    console.log("render block:", this.type, this._id);
    this._blockEl.innerHTML = "";
    this._blockEl.appendChild(this.render());
    return this._blockEl;
  }
}
