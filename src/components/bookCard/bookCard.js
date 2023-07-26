import "./bookCard.css";
import ratingStarsComponentFactory from "../ratingStars/ratingStars.js";
import readingStatusDropdownFactory from "../readingStatus/readingStatus.js";

export default function bookCardFactory() {
  const bookCardComponent = new EventTarget();
  bookCardComponent.createBookCard = _createBookCard;
  bookCardComponent.onDropDownFocus = _onDropDownFocus;
  bookCardComponent.onDropDownBlur = _onDropDownBlur;

  const ratingStarsComponent = ratingStarsComponentFactory(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--clr-secondary-accent"
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      "--clr-main-accent"
    )
  );

  const readingStatusDropdown = readingStatusDropdownFactory();

  return bookCardComponent;

  function _createBookCard(bookObject) {
    const bookCard = document.createElement("li");
    bookCard.classList.add(
      "book",
      "flex",
      "ai-start",
      "pb-bottom-700",
      "mrgn-bottom-700"
    );
    bookCard.setAttribute("data-book-uuid", bookObject.uuid);
    bookCard.insertAdjacentHTML("afterbegin", returnBookCardHTML());
    bookCard.querySelector('[data-book="title"]').textContent =
      bookObject.title;
    bookCard.querySelector('[data-book="author"]').textContent =
      bookObject.author;
    bookCard.querySelector('[data-book="status"]').textContent =
      bookObject.status;
    readingStatusDropdown.initEventListeners(bookCard);
    readingStatusDropdown.addEventListener("statusupdate", (event) => {
      bookCardComponent.dispatchEvent(
        new CustomEvent("statusupdate", { detail: event.detail })
      );
    });
    bookCard.querySelector(".book-status").addEventListener("blur", (event) => {
      _onDropDownBlur(event, event.target.closest(".book"));
    });

    ratingStarsComponent.colorizeRatingStars(bookObject.rating, bookCard);
    return bookCard;
  }

  function _onDropDownFocus(bookListItem) {
    readingStatusDropdown.onDropDownFocus(bookListItem);
  }

  function _onDropDownBlur(event, bookListItem) {
    readingStatusDropdown.onDropDownBlur(event, bookListItem);
  }

  function returnBookCardHTML() {
    return `<img data-book="image" src="" alt="">
                    <div class="width-100">
                        <header class="flex ai-center jc-sb">
                            <h2 data-book="title" class="fs-book-title"></h2>
                            <div class="flex book__icon-group" >
                              <button>
                                <svg data-book="edit" xmlns="http://www.w3.org/2000/svg" height="22"
                                    viewBox="0 -960 960 960" width="22">
                                    <path
                                        d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z" />
                                </svg>
                              </button>
                              <button>
                                <svg data-book="delete" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" pointer-events="none" />
                                    <path d="M14 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" pointer-events="none" />
                                    <path d="M4 7H20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" pointer-events="none" />
                                    <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" />
                                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" />
                                </svg>
                              </button>
                            </div>
                        </header>
                        <h3 data-book="author" class="fs-book-author mrgn-bottom-500"></h3>
                        ${readingStatusDropdown.returnReadingStatusHTML()}
                        <div>
                            <span>Your rating</span>
                            <div class="flex rating ai-start jc-start">
                            ${ratingStarsComponent.returnRatingStarsHTML(5)}
                            </div>
                        </div>
                    </div>
`;
  }
}
