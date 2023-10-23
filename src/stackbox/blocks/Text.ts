import { SBContentBlock } from "./_Base";
import { domEl } from "../dom";

export class TextContentBlock extends SBContentBlock {
  type = "text";

  render() {
    return domEl("div", {
      contenteditable: this._config.isEditable,
      dataPlaceholder: "Start typing here...",
      tabindex: 1
    });
  }
}
