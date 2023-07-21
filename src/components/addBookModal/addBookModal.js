import "./addBookModal.css";
import ratingStarsComponentFactory from "../ratingStars/ratingStars";

export default function addBookModalComponentFactory() {
  let formWrapper;

  const bookModalComponent = new EventTarget();
  bookModalComponent.createBookModalDOMNode = createBookModalDOMNode;

  const ratingStarsComponent = ratingStarsComponentFactory(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--clr-secondary-accent"
    )
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
    formWrapper.querySelector("form").classList.add("popup-entrance-animation");
    formWrapper.classList.add("wrapper-entrance-animation");
  }

  function initEventListeners() {
    formWrapper
      .querySelector('[data-add-book="add"]')
      .addEventListener("click", addBook);

    formWrapper
      .querySelector('[data-add-book="close"]')
      .addEventListener("click", removeAddBookModal);
  }

  function addBook() {
    const bookToAdd = {
      title: "",
      author: "",
      status: "",
      rating: "",
    };
    formWrapper.querySelectorAll("[data-book]").forEach((metaInfo) => {
      if (metaInfo.getAttribute("data-book") === "title") {
        bookToAdd.title = metaInfo.value;
      }
      if (metaInfo.getAttribute("data-book") === "author") {
        bookToAdd.author = metaInfo.value;
      }
      if (metaInfo.getAttribute("data-book") === "status") {
        bookToAdd.status = metaInfo.value;
      }
      if (metaInfo.getAttribute("data-book") === "rating") {
        bookToAdd.rating = metaInfo.value;
      }
    });

    removeAddBookModal();
    const addBookEvent = new CustomEvent("addBook", { detail: { bookToAdd } });
    bookModalComponent.dispatchEvent(addBookEvent);
  }

  function removeAddBookModal(event) {
    formWrapper.classList.add("wrapper-closing-animation");
    formWrapper.querySelector("form").classList.add("popup-closing-animation");
    formWrapper
      .querySelector('[data-add-book="close"]')
      .removeEventListener("click", removeAddBookModal);
    setTimeout(() => {
      formWrapper.style.display = "none";
    }, 400);
  }

  function returnBookModalHTML() {
    return `
            <form class="add-book-form pos-rel" onsubmit="return false;" action="">
                <button data-add-book="close" class="add-book-form__close-button pos-abs clr-white">X</button>
                <h2 class="clr-white mrgn-bottom-700">Add a new book to your list</h2>
                <label>
                    <p>Book Title</p>
                    <input data-book="title" type="text">
                </label>
                <label>
                    <p>Author</p>
                    <input data-book="author" type="text">
                </label>
                <label>
                    <p>Status</p>
                    <input data-book="status" type="text">
                </label>
                <label>
                    <p>Rating</p>
                    ${ratingStarsComponent.returnRatingStarsHTML(5)}
                </label>
                <button data-add-book="add" class="add-book-form__add-button">Add to list</button>
            </form>
`;
  }
}
