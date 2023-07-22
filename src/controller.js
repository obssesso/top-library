import bookModelFactory from "./bookModel.js";
import addBookModalComponentFactory from "./components/addBookModal/addBookModal.js";
import bookCardComponentFactory from "./components/bookCard/bookCard.js";

export default function appFactory() {
  /* Function member attributes */
  let bookModel;

  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
      bookList: document.querySelector(".books"),
      addBook: document.querySelector('[data-global-action="add"]'),
      wrapper: document.querySelector('[data-global="wrapper"]'),
    },
  };

  initApp();

  async function initApp() {
    try {
      bookModel = await bookModelFactory();
      fullRenderView();
      initEventListeners();
    } catch (error) {}
  }

  function fullRenderView() {
    let bookCardComponent = bookCardComponentFactory();
    App.$.bookList.replaceChildren(
      ...bookModel
        .getBooks()
        .map((bookObject) => bookCardComponent.createBookCard(bookObject))
    );
  }

  function initEventListeners() {
    let addBookModalComponent;

    initGlobalEvents();
    initBookStorageEvents();
    initBookCardEvents();

    function initGlobalEvents() {
      App.$.addBook.addEventListener("click", () =>
        createBookModalView(
          { title: "", author: "", status: "", rating: "" },
          "Add a new book to your list",
          "Add book",
          "add"
        )
      );
    }

    function initBookStorageEvents() {
      /* When storage has been changed -> rerender View */
      bookModel.addEventListener("update", fullRenderView);
    }

    function initBookCardEvents() {
      addBookCardEvent("click", "[data-star-number]", (book, event) => {
        const newRating = event.target.dataset.starNumber;
        const bookID = book.dataset.bookId;
        bookModel.updateBookRating(bookID, newRating);
      });

      addBookCardEvent("click", '[data-book="delete"]', (book, event) => {
        const bookUUID = book.dataset.bookUuid;
        bookModel.deleteBook(bookUUID);
      });

      addBookCardEvent("click", '[data-book="edit"]', (book, event) => {
        createBookModalView(
          {
            uuid: book.getAttribute("data-book-uuid"),
            title: book.querySelector('[data-book="title"]').textContent,
            author: book.querySelector('[data-book="author"]').textContent,
            status: book.querySelector('[data-book="status"]').textContent,
            rating: bookModel.getBookRating(book.dataset.bookId),
          },
          "Edit this book",
          "Confirm Edit",
          "edit"
        );
      });

      function addBookCardEvent(eventName, selector, handler) {
        App.$.bookList.addEventListener(eventName, (event) => {
          if (event.target.matches(selector)) {
            handler(event.target.closest(".book"), event);
          }
        });
      }
    }

    function createBookModalView(book, formHeader, buttonText, mode) {
      addBookModalComponent = addBookModalComponentFactory(
        book,
        formHeader,
        buttonText,
        mode
      );

      /* Add Book Event dispatched from Modal component*/
      addBookModalComponent.addEventListener("addBook", bookModel.add);
      addBookModalComponent.addEventListener("editBook", bookModel.editBook);

      /* create the Modal view */
      const formWrapper = addBookModalComponent.createBookModalDOMNode();
      const firstChild = App.$.wrapper.firstChild;
      App.$.wrapper.insertBefore(formWrapper, firstChild);
    }
  }
}
