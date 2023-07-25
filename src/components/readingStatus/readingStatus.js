import "./readingStatus.css";
export default function readingStatusComponentFactory() {
  const readingStatusComponent = new EventTarget();
  readingStatusComponent.returnReadingStatusHTML = _returnReadingStatusHTML;
  readingStatusComponent.initEventListeners = _initEventListeners;
  readingStatusComponent.onDropDownFocus = _onDropDownFocus;
  readingStatusComponent.onDropDownBlur = _onDropDownBlur;
  return readingStatusComponent;

  function _initEventListeners(containerObject) {
    containerObject
      .querySelector("[data-book='status-options']")
      .addEventListener("mousedown", (event) => {
        onStatusChoice(containerObject, event.target);
/*         readingStatusComponent.dispatchEvent(
          new CustomEvent("statusupdate", {
            detail: {
              uuid: containerObject.dataset.bookUuid,
              newStatus: event.target.textContent,
            },
          })
        ); */
      });
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

  function _onDropDownBlur(event, parentNode) {
    if (event.target.matches('[data-book="status-option"]')) {
      parentNode.querySelector('[data-book="status-option"]').textContent =
        event.target.textContent;
    }
    parentNode
      .querySelector("[aria-expanded]")
      .setAttribute("aria-expanded", "false");
  }

  function onStatusChoice(parentNode, target) {
    parentNode.querySelector('[data-book="status"]').textContent =
      target.textContent;
  }

  function _returnReadingStatusHTML() {
    return `<div class="reading-status pos-rel">
                            <button aria-label="collapse-button" aria-expanded="false" aria-controls="reading-status"
                                class="bg-color-main book-status mrgn-bottom-200 flex ai-center jc-sb">
                                <span data-book="status">Read</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="22px" height="22px"
                                    viewBox="0 0 24 24" pointer-events="none">
                                    <path d="M7 10l5 5 5-5z" pointer-events="none"/>
                                </svg>
                            </button>
                            <ul data-book="status-options" class="reading-status__listbox  pos-rel bg-color-main-thin" id="reading-status" role="listbox"
                                aria-label="Reading status">
                                <li data-book="status-option" class="clr-white" role="option">Read</li>
                                <li data-book="status-option" class="clr-white" role="option">Want to Read</li>
                                <li data-book="status-option" class="clr-white" role="option">Currently Reading</li>
                            </ul>
                        </div>`;
  }
}
