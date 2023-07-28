import bookModelFactory from "./bookModel.js";
import addBookModalComponentFactory from "./components/addBookModal/addBookModal.js";
import bookCardComponentFactory from "./components/bookCard/bookCard.js";

export default function appFactory() {
  /* Function member attributes */
  let bookModel;
  const bookCardComponent = bookCardComponentFactory();

  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
      bookList: document.querySelector(".books"),
      addBook: document.querySelector('[data-global-action="add"]'),
      wrapper: document.querySelector('[data-global="wrapper"]'),
      searchBar: document.querySelector('[data-app="search-book-in-list"]'),
      filterContainer: document.querySelector(".filter-container"),
      filterButton: document.querySelector('[data-app="filter-button"]'),
      filterSection: document.querySelector('[data-app="filter-options"]'),
      filter: document.querySelectorAll("[data-filter] input[type='checkbox']"),
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

      const debouncedSearchInList = debounce(
        (searchTerm) => bookModel.updateSearch(searchTerm),
        400
      );
      App.$.searchBar.addEventListener("input", (event) =>
        debouncedSearchInList(event.target.value)
      );

      function debounce(cb, delay) {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          document.querySelector(
            '[data-app="search-in-list-loader"]'
          ).style.display = "block";
          timeout = setTimeout(() => {
            cb(...args);
            document.querySelector(
              '[data-app="search-in-list-loader"]'
            ).style.display = "none";
          }, delay);
        };
      }

      App.$.filterButton.addEventListener("click", openFilterSection);
      document.addEventListener("click", closeFilterSectionBlur);

      function closeFilterSectionBlur(event) {
        if (
          !event.target.closest(".filter-container") &&
          App.$.filterButton.getAttribute("aria-expanded") == "true"
        ) {
          App.$.filterSection.style.display = "none";
          App.$.filterButton.setAttribute("aria-expanded", "false");
        }
      }

      function openFilterSection(event) {
        if (App.$.filterButton.getAttribute("aria-expanded") == "true") {
          App.$.filterButton.setAttribute("aria-expanded", "false");
          App.$.filterSection.style.display = "none";
        } else {
          App.$.filterButton.setAttribute("aria-expanded", "true");
          App.$.filterSection.style.display = "block";
        }
      }

      App.$.filter.forEach((filter) =>
        filter.addEventListener("click", onFilterClick.bind(filter))
      );
      function onFilterClick(event) {
        const filter =
          this.parentNode.querySelector("[data-filter-name]").textContent;
        if (event.target.checked) {
          //check if checked or unchecke
          bookModel.addReadingStatusFilter(filter);
        } else {
          bookModel.deleteReadingStatusFilter(filter);
        }
      }
    }

    function initBookStorageEvents() {
      /* When storage has been changed -> rerender View */
      bookModel.addEventListener("update", fullRenderView);
    }

    function initBookCardEvents() {
      bookCardComponent.addEventListener("statusupdate", (event) =>
        bookModel.updateReadingStatus(event.detail.uuid, event.detail.newStatus)
      );
      addBookCardEvent("click", "[data-star-number]", (bookListItem, event) => {
        const newRating = event.target.dataset.starNumber;
        const bookID = bookListItem.dataset.bookUuid;
        bookModel.updateBookRating(bookID, newRating);
      });

      addBookCardEvent(
        "click",
        '[data-book="delete"]',
        (bookListItem, event) => {
          const bookUUID = bookListItem.dataset.bookUuid;
          bookModel.deleteBook(bookUUID);
        }
      );

      addBookCardEvent("click", '[data-book="edit"]', (bookListItem, event) => {
        createBookModalView(
          {
            uuid: bookListItem.getAttribute("data-book-uuid"),
            title: bookListItem.querySelector('[data-book="title"]')
              .textContent,
            author: bookListItem.querySelector('[data-book="author"]')
              .textContent,
            status: bookListItem.querySelector('[data-book="status"]')
              .textContent,
            rating: bookModel.getBookRating(bookListItem.dataset.bookUuid),
          },
          "Edit this book",
          "Confirm Edit",
          "edit"
        );
      });

      addBookCardEvent(
        "mousedown",
        '[data-book="status-option"]',
        (bookListItem, event) => {
          const bookUUID = bookListItem.dataset.bookUuid;
          bookModel.updateReadingStatus(bookUUID, event.target.textContent);
        }
      );

      addBookCardEvent(
        "click",
        '[aria-label="collapse-button"]',
        (bookListItem, event) => {
          bookCardComponent.onDropDownFocus(bookListItem);
        }
      );

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
