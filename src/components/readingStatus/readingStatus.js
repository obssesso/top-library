import "./readingStatus.css";
export default function readingStatusComponentFactory() {
  function _returnReadingStatusHTML() {
    return `<div class="reading-status pos-rel">
                            <button aria-label="collapse-button" aria-expanded="false" aria-controls="reading-status"
                                class="bg-color-main book-status mrgn-bottom-200 flex ai-center jc-sb">
                                <span data-book="status">Read</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="22px" height="22px"
                                    viewBox="0 0 24 24" pointer-events="none">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                            <ul class="reading-status__listbox  pos-rel bg-color-main-thin" id="reading-status" role="listbox"
                                aria-label="Reading status">
                                <li class="mrgn-bottom-400 clr-white" role="option">Read</li>
                                <li class="mrgn-bottom-400 clr-white" role="option">Want to Read</li>
                                <li class="clr-white" role="option">Currently Reading</li>
                            </ul>
                        </div>`;
  }

  function _onDropDownFocus(parentNode) {
    if (
      parentNode
        .querySelector("[aria-expanded]")
        .getAttribute("aria-expanded") == "true"
    ) {
      parentNode
        .querySelector("[aria-expanded]")
        .setAttribute("aria-expanded", "false");
    } else {
      parentNode
        .querySelector("[aria-expanded]")
        .setAttribute("aria-expanded", "true");
    }
  }

  function _onDropDownBlur(parentNode) {
    parentNode
      .querySelector("[aria-expanded]")
      .setAttribute("aria-expanded", "false");
  }

  return {
    returnReadingStatusHTML: _returnReadingStatusHTML,
    onDropDownFocus: _onDropDownFocus,
    onDropDownBlur: _onDropDownBlur,
  };
}
