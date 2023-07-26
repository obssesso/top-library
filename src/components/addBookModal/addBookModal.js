import "./addBookModal.css";
import ratingStarsComponentFactory from "../ratingStars/ratingStars";
import bookFactory from "../../bookFactory.js";
import readingStatusFactory from "../readingStatus/readingStatus.js";

export default function addBookModalComponentFactory(
  book,
  formHeader,
  buttonText,
  mode
) {
  let formWrapper;
  let currentRating;

  const bookModalComponent = new EventTarget();
  bookModalComponent.createBookModalDOMNode = createBookModalDOMNode;

  const readingStatusComponent = readingStatusFactory();

  const ratingStarsComponent = ratingStarsComponentFactory(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--clr-secondary-accent"
    ),
    getComputedStyle(document.documentElement).getPropertyValue("--clr-white")
  );

  return bookModalComponent;

  function createBookModalDOMNode() {
    createFormWrapperNode();
    initEventListeners();
    return formWrapper;
  }

  function createFormWrapperNode() {
    formWrapper = document.createElement("div");

    formWrapper.classList.add(
      "form-wrapper",
      "pos-abs",
      "inset0",
      "grid",
      "pi-center"
    );

    formWrapper.insertAdjacentHTML("afterbegin", returnBookModalHTML());
    currentRating = book.rating;
    ratingStarsComponent.colorizeRatingStars(
      currentRating,
      formWrapper.querySelector('[data-book="rating"]')
    );
    formWrapper.querySelector("form").classList.add("popup-entrance-animation");
    formWrapper.classList.add("wrapper-entrance-animation");
  }

  function initEventListeners() {
    initCorrectButtonListenerAccordingToMode();
    formWrapper
      .querySelector('[data-add-book="close"]')
      .addEventListener("click", removeBookModal);

    formWrapper
      .querySelectorAll("[data-star-number]")
      .forEach((star) => star.addEventListener("click", changeRating));

    formWrapper
      .querySelector(".book-status")
      .addEventListener("click", () =>
        readingStatusComponent.onDropDownFocus(formWrapper)
      );

    readingStatusComponent.initEventListeners(formWrapper);

    function initCorrectButtonListenerAccordingToMode() {
      if (mode == "edit") {
        formWrapper
          .querySelector('[data-add-book="edit"]')
          .addEventListener("click", editBook);
      } else {
        formWrapper
          .querySelector('[data-add-book="add"]')
          .addEventListener("click", addBook);
      }
    }
  }

  function addBook() {
    removeBookModal();
    const addBookEvent = new CustomEvent("addBook", {
      detail: createBookObjectFromUserInput(),
    });
    bookModalComponent.dispatchEvent(addBookEvent);
  }

  function editBook() {
    removeBookModal();
    const bookToEdit = createBookObjectFromUserInput();
    bookToEdit.uuid = book.uuid;
    const editBookEvent = new CustomEvent("editBook", {
      detail: bookToEdit,
    });
    bookModalComponent.dispatchEvent(editBookEvent);
  }

  function createBookObjectFromUserInput() {
    return bookFactory(
      formWrapper.querySelector('[data-book="title"]').value,
      formWrapper.querySelector('[data-book="author"]').value,
      formWrapper.querySelector('[data-book="status"]').textContent,
      currentRating
    );
  }

  function removeBookModal(event) {
    formWrapper.classList.add("wrapper-closing-animation");
    formWrapper.querySelector("form").classList.add("popup-closing-animation");
    formWrapper
      .querySelector('[data-add-book="close"]')
      .removeEventListener("click", removeBookModal);
    setTimeout(() => {
      formWrapper.remove();
    }, 400);
  }

  function changeRating(event) {
    if (currentRating == event.target.dataset.starNumber) {
      currentRating = 0;
    } else {
      currentRating = event.target.dataset.starNumber;
    }
    ratingStarsComponent.colorizeRatingStars(
      currentRating,
      formWrapper.querySelector('[data-book="rating"]')
    );
  }

  function returnBookModalHTML() {
    return `
            <form class="add-book-form pos-rel" onsubmit="return false;" action="">
                <button data-add-book="close" class="add-book-form__close-button pos-abs clr-white">X</button>
                <legend class="clr-white mrgn-bottom-700">${formHeader}</legend>
                <label>
                    <p>Book Title</p>
                    <input data-book="title" type="text" value="${book.title}">
                </label>
                <label>
                    <p>Author</p>
                    <input data-book="author" type="text" value="${
                      book.author
                    }">
                </label>
                <label>
                    <p>Status</p>
                ${readingStatusComponent.returnReadingStatusHTML(book.status)}
                </label>
                <label>
                    <p>Rating</p>
                    <div data-book="rating" class="flex rating jc-start">
                    ${ratingStarsComponent.returnRatingStarsHTML(5)}
                    </div>
                </label>
                <button data-add-book="${mode}" class="add-book-form__add-button">${buttonText}</button>
            </form>
`;
  }
}
