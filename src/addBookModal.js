import "./addBookModal.css";

export default function addBookModalComponentFactory() {
  let formWrapper;

  const bookModalComponent = new EventTarget();
  bookModalComponent.createBookModalDOMNode = createBookModalDOMNode;

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

    const addBookEvent = new CustomEvent("addBook", { detail: { bookToAdd } });
    bookModalComponent.dispatchEvent(addBookEvent);
  }

  function removeAddBookModal() {
    formWrapper.classList.add("wrapper-closing-animation");
    formWrapper.querySelector("form").classList.add("popup-closing-animation");
    setTimeout(() => {
      formWrapper
        .querySelector('[data-addBook="close"]')
        .removeEventListener("click", removeAddBookModal);
      formWrapper.remove();
    }, 600);
  }

  return bookModalComponent;
}

function returnBookModalHTML() {
  return `
            <form class="add-book-form pos-rel" action="">
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
                    <input data-book="rating" type="text">
                </label>
                <button data-add-book="add" class="add-book-form__add-button">Add to list</button>
            </form>
`;
}
