/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/bookFactory.js":
/*!****************************!*\
  !*** ./src/bookFactory.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bookFactory)
/* harmony export */ });
function bookFactory(title, author, status, rating) {
  return {
    title,
    author,
    status,
    rating
  };
}

/***/ }),

/***/ "./src/bookModel.js":
/*!**************************!*\
  !*** ./src/bookModel.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bookModelFactory)
/* harmony export */ });
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/helpers.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");



async function bookModelFactory() {
  let db;
  let books;
  let searchFilter = "";
  let readingStatusFilter = [];
  const bookStatus = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__["default"])(["Read", "Want to Read", "Currently Reading"]);

  /* Why does this give "invalid invocator error on .addEventListener, whats the difference to constructor function?" */
  /*   let bookModel = Object.create(EventTarget.prototype); */

  const bookModel = new EventTarget();
  bookModel.add = _add;
  bookModel.editBook = _editBook;
  bookModel.getBooks = _getBooks;
  bookModel.updateBookRating = _updateBookRating;
  bookModel.updateReadingStatus = _updateReadingStatus;
  bookModel.getBookRating = _getBookRating;
  bookModel.deleteBook = _deleteBook;
  bookModel.updateSearch = _updateSearch;
  bookModel.addReadingStatusFilter = _addReadingStatusFilter;
  bookModel.deleteReadingStatusFilter = _deleteReadingStatusFilter;
  await initModel();
  return bookModel;
  async function initModel() {
    books = [];
    await getAllBooks();
  }
  function getDatabase() {
    return (0,idb__WEBPACK_IMPORTED_MODULE_0__.openDB)("bookStorage", 1, {
      upgrade
    });
  }
  function upgrade(db) {
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", {
        keyPath: "uuid"
      });
    }
  }
  async function getAllBooks() {
    try {
      db = await getDatabase();
      const transaction = db.transaction(["books"], "readonly");
      const store = transaction.objectStore("books");
      books = await store.getAll();
    } catch (error) {
      console.log(error);
    }
  }
  function _add(addBookEvent) {
    const bookToAdd = addBookEvent.detail;
    bookToAdd.uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_2__["default"])();
    books.push(bookToAdd);
    try {
      update();
    } catch (error) {
      console.log("schaisinn");
    }
  }
  function _editBook(editBookEvent) {
    const bookToEdit = editBookEvent.detail;
    books = books.map(book => {
      if (book.uuid == bookToEdit.uuid) return bookToEdit;
      return book;
    });
    try {
      update();
    } catch (error) {
      console.log("schaisinn");
    }
  }
  function _updateBookRating(bookUUID, newRating) {
    books = books.map(book => {
      if (book.uuid != bookUUID) return book;
      if (book.rating == newRating) {
        book.rating = "";
      } else {
        book.rating = newRating;
      }
      return book;
    });
    update();
  }
  function _getBookRating(bookUUID) {
    return books.find(book => book.uuid == bookUUID).rating;
  }
  async function _deleteBook(bookUUID) {
    books = books.filter(book => book.uuid != bookUUID);
    try {
      const transaction = db.transaction("books", "readwrite");
      const objectStore = transaction.objectStore("books");
      await objectStore.delete(bookUUID);
      bookModel.dispatchEvent(new CustomEvent("update"));
    } catch (error) {
      bookModel.dispatchEvent(new CustomEvent("updateFailure"));
    }
  }
  function _updateReadingStatus(bookUUID, newStatus) {
    books = books.map(book => {
      if (book.uuid == bookUUID) {
        book.status = newStatus;
      }
      return book;
    });
    update();
  }
  async function _updateSearch(searchTerm) {
    searchFilter = searchTerm.trim();
    bookModel.dispatchEvent(new CustomEvent("update"));
  }
  async function _addReadingStatusFilter(readingStatusFilterTerm) {
    readingStatusFilter.push(readingStatusFilterTerm);
    bookModel.dispatchEvent(new CustomEvent("update"));
  }
  async function _deleteReadingStatusFilter(readingStatusFilterTerm) {
    readingStatusFilter = readingStatusFilter.filter(filter => filter != readingStatusFilterTerm);
    bookModel.dispatchEvent(new CustomEvent("update"));
  }
  async function update() {
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    try {
      await books.forEach(book => store.put(book));
      bookModel.dispatchEvent(new CustomEvent("update"));
    } catch (error) {
      bookModel.dispatchEvent(new CustomEvent("updateFailure"));
    }

    /* Why does this not work? */
    /*     try {
      const bla = await Promise.all(books.map((book) => store.put(book)));
    } catch (error) {
      console.log("bla");
    } */
  }

  function _getBooks() {
    let booksToReturn = books;
    if (searchFilter != "") {
      const pattern = new RegExp(searchFilter, "i");
      booksToReturn = books.filter(book => {
        return pattern.test(book.title) || pattern.test(book.author);
      });
    }
    if (readingStatusFilter.length != 0) {
      booksToReturn = booksToReturn.filter(book => {
        return readingStatusFilter.includes(book.status);
      });
    }
    return booksToReturn;
  }
}

/***/ }),

/***/ "./src/components/addBookModal/addBookModal.js":
/*!*****************************************************!*\
  !*** ./src/components/addBookModal/addBookModal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addBookModalComponentFactory)
/* harmony export */ });
/* harmony import */ var _addBookModal_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addBookModal.css */ "./src/components/addBookModal/addBookModal.css");
/* harmony import */ var _ratingStars_ratingStars__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ratingStars/ratingStars */ "./src/components/ratingStars/ratingStars.js");
/* harmony import */ var _bookFactory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../bookFactory.js */ "./src/bookFactory.js");
/* harmony import */ var _readingStatus_readingStatus_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../readingStatus/readingStatus.js */ "./src/components/readingStatus/readingStatus.js");




function addBookModalComponentFactory(book, formHeader, buttonText, mode) {
  let formWrapper;
  let currentRating;
  const bookModalComponent = new EventTarget();
  bookModalComponent.createBookModalDOMNode = createBookModalDOMNode;
  const readingStatusComponent = (0,_readingStatus_readingStatus_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const ratingStarsComponent = (0,_ratingStars_ratingStars__WEBPACK_IMPORTED_MODULE_1__["default"])(getComputedStyle(document.documentElement).getPropertyValue("--clr-secondary-accent"), getComputedStyle(document.documentElement).getPropertyValue("--clr-white"));
  return bookModalComponent;
  function createBookModalDOMNode() {
    createFormWrapperNode();
    initEventListeners();
    return formWrapper;
  }
  function createFormWrapperNode() {
    formWrapper = document.createElement("div");
    formWrapper.classList.add("form-wrapper", "inset0", "grid", "pi-center", "pos-fixed");
    formWrapper.insertAdjacentHTML("afterbegin", returnBookModalHTML());
    currentRating = book.rating;
    ratingStarsComponent.colorizeRatingStars(currentRating, formWrapper.querySelector('[data-book="rating"]'));
    formWrapper.querySelector("form").classList.add("popup-entrance-animation");
    formWrapper.classList.add("wrapper-entrance-animation");
  }
  function initEventListeners() {
    initCorrectButtonListenerAccordingToMode();
    formWrapper.querySelector('[data-add-book="close"]').addEventListener("click", removeBookModal);
    formWrapper.querySelectorAll("[data-star-number]").forEach(star => star.addEventListener("click", changeRating));
    formWrapper.querySelector(".book-status").addEventListener("click", event => readingStatusComponent.onDropDownFocus(formWrapper, event));
    readingStatusComponent.initEventListeners(formWrapper);
    function initCorrectButtonListenerAccordingToMode() {
      if (mode == "edit") {
        formWrapper.querySelector('[data-add-book="edit"]').addEventListener("click", editBook);
      } else {
        formWrapper.querySelector('[data-add-book="add"]').addEventListener("click", addBook);
      }
    }
  }
  function addBook() {
    removeBookModal();
    const addBookEvent = new CustomEvent("addBook", {
      detail: createBookObjectFromUserInput()
    });
    bookModalComponent.dispatchEvent(addBookEvent);
  }
  function editBook() {
    removeBookModal();
    const bookToEdit = createBookObjectFromUserInput();
    bookToEdit.uuid = book.uuid;
    const editBookEvent = new CustomEvent("editBook", {
      detail: bookToEdit
    });
    bookModalComponent.dispatchEvent(editBookEvent);
  }
  function createBookObjectFromUserInput() {
    return (0,_bookFactory_js__WEBPACK_IMPORTED_MODULE_2__["default"])(formWrapper.querySelector('[data-book="title"]').value, formWrapper.querySelector('[data-book="author"]').value, formWrapper.querySelector('[data-book="status"]').textContent, currentRating);
  }
  function removeBookModal(event) {
    formWrapper.classList.add("wrapper-closing-animation");
    formWrapper.querySelector("form").classList.add("popup-closing-animation");
    formWrapper.querySelector('[data-add-book="close"]').removeEventListener("click", removeBookModal);
    setTimeout(() => {
      formWrapper.remove();
    }, 400);
  }
  function changeRating(event) {
    event.stopPropagation();
    if (currentRating == event.target.dataset.starNumber) {
      currentRating = 0;
    } else {
      currentRating = event.target.dataset.starNumber;
    }
    ratingStarsComponent.colorizeRatingStars(currentRating, formWrapper.querySelector('[data-book="rating"]'));
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
                    <input data-book="author" type="text" value="${book.author}">
                </label>
                <label>
                    <p>Status</p>
                ${readingStatusComponent.returnReadingStatusHTML(book.status)}
                </label>
                <label class="rating">
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

/***/ }),

/***/ "./src/components/bookCard/bookCard.js":
/*!*********************************************!*\
  !*** ./src/components/bookCard/bookCard.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bookCardFactory)
/* harmony export */ });
/* harmony import */ var _bookCard_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bookCard.css */ "./src/components/bookCard/bookCard.css");
/* harmony import */ var _ratingStars_ratingStars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ratingStars/ratingStars.js */ "./src/components/ratingStars/ratingStars.js");
/* harmony import */ var _readingStatus_readingStatus_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../readingStatus/readingStatus.js */ "./src/components/readingStatus/readingStatus.js");



function bookCardFactory() {
  const bookCardComponent = new EventTarget();
  bookCardComponent.createBookCard = _createBookCard;
  bookCardComponent.onDropDownFocus = _onDropDownFocus;
  bookCardComponent.onDropDownBlur = _onDropDownBlur;
  const ratingStarsComponent = (0,_ratingStars_ratingStars_js__WEBPACK_IMPORTED_MODULE_1__["default"])(getComputedStyle(document.documentElement).getPropertyValue("--clr-secondary-accent"), getComputedStyle(document.documentElement).getPropertyValue("--clr-main-accent"));
  const readingStatusDropdown = (0,_readingStatus_readingStatus_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return bookCardComponent;
  function _createBookCard(bookObject) {
    const bookCard = document.createElement("li");
    bookCard.classList.add("book", "pos-rel", "flex", "ai-start", "pb-bottom-700", "mrgn-bottom-700");
    bookCard.setAttribute("data-book-uuid", bookObject.uuid);
    bookCard.insertAdjacentHTML("afterbegin", returnBookCardHTML());
    bookCard.querySelector('[data-book="title"]').textContent = bookObject.title;
    bookCard.querySelector('[data-book="author"]').textContent = bookObject.author;
    bookCard.querySelector('[data-book="status"]').textContent = bookObject.status;
    readingStatusDropdown.initEventListeners(bookCard);
    readingStatusDropdown.addEventListener("statusupdate", event => {
      bookCardComponent.dispatchEvent(new CustomEvent("statusupdate", {
        detail: event.detail
      }));
    });
    bookCard.querySelector(".book-status").addEventListener("blur", event => {
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

/***/ }),

/***/ "./src/components/ratingStars/ratingStars.js":
/*!***************************************************!*\
  !*** ./src/components/ratingStars/ratingStars.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ratingStarsComponentFactory)
/* harmony export */ });
function ratingStarsComponentFactory(starFill, starStroke) {
  function returnRatingStarsHTML(numberOfStars) {
    let ratingString = "";
    for (let i = numberOfStars; i >= 1; i--) {
      ratingString += `<svg data-star-number=${i} width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                         stroke= "hsl(${starStroke})" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
                     </svg>`;
    }
    return ratingString;
  }
  function colorizeRatingStars(rating, objectThatsRated) {
    decolorAllStars(); //always reset all Stars before recolorizing according to new rating

    if (!rating) return;
    const maxColorizedStar = objectThatsRated.querySelector(`[data-star-number="${rating}"]`);
    maxColorizedStar.setAttribute("fill", `hsl(${starFill})`);
    maxColorizedStar.setAttribute("stroke", `hsl(${starStroke})`);
    let nextSibling = maxColorizedStar.nextElementSibling;
    while (nextSibling) {
      nextSibling.setAttribute("fill", `hsl(${starFill})`);
      nextSibling.setAttribute("stroke", `hsl(${starStroke})`);
      nextSibling = nextSibling.nextElementSibling;
    }
    function decolorAllStars() {
      objectThatsRated.querySelectorAll("[data-star-number]").forEach(star => star.setAttribute("fill", "none"));
    }
  }
  return {
    returnRatingStarsHTML,
    colorizeRatingStars
  };
}

/***/ }),

/***/ "./src/components/readingStatus/readingStatus.js":
/*!*******************************************************!*\
  !*** ./src/components/readingStatus/readingStatus.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ readingStatusComponentFactory)
/* harmony export */ });
/* harmony import */ var _readingStatus_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./readingStatus.css */ "./src/components/readingStatus/readingStatus.css");

function readingStatusComponentFactory() {
  const readingStatusComponent = new EventTarget();
  readingStatusComponent.returnReadingStatusHTML = _returnReadingStatusHTML;
  readingStatusComponent.initEventListeners = _initEventListeners;
  readingStatusComponent.onDropDownFocus = _onDropDownFocus;
  readingStatusComponent.onDropDownBlur = _onDropDownBlur;
  return readingStatusComponent;
  function _initEventListeners(containerObject) {
    containerObject.querySelector("[data-book='status-options']").addEventListener("mousedown", event => {
      event.stopPropagation();
      onStatusChoice(containerObject, event.target);
    });
  }
  function _onDropDownFocus(parentNode, event) {
    event.stopPropagation();
    if (parentNode.querySelector("[aria-expanded]").getAttribute("aria-expanded") == "true") {
      parentNode.querySelector("[aria-expanded]").setAttribute("aria-expanded", "false");
    } else {
      parentNode.querySelector("[aria-expanded]").setAttribute("aria-expanded", "true");
    }
  }
  function _onDropDownBlur(event, parentNode) {
    event.stopPropagation();
    if (event.target.matches('[data-book="status-option"]')) {
      parentNode.querySelector('[data-book="status-option"]').textContent = event.target.textContent;
    }
    parentNode.querySelector("[aria-expanded]").setAttribute("aria-expanded", "false");
  }
  function onStatusChoice(parentNode, target) {
    parentNode.querySelector('[data-book="status"]').textContent = target.textContent;
  }
  function _returnReadingStatusHTML(readingStatusTextContent) {
    return `<div class="reading-status pos-rel">
                            <button aria-label="collapse-button" aria-expanded="false" aria-controls="reading-status"
                                class="bg-color-main book-status mrgn-bottom-200 flex ai-center jc-sb">
                                <span data-book="status">${readingStatusTextContent}</span>
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

/***/ }),

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ appFactory)
/* harmony export */ });
/* harmony import */ var _bookModel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bookModel.js */ "./src/bookModel.js");
/* harmony import */ var _components_addBookModal_addBookModal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/addBookModal/addBookModal.js */ "./src/components/addBookModal/addBookModal.js");
/* harmony import */ var _components_bookCard_bookCard_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/bookCard/bookCard.js */ "./src/components/bookCard/bookCard.js");



function appFactory() {
  /* Function member attributes */
  let bookModel;
  const bookCardComponent = (0,_components_bookCard_bookCard_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
      bookList: document.querySelector(".books"),
      addBook: document.querySelector('[data-global-action="add"]'),
      wrapper: document.querySelector('[data-global="wrapper"]'),
      searchBar: document.querySelector(".list-search__input"),
      filterContainer: document.querySelector(".filter-container"),
      filterButton: document.querySelector('[data-app="filter-button"]'),
      filterSection: document.querySelector('[data-app="filter-options"]'),
      filter: document.querySelectorAll("[data-filter] input[type='checkbox']"),
      filterCards: document.querySelector(".filter-cards")
    }
  };
  initApp();
  async function initApp() {
    try {
      bookModel = await (0,_bookModel_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
      fullRenderView();
      initEventListeners();
    } catch (error) {}
  }
  function fullRenderView() {
    App.$.bookList.replaceChildren(...bookModel.getBooks().map(bookObject => bookCardComponent.createBookCard(bookObject)));
  }
  function initEventListeners() {
    let addBookModalComponent;
    initGlobalEvents();
    initBookStorageEvents();
    initBookCardEvents();
    function initGlobalEvents() {
      App.$.addBook.addEventListener("click", () => createBookModalView({
        title: "",
        author: "",
        status: "",
        rating: ""
      }, "Add a new book to your list", "Add book", "add", App.$.wrapper));
      const debouncedSearchInList = debounce(searchTerm => bookModel.updateSearch(searchTerm), 400);
      App.$.searchBar.addEventListener("input", event => debouncedSearchInList(event.target.value));
      function debounce(cb, delay) {
        let timeout;
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          clearTimeout(timeout);
          document.querySelector('[data-app="search-in-list-loader"]').style.display = "block";
          timeout = setTimeout(() => {
            cb(...args);
            document.querySelector('[data-app="search-in-list-loader"]').style.display = "none";
          }, delay);
        };
      }
      App.$.filterButton.addEventListener("click", openFilterSection);
      document.addEventListener("click", closeFilterSectionBlur);
      function closeFilterSectionBlur(event) {
        if (!event.target.closest(".filter-container") && App.$.filterButton.getAttribute("aria-expanded") == "true") {
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
      App.$.filter.forEach(filter => filter.addEventListener("click", onFilterClick.bind(filter)));
      function onFilterClick(event) {
        const filterTerm = this.parentNode.querySelector("[data-filter-name]").textContent;
        if (event.target.checked) {
          bookModel.addReadingStatusFilter(filterTerm);
          addFilterCard(filterTerm);
        } else {
          bookModel.deleteReadingStatusFilter(filterTerm);
          removeFilterCard(filterTerm);
        }
        function addFilterCard() {
          App.$.filterCards.append(returnFilterCardNode());
        }
        function removeFilterCard() {
          document.querySelector(`[reading-status-filter="${filterTerm}"]`).remove();
        }
        function returnFilterCardNode() {
          const filterCard = document.createElement("div");
          filterCard.setAttribute("reading-status-filter", `${filterTerm}`);
          filterCard.classList.add("flex", "ai-items-center", "jc-center", "fs-filter-card");
          const Bbutton = document.createElement("button");
          Bbutton.textContent = `${filterTerm}        x`;
          filterCard.append(Bbutton);
          return filterCard;
        }
      }
      App.$.filterCards.addEventListener("click", function (event) {
        if (event.target.closest("[reading-status-filter]")) {
          const filterCard = event.target.closest("[reading-status-filter]");
          const filterTerm = `${filterCard.getAttribute("reading-status-filter")}`;
          this.querySelector(`[reading-status-filter="${filterTerm}"]`).remove();
          const filterOption = App.$.filterSection.querySelector(`[data-filter="${filterCard.getAttribute("reading-status-filter")}"] input`);
          filterOption.checked = false;
          bookModel.deleteReadingStatusFilter(filterTerm);
        }
      });
    }
    function initBookStorageEvents() {
      /* When storage has been changed -> rerender View */
      bookModel.addEventListener("update", fullRenderView);
    }
    function initBookCardEvents() {
      bookCardComponent.addEventListener("statusupdate", event => bookModel.updateReadingStatus(event.detail.uuid, event.detail.newStatus));
      addBookCardEvent("click", "[data-star-number]", (bookListItem, event) => {
        const newRating = event.target.dataset.starNumber;
        const bookID = bookListItem.dataset.bookUuid;
        bookModel.updateBookRating(bookID, newRating);
      });
      addBookCardEvent("click", '[data-book="delete"]', (bookListItem, event) => {
        const bookUUID = bookListItem.dataset.bookUuid;
        bookModel.deleteBook(bookUUID);
      });
      addBookCardEvent("click", '[data-book="edit"]', (bookListItem, event) => {
        createBookModalView({
          uuid: bookListItem.getAttribute("data-book-uuid"),
          title: bookListItem.querySelector('[data-book="title"]').textContent,
          author: bookListItem.querySelector('[data-book="author"]').textContent,
          status: bookListItem.querySelector('[data-book="status"]').textContent,
          rating: bookModel.getBookRating(bookListItem.dataset.bookUuid)
        }, "Edit this book", "Confirm Edit", "edit", bookListItem);
      });
      addBookCardEvent("mousedown", '[data-book="status-option"]', (bookListItem, event) => {
        const bookUUID = bookListItem.dataset.bookUuid;
        bookModel.updateReadingStatus(bookUUID, event.target.textContent);
      });
      addBookCardEvent("click", '[aria-label="collapse-button"]', (bookListItem, event) => {
        bookCardComponent.onDropDownFocus(bookListItem);
      });
      function addBookCardEvent(eventName, selector, handler) {
        App.$.bookList.addEventListener(eventName, event => {
          if (event.target.matches(selector)) {
            handler(event.target.closest(".book"), event);
          }
        });
      }
    }
    function createBookModalView(book, formHeader, buttonText, mode, nodeToAppendTo) {
      addBookModalComponent = (0,_components_addBookModal_addBookModal_js__WEBPACK_IMPORTED_MODULE_1__["default"])(book, formHeader, buttonText, mode);

      /* Add Book Event dispatched from Modal component*/
      addBookModalComponent.addEventListener("addBook", bookModel.add);
      addBookModalComponent.addEventListener("editBook", bookModel.editBook);

      /* create the Modal view */
      const formWrapper = addBookModalComponent.createBookModalDOMNode();
      const firstChild = nodeToAppendTo.firstChild;
      nodeToAppendTo.insertBefore(formWrapper, firstChild);
      /*       App.$.wrapper.insertBefore(formWrapper, firstChild); */
    }
  }
}

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createEnumPOJO)
/* harmony export */ });
function createEnumPOJO(enumValues) {
  const enumPOJO = {};
  for (const enumValue of enumValues) {
    const key = camelCase(enumValue);
    enumPOJO[key] = enumValue;
  }
  return Object.freeze(enumPOJO);
}
function camelCase(string) {
  return string.split(" ").map((word, index) => {
    const wordLowerCase = word.toLowerCase();
    return index != 0 ? `${wordLowerCase.charAt(0).toUpperCase()}${wordLowerCase.slice(1)}` : wordLowerCase;
  }).join("");
}

/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Library</title>\r\n</head>\r\n<style>\r\n    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');\r\n</style>\r\n<style>\r\n    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');\r\n</style>\r\n<body class=\"bg-color ff-main\">\r\n\r\n\r\n    <div data-global=\"wrapper\" class=\"wrapper pos-rel\">\r\n        <header class=\"grid pi-center mrgn-bottom-800\">\r\n            <h1 class=\"svg-h1 pb-bottom-500\">\r\n                <svg width=\"100px\" height=\"100px\" viewBox=\"0 -0.46 321.395 321.395\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                    <defs>\r\n                        <style>\r\n                            .a {\r\n                                fill: #ffffff;\r\n                            }\r\n\r\n                            .b {\r\n                                fill: #6B705C;\r\n                            }\r\n\r\n                            .c {\r\n                                fill: #211715;\r\n                            }\r\n\r\n                            .d {\r\n                                fill: #ffda71;\r\n                            }\r\n                        </style>\r\n                    </defs>\r\n                    <path class=\"a\"\r\n                        d=\"M304.418,238.9c-.017-11.951-.077-36.41-.077-45.1,0,0,0-.121.006-.356-53.9-31.01-135.061-77.919-171.922-99.254-31.213,18.059-94.031,54.357-130.373,75.234,0,10.138.074,40.174.068,49.085,33.15,19.2,119.957,69.372,173.325,100.058,37.885-21.778,99.829-57.575,128.978-74.447v-.459C304.423,242.493,304.421,240.865,304.418,238.9Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M131.706,94.6C100.37,112.73,38.567,148.441,2.445,169.193c27.372,15.853,126.347,73.071,172.227,99.385,33.5-19.2,106.859-61.578,129.669-74.783,0,0,0-.121.006-.356-53.9-31.01-135.061-77.919-171.922-99.254Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M306.418,238.9q-.017-12.1-.046-24.2c-.014-7.08-.18-14.18-.025-21.259a2,2,0,0,0-.99-1.727q-35.7-20.539-71.365-41.138-35.376-20.419-70.736-40.866-14.913-8.622-29.822-17.25a2.022,2.022,0,0,0-2.019,0q-23.761,13.748-47.534,27.477-27.843,16.083-55.7,32.141-13.564,7.815-27.137,15.616a2.011,2.011,0,0,0-.99,1.727q0,17.325.052,34.651.008,4.278.013,8.555a38.656,38.656,0,0,0,.039,6.145c.23,1.362,1.723,1.905,2.8,2.531L5.7,222.886l6.032,3.491Q26.9,235.157,42.08,243.929q18.662,10.79,37.328,21.569,19.842,11.46,39.687,22.909,19.078,11.006,38.164,22c5.65,3.254,11.22,6.807,17.015,9.792,1.709.88,3.314-.559,4.778-1.4l4.2-2.413q4.42-2.544,8.84-5.089,19.689-11.337,39.363-22.7,19.755-11.4,39.5-22.815,16.167-9.344,32.33-18.7c1.141-.661,2.865-1.267,3.1-2.705a34.234,34.234,0,0,0,.031-5.482c0-2.574-4-2.579-4,0q0,2.607,0,5.216l.99-1.727q-22.851,13.227-45.715,26.433-27.7,16-55.409,31.978-13.923,8.025-27.854,16.036h2.019q-36.443-20.954-72.843-41.982Q67.646,254.093,31.7,233.3,17.411,225.044,3.13,216.777l.99,1.727c.008-13.314-.041-26.628-.06-39.942q-.007-4.572-.008-9.143l-.991,1.727q25.616-14.715,51.2-29.489Q81.6,125.88,108.934,110.08q12.252-7.083,24.5-14.168h-2.019q29.592,17.127,59.2,34.23,37.073,21.42,74.163,42.811,19.275,11.115,38.561,22.213l-.991-1.727c-.155,7.079.011,14.179.025,21.259q.024,12.1.046,24.2C302.422,241.472,306.422,241.477,306.418,238.9Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M173.07,268.444q0,20.736.072,41.472.007,4.194.01,8.389c0,2.574,4,2.578,4,0,0-13.5-.05-27-.072-40.5q-.008-4.683-.01-9.366c0-2.574-4-2.578-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M3.431,172.066q12.11,7.017,24.226,14.023,17.038,9.855,34.083,19.7,19.348,11.179,38.7,22.349,19.039,10.988,38.085,21.96,16.109,9.279,32.23,18.536l3.306,1.9c2.236,1.283,4.254-2.172,2.018-3.454q-15.582-8.934-31.146-17.9-18.829-10.842-37.647-21.7-19.458-11.228-38.91-22.465Q50.91,194.914,33.444,184.815q-12.863-7.44-25.721-14.886L5.45,168.612c-2.232-1.293-4.248,2.163-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.093,283.567q-13.441-7.707-26.865-15.444-16.377-9.43-32.745-18.877Q98.6,239.505,81.724,229.755q-15.236-8.8-30.468-17.609-11.166-6.457-22.331-12.92-.992-.576-1.985-1.15c-2.232-1.293-4.248,2.162-2.019,3.454Q35.43,207.617,45.944,213.7q14.86,8.6,29.723,17.181,16.79,9.7,33.584,19.393,16.566,9.559,33.138,19.108,13.9,8.01,27.822,16l2.863,1.642c2.237,1.282,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M164.115,293.447q-13.019-7.465-26-15c-2.232-1.293-4.248,2.162-2.019,3.453q12.987,7.522,26,15c2.237,1.283,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M249.423,281.526c-4.618,2.652-19.594,11.3-26.406,15.225-6.573-3.775-18.231-10.493-26.936-15.517,8.226-4.732,17.274-9.942,26.426-15.225C231.441,271.167,243.172,277.938,249.423,281.526Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M196.081,283.234h.01l-1.009-.273q12.546,7.255,25.113,14.476a8.03,8.03,0,0,0,2.556,1.278c1,.135,1.928-.612,2.756-1.09l4.73-2.726,10.752-6.2q4.72-2.724,9.443-5.442a2.019,2.019,0,0,0,0-3.454q-13.471-7.734-26.915-15.517c-2.234-1.29-4.25,2.166-2.019,3.454q13.452,7.767,26.915,15.517V279.8q-13.215,7.59-26.4,15.225h2.018q-6.6-3.792-13.2-7.6-3.7-2.13-7.4-4.264l-3.672-2.121c-1.027-.593-2.463-1.809-3.677-1.809-2.574,0-2.578,4,0,4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M286.81,226.561q-18.458,10.689-36.931,21.348-24.841,14.343-49.7,28.659-12.856,7.4-25.721,14.785c-2.234,1.279-.221,4.736,2.019,3.454q23.758-13.6,47.456-27.312,23.481-13.537,46.948-27.1,8.974-5.187,17.947-10.381c2.227-1.29.215-4.748-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.9,270.179q26.069-14.941,52.086-29.973,28.068-16.185,56.119-32.4,10.623-6.139,21.243-12.285c2.227-1.289.215-4.747-2.019-3.454Q281.169,204.9,258.989,217.7q-29.14,16.827-58.3,33.622-13.4,7.713-26.807,15.406c-2.233,1.28-.221,4.737,2.019,3.454Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M262.249,165.587c-.013-8.922-.058-27.181-.058-33.672,0,0,0-.09.005-.266-40.238-23.15-100.831-58.17-128.349-74.1-23.3,13.482-70.2,40.58-97.331,56.166,0,7.568.056,29.992.051,36.644,24.749,14.33,89.555,51.791,129.4,74.7,28.284-16.259,74.528-42.984,96.289-55.579v-.343C262.252,168.27,262.251,167.055,262.249,165.587Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M132.1,58.561c-23.831,13.786-69.115,39.95-95.585,55.156,0,7.568.056,29.992.051,36.644,10.763,6.233,29.1,16.839,49.67,28.722-.015-9.132-.054-29.307-.058-36.983,41.833-24.166,77.077-44.545,96.955-56.052-19.693-11.377-37.516-21.684-49.287-28.5Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M264.249,165.587c-.017-11.3-.3-22.637-.053-33.938a2,2,0,0,0-.991-1.727q-26.644-15.33-53.265-30.7-26.406-15.242-52.8-30.5Q146,62.271,134.856,55.824a2.022,2.022,0,0,0-2.019,0Q115.073,66.1,97.3,76.367,76.566,88.343,55.822,100.3q-10.155,5.851-20.315,11.691a2.012,2.012,0,0,0-.991,1.727q0,13.087.04,26.174.006,3.168.009,6.336c0,1.423-.307,3.282.074,4.666.407,1.478,3.19,2.51,4.45,3.24l4.6,2.664q25.283,14.63,50.579,29.237,29.014,16.757,58.045,33.482l6.622,3.812,3.049,1.754a24.646,24.646,0,0,0,3.205,1.806c1.32.511,2.554-.546,3.655-1.179l3.327-1.913,6.727-3.873q14.649-8.436,29.29-16.889,26.814-15.475,53.612-30.982c1.092-.632,2.346-1.125,2.448-2.57.091-1.285,0-2.608,0-3.9,0-2.573-4-2.578-4,0q0,1.947,0,3.9l.991-1.727q-17.022,9.852-34.054,19.689-20.719,11.972-41.45,23.923-10.391,5.988-20.785,11.967h2.019q-27.173-15.625-54.314-31.3Q85.84,176.551,59.035,161.05,48.3,154.845,37.577,148.634l.99,1.727c.006-9.911-.03-19.822-.045-29.734q0-3.454-.006-6.91l-.99,1.727q19.149-11,38.273-22.046Q96.161,81.65,116.512,69.885q9.174-5.3,18.344-10.607h-2.019q22.086,12.783,44.184,25.548,27.671,15.989,55.355,31.954,14.4,8.3,28.81,16.6l-.99-1.727c-.248,11.3.036,22.635.053,33.938C260.253,168.161,264.253,168.166,264.249,165.587Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M163.684,187.644c0,8.464.06,16.927.061,25.391,0,2.573,4,2.578,4,0,0-8.464-.06-16.927-.061-25.391,0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M167.078,186.408q-22.767-13.054-45.486-26.189Q97.081,146.077,72.583,131.91q-9.279-5.365-18.555-10.737c-2.231-1.292-4.248,2.163-2.019,3.454q19.355,11.211,38.723,22.394,25.449,14.7,50.913,29.378,11.7,6.741,23.414,13.463c2.237,1.283,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M166.56,189.377q16.453-9.429,32.875-18.917,17.652-10.181,35.295-20.377,6.756-3.9,13.509-7.813c2.228-1.289.216-4.747-2.018-3.453q-13.989,8.1-27.988,16.176-18.321,10.579-36.655,21.14-8.516,4.9-17.037,9.79c-2.233,1.28-.22,4.738,2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M87.3,143.76q21.956-12.682,43.907-25.371,17.827-10.3,35.652-20.615,7.624-4.41,15.247-8.823c2.227-1.289.216-4.747-2.019-3.454q-14.742,8.535-29.49,17.061-19.836,11.47-39.675,22.934Q98.1,132.9,85.285,140.306c-2.229,1.288-.217,4.745,2.018,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M84.174,142.082c.013,11.343.061,22.686.062,34.029,0,2.574,4,2.578,4,0,0-11.343-.049-22.686-.062-34.029,0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M147.3,142.758a15.793,15.793,0,0,1-1.6,6.165c-1.986,3.9-5.818,6.569-9.853,8.269s-4.613,1.258-8.788,2.576c-3.255,1.027-6.663,2.506-8.058,5.8a19.245,19.245,0,0,0-1.031,5.231c-.3,6.748-.246,13.767-.33,20.711a2.279,2.279,0,0,1-1.57,2.19,32.139,32.139,0,0,1-14.655.781,2.925,2.925,0,0,1-1.3-.873,3.959,3.959,0,0,1-1.1-1.831c-.376-3.152-.557-6.188-.664-9.228-3.493.776-7.485,2.116-11.2,1.209-2.583-.63-5-2.6-5.4-5.229l-.328-2.171c-.577-10.62-1.153-9.283-1.73-19.9-.194-3.573-.35-7.341,1.282-10.526a17.826,17.826,0,0,1,5.664-5.909,69.03,69.03,0,0,1,14.464-8.107S140.619,141.394,147.3,142.758Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M139.221,146.317c2.3-1.288,5.263-2.738,8.123-4.452,4.746-2.84,9.258-6.429,10.191-11.246a20.126,20.126,0,0,0-.03-6.288c-.913-7.372-2.657-16.782-7.251-22.847-2.8-3.711-7.22-8.5-11.53-10.708,0,0-7.477-3.62-14.741-4.094-11.662-.76-17.63,4.211-17.63,4.211a35.256,35.256,0,0,0-13.2,20.8l-2.036,11.716-.735,4.229Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M92.472,204.028a7.359,7.359,0,0,1,1.429-6.02,18.158,18.158,0,0,1,5.436-4.375c2.1,1.644,10.632,1.962,16.738.07a2.155,2.155,0,0,0,.583-.281c.075.712.123,1.153.123,1.153.635,5.8-2.878,8.132-5.108,9.459a33.619,33.619,0,0,1-8.5,3.578,13.9,13.9,0,0,1-5.547.544A6.453,6.453,0,0,1,93,205.306,4.975,4.975,0,0,1,92.472,204.028Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M74.609,191.461a8.013,8.013,0,0,1,1.143-2.133,19.283,19.283,0,0,1,5.892-4.614,9.923,9.923,0,0,1,3.808-1.581,8.118,8.118,0,0,0,1.708.628c3.715.907,7.706-.432,11.2-1.208.075,2.19.191,4.379.39,6.61l-1.569.259c.117,2.5-2.1,4.451-4.251,5.73a32.523,32.523,0,0,1-8.219,3.459,13.348,13.348,0,0,1-5.363.52,6.2,6.2,0,0,1-4.469-2.752A5.834,5.834,0,0,1,74.609,191.461Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M114.781,194.575a7.173,7.173,0,0,1-2.6,6.744,27.787,27.787,0,0,1-9.546,4.365c-2.774.734-8.287,1.217-8.341-3.036-.048-3.8,3.874-6,6.706-7.677,2.215-1.308.2-4.767-2.019-3.453-3.347,1.978-6.708,4.194-8.125,8a7.646,7.646,0,0,0,3.415,9.613c3.843,2.013,8.374.934,12.235-.467a28.608,28.608,0,0,0,8.717-4.684,10.7,10.7,0,0,0,3.557-9.4,2.054,2.054,0,0,0-2-2,2.014,2.014,0,0,0-2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M84.654,181.242a16.03,16.03,0,0,0-4.947,2.3,23.828,23.828,0,0,0-4.18,3.047c-2.462,2.346-4.081,6.009-2.991,9.4,1.152,3.586,4.914,5.327,8.474,5.234,3.839-.1,7.774-1.632,11.153-3.361,3.325-1.7,7.049-4.282,7.021-8.44-.017-2.573-4.017-2.578-4,0,.02,2.939-4.316,4.71-6.5,5.691a29.355,29.355,0,0,1-4.9,1.674,8.873,8.873,0,0,1-5.219.092c-2.89-1.084-2.818-4.228-1.172-6.419a13.333,13.333,0,0,1,3.723-3.089,14.635,14.635,0,0,1,4.607-2.272c2.521-.513,1.454-4.37-1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M100.579,129.989a70.434,70.434,0,0,0-15.936,9.055A17.465,17.465,0,0,0,78.9,145.7a20.213,20.213,0,0,0-1.288,8.816c.145,4.315.56,8.6,1.078,12.882.468,3.871.445,7.814,1.14,11.65a8.57,8.57,0,0,0,5.238,6.095c3.36,1.444,7.061.907,10.516.126,2.51-.567,1.448-4.425-1.063-3.857-3.733.844-10.033,1.5-10.863-3.615-.547-3.376-.543-6.857-.955-10.287-.432-3.6-.786-7.185-.987-10.8a26.637,26.637,0,0,1,.258-7.65,11.423,11.423,0,0,1,4.123-6.085,59.884,59.884,0,0,1,15.547-9.123,2.067,2.067,0,0,0,1.4-2.461,2.012,2.012,0,0,0-2.46-1.4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M100.164,149.275c-3.427,2.382-4.287,6.117-4.349,10.043-.063,3.982.149,7.963.273,11.942.163,5.22.14,10.447.49,15.659.162,2.415-.015,5.366,1.518,7.367,1.471,1.92,3.274,2.323,5.555,2.563a32.691,32.691,0,0,0,6.583-.023,25.468,25.468,0,0,0,6.682-1.313c2.61-1.017,2.724-3.519,2.748-5.939.026-2.75.036-5.5.063-8.248.026-2.719.067-5.439.157-8.157a21.132,21.132,0,0,1,.869-6.581c1.335-3.616,6.074-4.806,9.41-5.611,4.326-1.044,8.49-2.4,12.092-5.128a17.661,17.661,0,0,0,7.089-13.984c.1-2.575-3.9-2.57-4,0a13.521,13.521,0,0,1-5.209,10.6,24.277,24.277,0,0,1-9.661,4.338c-3.565.792-7.351,1.8-10.27,4.1-3.241,2.55-4.041,6.447-4.248,10.373-.263,4.957-.232,9.935-.266,14.9q-.012,1.821-.029,3.641a6.473,6.473,0,0,1-.019,1.7c-.113.321-.066.2-.277.316a10.29,10.29,0,0,1-2.864.679,29.023,29.023,0,0,1-3.068.386,32,32,0,0,1-5.782-.046,4.833,4.833,0,0,1-1.833-.38c-.931-.554-.906-1.627-1-2.559-.458-4.709-.531-9.44-.625-14.167-.09-4.49-.319-8.977-.379-13.468-.022-1.691-.05-3.4.08-5.083.011-.14.022-.28.036-.42.041-.4-.026.122.011-.066a9.215,9.215,0,0,1,.433-1.563,5.21,5.21,0,0,1,1.805-2.414c2.1-1.46.1-4.929-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M105.344,89.166a37.579,37.579,0,0,0-14.117,21.991c-.535,2.511,3.32,3.584,3.857,1.063a33.437,33.437,0,0,1,12.279-19.6,2.065,2.065,0,0,0,.717-2.736,2.013,2.013,0,0,0-2.736-.718Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M93.073,131.912c-2.224-1.387-3.149-3.73-3.512-6.217-.407-2.788.07-6.337,4.127-7.351a5.776,5.776,0,0,1,4.225.789,7.917,7.917,0,0,1,3.891,7.682c-.274,3.306-3.391,6.336-6.673,5.857A5.3,5.3,0,0,1,93.073,131.912Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M94.082,130.185a4.789,4.789,0,0,1-1.2-1.091c.179.224-.08-.121-.118-.176q-.142-.216-.27-.439c-.068-.12-.133-.241-.195-.364,0,0-.247-.563-.135-.281a10.884,10.884,0,0,1-.527-1.825c-.036-.175-.068-.35-.1-.527-.023-.136-.076-.619-.018-.083-.027-.253-.053-.5-.066-.759a11.088,11.088,0,0,1,.031-1.4c.028-.374,0,0-.01.067.026-.127.046-.256.075-.383.062-.281.152-.548.241-.821-.145.45.086-.167.161-.3s.481-.637.185-.309a7.33,7.33,0,0,1,.518-.525c.232-.209-.39.224.072-.053.155-.092.3-.193.464-.278.111-.06.224-.118.339-.167-.287.124.028,0,.076-.019a8.126,8.126,0,0,1,.907-.24c-.447.076.185.012.35.015s.33.012.494.03c.141.014.135.014-.017,0,.106.018.211.041.314.067a4.093,4.093,0,0,1,1.6.774c.023.016.3.226.1.065.108.083.212.173.315.262a8.939,8.939,0,0,1,.78.765,5.348,5.348,0,0,1,1.266,2.531c-.007-.033.112.588.068.309s.034.362.031.326a8.924,8.924,0,0,1,.019.925c0,.178-.014.355-.029.532.007-.087.073-.34-.01.072a8.048,8.048,0,0,1-.268.979c-.2.6.086-.15-.078.179-.09.184-.187.363-.292.539a2.539,2.539,0,0,1-.474.661,6.713,6.713,0,0,1-.729.7c.216-.177-.041.027-.077.05-.168.108-.334.218-.51.314a3.428,3.428,0,0,1-1.436.41,3.112,3.112,0,0,1-1.848-.536,2,2,0,0,0-2.019,3.454c3.7,2.2,8,.706,10.326-2.693a9.511,9.511,0,0,0-.039-10.192c-1.981-3.046-5.7-5.311-9.4-4.283a7.482,7.482,0,0,0-5.485,7.081c-.247,3.835,1.314,7.961,4.6,10.087a2,2,0,1,0,2.019-3.454Z\" />\r\n                    <path class=\"c\" d=\"M105.936,105.522v22.294c0,2.574,4,2.578,4,0V105.522c0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M107.241,131.608c-6.151,1.042-12.429,3.442-21.5,4.947,5.591,2.695,16.106,7.872,26.161,12.9,8.737-3.557,11.224-4.177,16.692-6.274C119.446,138.462,107.259,131.6,107.241,131.608Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M106.71,129.679c-7.252,1.256-14.23,3.722-21.5,4.948-1.664.28-1.971,2.935-.477,3.655,5.911,2.852,11.8,5.759,17.674,8.676q2.647,1.313,5.291,2.631c.924.461,1.843.932,2.771,1.384a3.16,3.16,0,0,0,3.079-.037q4.138-1.668,8.332-3.189c2.418-.87,4.845-1.716,7.246-2.634,1.479-.566,2.138-2.8.478-3.656-4.738-2.449-9.427-4.991-14.1-7.56-2.408-1.324-4.776-2.823-7.252-4.016-2.309-1.113-4.34,2.335-2.019,3.454,2.476,1.193,4.844,2.692,7.253,4.016,4.673,2.569,9.362,5.111,14.1,7.56l.478-3.655c-5.555,2.124-11.178,4.033-16.691,6.274l1.541.2c-8.7-4.35-17.4-8.678-26.161-12.9l-.478,3.656c7.27-1.226,14.247-3.691,21.5-4.948a2.016,2.016,0,0,0,1.4-2.46A2.046,2.046,0,0,0,106.71,129.679Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M123.346,140.87c.59-4.779,5.592-8.765,12.015-6,.97,2.982,2.655,7.49,3.691,11.258-1.412,1.142-2.633,2.134-2.633,2.134-2.066,2.494-6.63,2.045-9.112.535A8.247,8.247,0,0,1,123.346,140.87Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M134.669,132.487a10.875,10.875,0,0,0-8.109.606,9.931,9.931,0,0,0-4.665,5.356c-1.98,5.2,1.152,11.056,6.246,12.922,3.117,1.141,7.38.975,9.692-1.7a2.05,2.05,0,0,0,0-2.829,2.018,2.018,0,0,0-2.828,0c-.1.111-.2.212-.3.321-.066.074-.369.316-.058.08a5.244,5.244,0,0,1-.665.405c-.1.053-.449.166-.085.043-.113.038-.223.078-.337.112a6.626,6.626,0,0,1-.88.2c.4-.063,0,0-.107,0-.155.006-.309.019-.464.021-.281.005-.56-.014-.84-.026-.1,0-.51-.051-.12,0-.123-.016-.246-.038-.368-.061a9.5,9.5,0,0,1-.984-.233c-.257-.075-.509-.164-.76-.256.386.142-.264-.128-.372-.186a6.581,6.581,0,0,1-.663-.416c-.487-.338.161.14-.106-.082-.138-.114-.274-.23-.406-.35q-.288-.263-.555-.546c-.076-.082-.151-.165-.225-.25,0,0-.343-.419-.156-.179s-.129-.184-.131-.187c-.06-.087-.119-.175-.175-.264a7.953,7.953,0,0,1-.419-.741c-.056-.112-.109-.227-.161-.342.027.061.144.4.032.063-.076-.233-.16-.461-.224-.7-.05-.187-.09-.375-.129-.564-.007-.036-.075-.5-.031-.157.043.331-.01-.163-.014-.228a10.558,10.558,0,0,1,.027-1.331c-.026.449-.011.068.033-.155a8.044,8.044,0,0,1,.2-.805c.055-.176.124-.346.182-.521.14-.425-.164.268-.012.033.06-.094.1-.211.151-.311q.142-.276.306-.541c.071-.115.549-.764.2-.332a8.389,8.389,0,0,1,.849-.919c.076-.069.556-.463.334-.294-.261.2.115-.077.139-.093.119-.077.236-.157.358-.23.2-.124.414-.239.628-.343.025-.012.46-.2.158-.077-.285.118.182-.063.24-.082a7.626,7.626,0,0,1,.788-.226c.176-.041.871-.13.375-.084a12.728,12.728,0,0,1,1.779-.018c.086,0,.392.047-.023-.011.174.024.347.055.519.089.359.071.712.165,1.063.27a2,2,0,1,0,1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M140.793,118.459c-.076-.534-.03-.233,0,.079.022.262.043.523.062.785.053.749.093,1.5.128,2.249.075,1.641.13,3.289.091,4.932-.007.321-.017.643-.039.964-.012.187-.024.9-.022.364,0,.529-.181,0,.074-.043-.281.052-.819.627-1.112.863-2.011,1.624-3.965,3.316-5.98,4.934a1.945,1.945,0,0,0-.514,1.946c1.249,3.789,2.662,7.525,3.716,11.376a2.023,2.023,0,0,0,2.938,1.2c8.293-4.639,19.882-9.366,19.636-20.62a65.372,65.372,0,0,0-2.318-14.635,35.353,35.353,0,0,0-5.68-12.653c-3.28-4.3-7.191-8.592-12.034-11.146-2.276-1.2-4.3,2.251-2.019,3.454,3.864,2.038,7.016,5.321,9.762,8.665a30.465,30.465,0,0,1,5.578,10.824,74.983,74.983,0,0,1,2.479,12.581c.286,2.381.512,4.948-.422,7.222a13.139,13.139,0,0,1-3.494,4.572c-3.931,3.564-8.923,5.718-13.507,8.282l2.938,1.2c-1.054-3.852-2.467-7.588-3.716-11.377l-.515,1.946c2.155-1.73,4.238-3.549,6.4-5.27,1.5-1.191,1.765-2.354,1.838-4.189a53.6,53.6,0,0,0-.406-9.56,2.013,2.013,0,0,0-2.46-1.4,2.054,2.054,0,0,0-1.4,2.461Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M107.092,71.362A23.034,23.034,0,0,0,112.577,87.4,19.877,19.877,0,0,0,140.5,89.425a11.488,11.488,0,0,0,7.635-2.39,7.284,7.284,0,0,0,2.771-6.5,5.294,5.294,0,0,0-3.085-3.895,18.98,18.98,0,0,0-6.568-22.174c-8.9-6.321-21.474-5.451-28.785,2.866A22.461,22.461,0,0,0,107.092,71.362Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M109.989,60.831a22.736,22.736,0,0,0-2.6,7.5,38.071,38.071,0,0,0,15.638-1.885,1.087,1.087,0,0,1,.861.074c.631.355-.131,1.733-.487,2.363,2.24.631,7.725-.4,10.149-1.732,1.348,3.276,2.723,4.983,5.365,6.22L146.01,76.2a5.059,5.059,0,0,1,1.813.445,18.994,18.994,0,0,0-6.574-22.177c-8.9-6.321-21.474-5.451-28.785,2.866A20.56,20.56,0,0,0,109.989,60.831Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M150.058,76.325a21.143,21.143,0,0,0-7.006-22.991,24.253,24.253,0,0,0-23.614-3.308c-8.2,3.365-13.342,11.021-14.234,19.729a24.632,24.632,0,0,0,10.012,22.638c8.186,5.716,20.023,4.71,27.263-2.075,1.883-1.764-.95-4.588-2.828-2.828a18.21,18.21,0,0,1-20.042,2.862c-6.732-3.362-10.491-10.586-10.532-17.961-.039-7.089,3.334-13.988,9.583-17.57a20.1,20.1,0,0,1,19.62.129A17.181,17.181,0,0,1,146.2,75.261c-.792,2.456,3.069,3.508,3.857,1.064Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M146.01,78.2c.471.033-.219-.087.2.022.178.047.358.084.534.141.1.033.51.228.207.073.165.084.329.17.486.267.072.045.464.329.2.117a5.192,5.192,0,0,1,.412.373,4.848,4.848,0,0,1,.372.413c-.234-.3.072.134.113.2a4.82,4.82,0,0,1,.261.492c-.16-.356.034.139.057.22a4.123,4.123,0,0,1,.123.55c-.057-.395-.006.159,0,.242,0,.2-.009.39-.02.585-.024.447.068-.152-.042.247-.089.326-.263.956-.321,1.091a6.862,6.862,0,0,1-1.064,1.637,5.874,5.874,0,0,1-1.734,1.338,7.976,7.976,0,0,1-2.148.885,11.555,11.555,0,0,1-1.275.283q-.213.033,0,0c-.106.012-.212.023-.318.031-.245.021-.489.032-.735.038a2,2,0,0,0,0,4c4.771-.117,9.592-2.7,11.213-7.38a7.458,7.458,0,0,0-.689-6.514A7.567,7.567,0,0,0,146.01,74.2a2.01,2.01,0,0,0-2,2,2.049,2.049,0,0,0,2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M119.708,78.637a3.162,3.162,0,0,1-1.29,2.382,2.459,2.459,0,0,1-1.811.343,2.76,2.76,0,0,1-1.993-1.5,3.228,3.228,0,0,1,.8-3.714,2.555,2.555,0,0,1,3.474.191A2.845,2.845,0,0,1,119.708,78.637Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M131.867,81.121a3.172,3.172,0,0,1-1.29,2.382,2.464,2.464,0,0,1-1.812.342,2.756,2.756,0,0,1-1.992-1.5,3.228,3.228,0,0,1,.8-3.714,2.554,2.554,0,0,1,3.473.191A2.85,2.85,0,0,1,131.867,81.121Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M131.625,67.684a17.412,17.412,0,0,0,2.686,4.728,10.642,10.642,0,0,0,3.6,2.688,2.156,2.156,0,0,0,1.541.2,2,2,0,0,0,.478-3.655,10.46,10.46,0,0,1-1.915-1.148l.4.313a8.786,8.786,0,0,1-1.543-1.558l.312.4a15.01,15.01,0,0,1-1.787-3.229l.2.478c-.04-.095-.08-.19-.119-.285a2.2,2.2,0,0,0-.919-1.195,2,2,0,0,0-2.737.717,1.929,1.929,0,0,0-.2,1.541Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M132.544,65.426c-2.283,1.2-6.187,2.135-8.608,1.53l1.195,2.938c.77-1.376,1.61-3.289.324-4.65-1.486-1.572-3.6-.465-5.3,0a37.754,37.754,0,0,1-12.112,1.136c-2.572-.142-2.564,3.858,0,4a43.455,43.455,0,0,0,8.119-.279c1.268-.168,2.527-.384,3.773-.675q.969-.227,1.923-.505.535-.156,1.064-.329c.142-.045.284-.092.425-.141q.42-.145.01,0l-.882-.514.149.135-.514-.883c-.2-.478.174-.436-.053-.035-.134.236-.249.484-.382.721a2.022,2.022,0,0,0,1.195,2.938,14.522,14.522,0,0,0,5.9-.1,19.353,19.353,0,0,0,5.794-1.833c2.278-1.2.259-4.655-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M142.875,125.491A118.442,118.442,0,0,0,156.9,126.9a2,2,0,0,0,0-4,110.619,110.619,0,0,1-12.963-1.262,2.063,2.063,0,0,0-2.46,1.4,2.016,2.016,0,0,0,1.4,2.46Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M94.579,106.311l11.58,7.527a2.014,2.014,0,0,0,2.736-.717,2.045,2.045,0,0,0-.717-2.737L96.6,102.857a2.016,2.016,0,0,0-2.737.717,2.046,2.046,0,0,0,.718,2.737Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M204.272,29.351c.348,0,.686.023,1.023.05a15.282,15.282,0,0,1,26.589,1.3c.487-.044.982-.072,1.488-.072A14.59,14.59,0,0,1,248.25,45.42c0,8.921-6.211,15.064-14.879,15.064a15.035,15.035,0,0,1-9.871-3.339,11.646,11.646,0,0,1-7.662,2.668c-5.374,0-9.306-2.849-10.845-7.29-.24.013-.476.033-.721.033-7,0-11.566-4.821-11.566-11.71A11.332,11.332,0,0,1,204.272,29.351Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M285.161,89.948c.271,0,.534.018.8.039A11.9,11.9,0,0,1,306.665,91c.38-.034.765-.056,1.159-.056a11.363,11.363,0,0,1,11.588,11.517c0,6.948-4.838,11.732-11.589,11.732a11.71,11.71,0,0,1-7.687-2.6,9.071,9.071,0,0,1-5.968,2.078c-4.185,0-7.247-2.22-8.446-5.678-.187.01-.371.025-.562.025-5.449,0-9.007-3.754-9.007-9.12A8.825,8.825,0,0,1,285.161,89.948Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M19.568,2.428a18.8,18.8,0,0,1,22.737,14.61c2.41,11.238-3.756,20.655-14.675,23C16.291,42.465,7.211,36.241,4.817,25.075A18.781,18.781,0,0,1,19.568,2.428Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M20.1,4.357a16.974,16.974,0,0,1,18.511,8.372c3.325,6.09,3.063,14.46-1.615,19.794A18.9,18.9,0,0,1,17.449,37.7c-6.609-2.2-10.7-9.024-11.05-15.78A17.106,17.106,0,0,1,9.684,10.8,17.513,17.513,0,0,1,20.1,4.357C22.611,3.8,21.548-.061,19.037.5A21.028,21.028,0,0,0,2.469,18.967C1.639,27.346,6,36.608,13.673,40.429c7.783,3.877,17.884,2.286,24.409-3.35,6.608-5.707,8.334-15.481,5.291-23.487A21.169,21.169,0,0,0,34.194,2.667,21.584,21.584,0,0,0,19.037.5C16.517,1.017,17.583,4.874,20.1,4.357Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M38.5,64.87q-1.306-5.12-2.612-10.24a2,2,0,0,0-3.857,1.063q1.305,5.121,2.612,10.241A2,2,0,0,0,38.5,64.87Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M12.442,56.709q-1.226,13.047-2.431,26.1a2.015,2.015,0,0,0,2,2,2.043,2.043,0,0,0,2-2q1.215-13.049,2.431-26.1a2.015,2.015,0,0,0-2-2,2.043,2.043,0,0,0-2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M70.865,10.592,59.679,12.667a2.01,2.01,0,0,0-1.4,2.46,2.052,2.052,0,0,0,2.46,1.4l11.186-2.075a2.011,2.011,0,0,0,1.4-2.461,2.053,2.053,0,0,0-2.46-1.4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M83.5,38.612q-11.9-3.678-23.8-7.364c-2.465-.762-3.519,3.1-1.063,3.857q11.9,3.675,23.8,7.364c2.465.762,3.519-3.1,1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M63.569,60.033q-6.422-6.656-12.838-13.314A2,2,0,0,0,47.9,49.547Q54.32,56.206,60.74,62.862a2,2,0,0,0,2.829-2.829Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M204.272,31.351c.343.007.681.025,1.023.05a1.99,1.99,0,0,0,1.727-.991,13.2,13.2,0,0,1,12.372-6.1,12.942,12.942,0,0,1,10.763,7.4,1.943,1.943,0,0,0,1.727.99,13.461,13.461,0,0,1,9.658,2.681,12.831,12.831,0,0,1,4.611,8.279C247,50.193,243.326,56.52,236.8,58.1a13.977,13.977,0,0,1-11.882-2.367,2.076,2.076,0,0,0-2.828,0c-4.811,3.948-13,2.237-15.165-3.739a2.053,2.053,0,0,0-1.928-1.469,9.958,9.958,0,0,1-7.182-2.146,9.5,9.5,0,0,1-3.08-6.667,9.537,9.537,0,0,1,9.541-10.359c2.572-.035,2.579-4.035,0-4a13.533,13.533,0,0,0-12.965,9.432c-1.673,5.4.071,11.8,4.649,15.2a13.9,13.9,0,0,0,9.037,2.538l-1.929-1.468a12.827,12.827,0,0,0,8.5,8.171,14.605,14.605,0,0,0,13.352-2.667h-2.828c6.94,5.683,18.437,5.289,24.291-1.849a17.746,17.746,0,0,0-.853-23.088,17.074,17.074,0,0,0-13.64-4.918l1.727.991a16.959,16.959,0,0,0-14.217-9.386,17.181,17.181,0,0,0-15.826,8.082l1.727-.99c-.342-.025-.68-.043-1.023-.05C201.7,27.3,201.7,31.3,204.272,31.351Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M285.161,91.948c.266,0,.531.015.8.039A1.993,1.993,0,0,0,287.684,91a9.827,9.827,0,0,1,9.13-4.54,9.66,9.66,0,0,1,8.124,5.556,1.945,1.945,0,0,0,1.727.99,9.837,9.837,0,0,1,8.734,3.49,10.235,10.235,0,0,1,1.64,8.928,8.887,8.887,0,0,1-5.449,6.126,10.593,10.593,0,0,1-10.04-1.365,2.079,2.079,0,0,0-2.829,0c-3.5,2.847-9.482,1.61-11.071-2.717A2.053,2.053,0,0,0,285.722,106c-4.01.233-7.3-2.279-7.549-6.4a6.987,6.987,0,0,1,6.988-7.643c2.571-.045,2.579-4.045,0-4a11.01,11.01,0,0,0-10.988,11.643A10.777,10.777,0,0,0,285.722,110l-1.929-1.468a10.478,10.478,0,0,0,7.008,6.7,11.858,11.858,0,0,0,10.749-2.215h-2.829c5.564,4.522,14.655,4.326,19.441-1.317a14.262,14.262,0,0,0-.561-18.73A13.742,13.742,0,0,0,306.665,89l1.727.991a13.677,13.677,0,0,0-11.578-7.537,13.829,13.829,0,0,0-12.584,6.522l1.727-.991c-.265-.024-.53-.036-.8-.039C282.586,87.875,282.588,91.875,285.161,91.948Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M221.244,122.171c0,3.2-2.231,6.364-6.418,8.782a31.725,31.725,0,0,1-30.733.109c-4.575-2.641-6.816-5.861-6.672-9.084.039-3.092,2.28-6.16,6.67-8.7l30.735.115c4.189,2.419,6.419,5.571,6.419,8.775\" />\r\n                    <path class=\"d\"\r\n                        d=\"M212.314,111.441c-2.9-3.587-7.406-5.718-12.982-5.718-7.533,0-13.406,4.158-15.637,10.7a4.571,4.571,0,0,0,1.182,1.386,5.849,5.849,0,0,0,3.645,1.011,12.765,12.765,0,0,1,1.313.1,17.845,17.845,0,0,0,19.3-.017,7.77,7.77,0,0,1,1.007-.085,5.829,5.829,0,0,0,3.645-1.011,4.557,4.557,0,0,0,1.2-1.426A15.7,15.7,0,0,0,212.314,111.441Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M217.945,122.543c-.057-7.311-3.632-14.262-10.554-17.224-7.092-3.034-16.195-1.8-21.625,3.887a19.348,19.348,0,0,0-5.046,13.185c-.046,2.575,3.954,2.576,4,0,.121-6.746,4-12.6,10.724-14.226,5.566-1.346,12.143.191,15.651,4.951a15.916,15.916,0,0,1,2.85,9.427c.02,2.573,4.02,2.579,4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M193.76,110.225a57.18,57.18,0,0,0-5.278-8.892,2.048,2.048,0,0,0-2.737-.718,2.023,2.023,0,0,0-.717,2.737,57.1,57.1,0,0,1,5.278,8.892,2.011,2.011,0,0,0,2.737.718,2.054,2.054,0,0,0,.717-2.737Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M189.633,121.156a20.177,20.177,0,0,0,19.4.167c2.265-1.227.247-4.682-2.019-3.454a16.031,16.031,0,0,1-15.361-.167c-2.243-1.271-4.261,2.184-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M213.816,115.118c.489.285.969.585,1.433.908q.181.126.361.258c.049.036.381.293.144.106s.085.07.133.109q.162.132.321.27a13.765,13.765,0,0,1,1.02.972q.242.255.469.525c.067.079.131.161.2.241.125.15-.279-.378-.015-.014a9.842,9.842,0,0,1,.665,1.047c.1.183.19.371.28.559.142.3-.022.013-.047-.119a2.408,2.408,0,0,0,.116.309,7.539,7.539,0,0,1,.308,1.146c.015.083.058.414.014.049s-.007-.035,0,.049c.019.211.027.422.029.633a2,2,0,0,0,4,0c-.036-4.693-3.595-8.28-7.41-10.5a2,2,0,0,0-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M183.081,111.549c-3.824,2.232-7.624,5.755-7.661,10.513a2,2,0,0,0,4,0c0-.2.01-.4.028-.6.008-.086.045-.406,0-.036s0,.051.013-.035a7.058,7.058,0,0,1,.3-1.1c.035-.1.085-.2.114-.3-.159.537-.1.236-.028.083s.163-.33.252-.491a10.733,10.733,0,0,1,.725-1.114c.142-.2-.281.344-.052.07.079-.1.157-.19.238-.284q.23-.266.474-.517c.344-.355.708-.691,1.085-1.01q.135-.114.273-.225c.078-.064.409-.389.051-.044a5.312,5.312,0,0,1,.667-.482c.5-.347,1.017-.669,1.542-.975a2,2,0,1,0-2.019-3.454Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M177.979,127.264a25.83,25.83,0,0,1-.56-5.09c0,.035,0,.069,0,.1,0,3.123,2.242,6.225,6.675,8.784a31.725,31.725,0,0,0,30.733-.109c4.187-2.418,6.418-5.577,6.418-8.782,0-.042,0-.084,0-.127-.1,12.933-8.732,21.96-21.912,21.96-10.138,0-17.995-5.707-20.8-14.638Q178.21,128.342,177.979,127.264Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M219.244,121.818c-.046,7.819-3.7,15.315-11.143,18.511-7.542,3.239-17.344,1.954-23.184-3.991a20.588,20.588,0,0,1-5.5-14.32c-.039-2.571-4.039-2.579-4,0a25.225,25.225,0,0,0,5.391,15.713,22.512,22.512,0,0,0,12,7.488c9.41,2.344,20.01-.451,25.885-8.415a25.422,25.422,0,0,0,4.546-14.986c.015-2.574-3.985-2.577-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.418,122.278c.178,8.149,10.016,12.569,16.824,13.971a33.724,33.724,0,0,0,23.98-3.8c3.7-2.247,6.923-5.74,7.022-10.28.056-2.575-3.944-2.574-4,0-.063,2.9-2.366,5.129-4.665,6.593a27.542,27.542,0,0,1-9.461,3.663,29.221,29.221,0,0,1-19.844-2.994c-2.624-1.49-5.783-3.827-5.856-7.155-.055-2.57-4.056-2.579-4,0Z\" />\r\n                </svg>\r\n            </h1>\r\n\r\n            <div data-app=\"search-book-in-list\" class=\"list-search flex mrgn-bottom-400 pos-rel\">\r\n                <input class=\"list-search__input flex\" type=\"text\" placeholder=\"Search in your list...\">\r\n\r\n                <div class=\"list-search__icon-group flex ai-center\">\r\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                        <path\r\n                            d=\"M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z\" />\r\n                    </svg>\r\n                    <div data-app=\"search-in-list-loader\" class=\"list-search__icon-group__loader\"></div>\r\n                    <div class=\"filter-container\">\r\n                        <button class=\"filter-button pos-rel\" data-app=\"filter-button\" aria-expanded=\"false\">\r\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                                <path\r\n                                    d=\"M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z\" />\r\n                            </svg>\r\n                        </button>\r\n                        <ul data-app=\"filter-options\" class=\"filter-options pos-abs flex flex-column\">\r\n                            <label data-filter=\"Read\" class=\"flex ai-center\">\r\n                                <div class=\"flex ai-center jc-sb\">\r\n                                    <input type=\"checkbox\" id=\"read\" name=\"read\">\r\n                                    <svg width=\"16\" height=\"15\" viewBox=\"0 0 16 15\" fill=\"none\"\r\n                                        xmlns=\"http://www.w3.org/2000/svg\">\r\n                                        <rect width=\"15\" height=\"15\" fill=\"#6B705C\" />\r\n                                        <path\r\n                                            d=\"M0.5 4.5L4.5 0.5L0.5 8.5L10.5 0.5L0.5 14L14 0.5L5.5 14L14 6L10.5 14L15 10.5\"\r\n                                            stroke=\"#FFD970\" stroke-dashoffset=\"106\" stroke-dasharray=\"106\" />\r\n                                    </svg>\r\n                                    <span data-filter-name>Read</span>\r\n                                </div>\r\n                            </label>\r\n                            <label data-filter=\"Currently Reading\" class=\"flex ai-center\">\r\n                                <div class=\"flex ai-center jc-sb\">\r\n                                    <input type=\"checkbox\" id=\"curently-reading\" name=\"curently-reading\">\r\n                                    <svg width=\"16\" height=\"15\" viewBox=\"0 0 16 15\" fill=\"none\"\r\n                                        xmlns=\"http://www.w3.org/2000/svg\">\r\n                                        <rect width=\"15\" height=\"15\" fill=\"#6B705C\" />\r\n                                        <path\r\n                                            d=\"M0.5 4.5L4.5 0.5L0.5 8.5L10.5 0.5L0.5 14L14 0.5L5.5 14L14 6L10.5 14L15 10.5\"\r\n                                            stroke=\"#FFD970\" stroke-dashoffset=\"106\" stroke-dasharray=\"106\" />\r\n                                    </svg>\r\n                                    <span data-filter-name>Currently Reading</span>\r\n                                </div>\r\n                            </label>\r\n                            <label data-filter=\"Want to Read\" class=\"flex ai-center\">\r\n                                <div class=\"flex ai-center jc-sb\">\r\n                                    <input type=\"checkbox\" id=\"want-to-read\" name=\"want-to-read\">\r\n                                    <svg width=\"16\" height=\"15\" viewBox=\"0 0 16 15\" fill=\"none\"\r\n                                        xmlns=\"http://www.w3.org/2000/svg\">\r\n                                        <rect width=\"15\" height=\"15\" fill=\"#6B705C\" />\r\n                                        <path\r\n                                            d=\"M0.5 4.5L4.5 0.5L0.5 8.5L10.5 0.5L0.5 14L14 0.5L5.5 14L14 6L10.5 14L15 10.5\"\r\n                                            stroke=\"#FFD970\" stroke-dashoffset=\"106\" stroke-dasharray=\"106\" />\r\n                                    </svg>\r\n                                    <span data-filter-name>Want to Read</span>\r\n                                </div>\r\n                            </label>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"flex filter-cards\">\r\n            </div>\r\n\r\n        </header>\r\n\r\n        <main class=\"grid\">\r\n            <button aria-label=\"Add book to list\" class=\"add-book-button flex jc-center ai-center\">\r\n                <svg data-global-action=\"add\" class=\"flex ai-center js-center mrgn-bottom-800 cursor-pointer\"\r\n                    xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                    <path\r\n                        d=\"M453-280h60v-166h167v-60H513v-174h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\" />\r\n                </svg>\r\n            </button>\r\n\r\n            <ul class=\"books\">\r\n            </ul>\r\n        </main>\r\n    </div>\r\n\r\n</body>\r\n</html>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./src/components/addBookModal/addBookModal.css":
/*!******************************************************!*\
  !*** ./src/components/addBookModal/addBookModal.css ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/bookCard/bookCard.css":
/*!**********************************************!*\
  !*** ./src/components/bookCard/bookCard.css ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/readingStatus/readingStatus.css":
/*!********************************************************!*\
  !*** ./src/components/readingStatus/readingStatus.css ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  randomUUID
});

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist/esm-browser/native.js");
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");




function v4(options, buf, offset) {
  if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
    return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/idb/build/index.js":
/*!*****************************************!*\
  !*** ./node_modules/idb/build/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteDB: () => (/* binding */ deleteDB),
/* harmony export */   openDB: () => (/* binding */ openDB),
/* harmony export */   unwrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   wrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)
/* harmony export */ });
/* harmony import */ var _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrap-idb-value.js */ "./node_modules/idb/build/wrap-idb-value.js");



/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade((0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.result), event.oldVersion, event.newVersion, (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
(0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.r)((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));




/***/ }),

/***/ "./node_modules/idb/build/wrap-idb-value.js":
/*!**************************************************!*\
  !*** ./node_modules/idb/build/wrap-idb-value.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ reverseTransformCache),
/* harmony export */   i: () => (/* binding */ instanceOfAny),
/* harmony export */   r: () => (/* binding */ replaceTraps),
/* harmony export */   u: () => (/* binding */ unwrap),
/* harmony export */   w: () => (/* binding */ wrap)
/* harmony export */ });
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise
        .then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    })
        .catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller.js */ "./src/controller.js");
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.html */ "./src/index.html");



const appController = (0,_controller_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQWUsU0FBU0EsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsTUFBTSxFQUFFO0VBQ2pFLE9BQU87SUFBRUgsS0FBSztJQUFFQyxNQUFNO0lBQUVDLE1BQU07SUFBRUM7RUFBTyxDQUFDO0FBQzFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZxRDtBQUNkO0FBQ0g7QUFFckIsZUFBZVEsZ0JBQWdCQSxDQUFBLEVBQUc7RUFDL0MsSUFBSUMsRUFBRTtFQUNOLElBQUlDLEtBQUs7RUFDVCxJQUFJQyxZQUFZLEdBQUcsRUFBRTtFQUNyQixJQUFJQyxtQkFBbUIsR0FBRyxFQUFFO0VBQzVCLE1BQU1DLFVBQVUsR0FBR1IsdURBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzs7RUFFN0U7RUFDQTs7RUFFQSxNQUFNUyxTQUFTLEdBQUcsSUFBSUMsV0FBVyxDQUFDLENBQUM7RUFFbkNELFNBQVMsQ0FBQ0UsR0FBRyxHQUFHQyxJQUFJO0VBQ3BCSCxTQUFTLENBQUNJLFFBQVEsR0FBR0MsU0FBUztFQUM5QkwsU0FBUyxDQUFDTSxRQUFRLEdBQUdDLFNBQVM7RUFDOUJQLFNBQVMsQ0FBQ1EsZ0JBQWdCLEdBQUdDLGlCQUFpQjtFQUM5Q1QsU0FBUyxDQUFDVSxtQkFBbUIsR0FBR0Msb0JBQW9CO0VBQ3BEWCxTQUFTLENBQUNZLGFBQWEsR0FBR0MsY0FBYztFQUN4Q2IsU0FBUyxDQUFDYyxVQUFVLEdBQUdDLFdBQVc7RUFDbENmLFNBQVMsQ0FBQ2dCLFlBQVksR0FBR0MsYUFBYTtFQUN0Q2pCLFNBQVMsQ0FBQ2tCLHNCQUFzQixHQUFHQyx1QkFBdUI7RUFDMURuQixTQUFTLENBQUNvQix5QkFBeUIsR0FBR0MsMEJBQTBCO0VBRWhFLE1BQU1DLFNBQVMsQ0FBQyxDQUFDO0VBRWpCLE9BQU90QixTQUFTO0VBRWhCLGVBQWVzQixTQUFTQSxDQUFBLEVBQUc7SUFDekIxQixLQUFLLEdBQUcsRUFBRTtJQUNWLE1BQU0yQixXQUFXLENBQUMsQ0FBQztFQUNyQjtFQUVBLFNBQVNDLFdBQVdBLENBQUEsRUFBRztJQUNyQixPQUFPckMsMkNBQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFO01BQUVzQztJQUFRLENBQUMsQ0FBQztFQUM5QztFQUVBLFNBQVNBLE9BQU9BLENBQUM5QixFQUFFLEVBQUU7SUFDbkIsSUFBSSxDQUFDQSxFQUFFLENBQUMrQixnQkFBZ0IsQ0FBQ0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO01BQzFDaEMsRUFBRSxDQUFDaUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFO1FBQUVDLE9BQU8sRUFBRTtNQUFPLENBQUMsQ0FBQztJQUNwRDtFQUNGO0VBRUEsZUFBZU4sV0FBV0EsQ0FBQSxFQUFHO0lBQzNCLElBQUk7TUFDRjVCLEVBQUUsR0FBRyxNQUFNNkIsV0FBVyxDQUFDLENBQUM7TUFDeEIsTUFBTU0sV0FBVyxHQUFHbkMsRUFBRSxDQUFDbUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxDQUFDO01BQ3pELE1BQU1DLEtBQUssR0FBR0QsV0FBVyxDQUFDRSxXQUFXLENBQUMsT0FBTyxDQUFDO01BQzlDcEMsS0FBSyxHQUFHLE1BQU1tQyxLQUFLLENBQUNFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxPQUFPQyxLQUFLLEVBQUU7TUFDZEMsT0FBTyxDQUFDQyxHQUFHLENBQUNGLEtBQUssQ0FBQztJQUNwQjtFQUNGO0VBRUEsU0FBUy9CLElBQUlBLENBQUNrQyxZQUFZLEVBQUU7SUFDMUIsTUFBTUMsU0FBUyxHQUFHRCxZQUFZLENBQUNFLE1BQU07SUFDckNELFNBQVMsQ0FBQ0UsSUFBSSxHQUFHL0MsZ0RBQU0sQ0FBQyxDQUFDO0lBRXpCRyxLQUFLLENBQUM2QyxJQUFJLENBQUNILFNBQVMsQ0FBQztJQUNyQixJQUFJO01BQ0ZJLE1BQU0sQ0FBQyxDQUFDO0lBQ1YsQ0FBQyxDQUFDLE9BQU9SLEtBQUssRUFBRTtNQUNkQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDMUI7RUFDRjtFQUVBLFNBQVMvQixTQUFTQSxDQUFDc0MsYUFBYSxFQUFFO0lBQ2hDLE1BQU1DLFVBQVUsR0FBR0QsYUFBYSxDQUFDSixNQUFNO0lBQ3ZDM0MsS0FBSyxHQUFHQSxLQUFLLENBQUNpRCxHQUFHLENBQUVDLElBQUksSUFBSztNQUMxQixJQUFJQSxJQUFJLENBQUNOLElBQUksSUFBSUksVUFBVSxDQUFDSixJQUFJLEVBQUUsT0FBT0ksVUFBVTtNQUNuRCxPQUFPRSxJQUFJO0lBQ2IsQ0FBQyxDQUFDO0lBQ0YsSUFBSTtNQUNGSixNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxPQUFPUixLQUFLLEVBQUU7TUFDZEMsT0FBTyxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQzFCO0VBQ0Y7RUFFQSxTQUFTM0IsaUJBQWlCQSxDQUFDc0MsUUFBUSxFQUFFQyxTQUFTLEVBQUU7SUFDOUNwRCxLQUFLLEdBQUdBLEtBQUssQ0FBQ2lELEdBQUcsQ0FBRUMsSUFBSSxJQUFLO01BQzFCLElBQUlBLElBQUksQ0FBQ04sSUFBSSxJQUFJTyxRQUFRLEVBQUUsT0FBT0QsSUFBSTtNQUV0QyxJQUFJQSxJQUFJLENBQUM1RCxNQUFNLElBQUk4RCxTQUFTLEVBQUU7UUFDNUJGLElBQUksQ0FBQzVELE1BQU0sR0FBRyxFQUFFO01BQ2xCLENBQUMsTUFBTTtRQUNMNEQsSUFBSSxDQUFDNUQsTUFBTSxHQUFHOEQsU0FBUztNQUN6QjtNQUNBLE9BQU9GLElBQUk7SUFDYixDQUFDLENBQUM7SUFDRkosTUFBTSxDQUFDLENBQUM7RUFDVjtFQUVBLFNBQVM3QixjQUFjQSxDQUFDa0MsUUFBUSxFQUFFO0lBQ2hDLE9BQU9uRCxLQUFLLENBQUNxRCxJQUFJLENBQUVILElBQUksSUFBS0EsSUFBSSxDQUFDTixJQUFJLElBQUlPLFFBQVEsQ0FBQyxDQUFDN0QsTUFBTTtFQUMzRDtFQUVBLGVBQWU2QixXQUFXQSxDQUFDZ0MsUUFBUSxFQUFFO0lBQ25DbkQsS0FBSyxHQUFHQSxLQUFLLENBQUNzRCxNQUFNLENBQUVKLElBQUksSUFBS0EsSUFBSSxDQUFDTixJQUFJLElBQUlPLFFBQVEsQ0FBQztJQUNyRCxJQUFJO01BQ0YsTUFBTWpCLFdBQVcsR0FBR25DLEVBQUUsQ0FBQ21DLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO01BQ3hELE1BQU1FLFdBQVcsR0FBR0YsV0FBVyxDQUFDRSxXQUFXLENBQUMsT0FBTyxDQUFDO01BQ3BELE1BQU1BLFdBQVcsQ0FBQ21CLE1BQU0sQ0FBQ0osUUFBUSxDQUFDO01BQ2xDL0MsU0FBUyxDQUFDb0QsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsT0FBT25CLEtBQUssRUFBRTtNQUNkbEMsU0FBUyxDQUFDb0QsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMzRDtFQUNGO0VBRUEsU0FBUzFDLG9CQUFvQkEsQ0FBQ29DLFFBQVEsRUFBRU8sU0FBUyxFQUFFO0lBQ2pEMUQsS0FBSyxHQUFHQSxLQUFLLENBQUNpRCxHQUFHLENBQUVDLElBQUksSUFBSztNQUMxQixJQUFJQSxJQUFJLENBQUNOLElBQUksSUFBSU8sUUFBUSxFQUFFO1FBQ3pCRCxJQUFJLENBQUM3RCxNQUFNLEdBQUdxRSxTQUFTO01BQ3pCO01BQ0EsT0FBT1IsSUFBSTtJQUNiLENBQUMsQ0FBQztJQUNGSixNQUFNLENBQUMsQ0FBQztFQUNWO0VBRUEsZUFBZXpCLGFBQWFBLENBQUNzQyxVQUFVLEVBQUU7SUFDdkMxRCxZQUFZLEdBQUcwRCxVQUFVLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQ2hDeEQsU0FBUyxDQUFDb0QsYUFBYSxDQUFDLElBQUlDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUNwRDtFQUVBLGVBQWVsQyx1QkFBdUJBLENBQUNzQyx1QkFBdUIsRUFBRTtJQUM5RDNELG1CQUFtQixDQUFDMkMsSUFBSSxDQUFDZ0IsdUJBQXVCLENBQUM7SUFDakR6RCxTQUFTLENBQUNvRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3BEO0VBRUEsZUFBZWhDLDBCQUEwQkEsQ0FBQ29DLHVCQUF1QixFQUFFO0lBQ2pFM0QsbUJBQW1CLEdBQUdBLG1CQUFtQixDQUFDb0QsTUFBTSxDQUM3Q0EsTUFBTSxJQUFLQSxNQUFNLElBQUlPLHVCQUN4QixDQUFDO0lBQ0R6RCxTQUFTLENBQUNvRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3BEO0VBRUEsZUFBZVgsTUFBTUEsQ0FBQSxFQUFHO0lBQ3RCLE1BQU1aLFdBQVcsR0FBR25DLEVBQUUsQ0FBQ21DLFdBQVcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO0lBQ3hELE1BQU1DLEtBQUssR0FBR0QsV0FBVyxDQUFDRSxXQUFXLENBQUMsT0FBTyxDQUFDO0lBRTlDLElBQUk7TUFDRixNQUFNcEMsS0FBSyxDQUFDOEQsT0FBTyxDQUFFWixJQUFJLElBQUtmLEtBQUssQ0FBQzRCLEdBQUcsQ0FBQ2IsSUFBSSxDQUFDLENBQUM7TUFDOUM5QyxTQUFTLENBQUNvRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxPQUFPbkIsS0FBSyxFQUFFO01BQ2RsQyxTQUFTLENBQUNvRCxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNEOztJQUVBO0lBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUNFOztFQUVBLFNBQVM5QyxTQUFTQSxDQUFBLEVBQUc7SUFDbkIsSUFBSXFELGFBQWEsR0FBR2hFLEtBQUs7SUFFekIsSUFBSUMsWUFBWSxJQUFJLEVBQUUsRUFBRTtNQUN0QixNQUFNZ0UsT0FBTyxHQUFHLElBQUlDLE1BQU0sQ0FBQ2pFLFlBQVksRUFBRSxHQUFHLENBQUM7TUFDN0MrRCxhQUFhLEdBQUdoRSxLQUFLLENBQUNzRCxNQUFNLENBQUVKLElBQUksSUFBSztRQUNyQyxPQUFPZSxPQUFPLENBQUNFLElBQUksQ0FBQ2pCLElBQUksQ0FBQy9ELEtBQUssQ0FBQyxJQUFJOEUsT0FBTyxDQUFDRSxJQUFJLENBQUNqQixJQUFJLENBQUM5RCxNQUFNLENBQUM7TUFDOUQsQ0FBQyxDQUFDO0lBQ0o7SUFFQSxJQUFJYyxtQkFBbUIsQ0FBQ2tFLE1BQU0sSUFBSSxDQUFDLEVBQUU7TUFDbkNKLGFBQWEsR0FBR0EsYUFBYSxDQUFDVixNQUFNLENBQUVKLElBQUksSUFBSztRQUM3QyxPQUFPaEQsbUJBQW1CLENBQUNtRSxRQUFRLENBQUNuQixJQUFJLENBQUM3RCxNQUFNLENBQUM7TUFDbEQsQ0FBQyxDQUFDO0lBQ0o7SUFDQSxPQUFPMkUsYUFBYTtFQUN0QjtBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvSzRCO0FBQ3lDO0FBQ3RCO0FBQ3NCO0FBRXRELFNBQVNRLDRCQUE0QkEsQ0FDbER0QixJQUFJLEVBQ0p1QixVQUFVLEVBQ1ZDLFVBQVUsRUFDVkMsSUFBSSxFQUNKO0VBQ0EsSUFBSUMsV0FBVztFQUNmLElBQUlDLGFBQWE7RUFFakIsTUFBTUMsa0JBQWtCLEdBQUcsSUFBSXpFLFdBQVcsQ0FBQyxDQUFDO0VBQzVDeUUsa0JBQWtCLENBQUNDLHNCQUFzQixHQUFHQSxzQkFBc0I7RUFFbEUsTUFBTUMsc0JBQXNCLEdBQUdULDJFQUFvQixDQUFDLENBQUM7RUFFckQsTUFBTVUsb0JBQW9CLEdBQUdYLG9FQUEyQixDQUN0RFksZ0JBQWdCLENBQUNDLFFBQVEsQ0FBQ0MsZUFBZSxDQUFDLENBQUNDLGdCQUFnQixDQUN6RCx3QkFDRixDQUFDLEVBQ0RILGdCQUFnQixDQUFDQyxRQUFRLENBQUNDLGVBQWUsQ0FBQyxDQUFDQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQzNFLENBQUM7RUFFRCxPQUFPUCxrQkFBa0I7RUFFekIsU0FBU0Msc0JBQXNCQSxDQUFBLEVBQUc7SUFDaENPLHFCQUFxQixDQUFDLENBQUM7SUFDdkJDLGtCQUFrQixDQUFDLENBQUM7SUFDcEIsT0FBT1gsV0FBVztFQUNwQjtFQUVBLFNBQVNVLHFCQUFxQkEsQ0FBQSxFQUFHO0lBQy9CVixXQUFXLEdBQUdPLFFBQVEsQ0FBQ0ssYUFBYSxDQUFDLEtBQUssQ0FBQztJQUUzQ1osV0FBVyxDQUFDYSxTQUFTLENBQUNuRixHQUFHLENBQ3ZCLGNBQWMsRUFDZCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUNGLENBQUM7SUFFRHNFLFdBQVcsQ0FBQ2Msa0JBQWtCLENBQUMsWUFBWSxFQUFFQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDbkVkLGFBQWEsR0FBRzNCLElBQUksQ0FBQzVELE1BQU07SUFDM0IyRixvQkFBb0IsQ0FBQ1csbUJBQW1CLENBQ3RDZixhQUFhLEVBQ2JELFdBQVcsQ0FBQ2lCLGFBQWEsQ0FBQyxzQkFBc0IsQ0FDbEQsQ0FBQztJQUNEakIsV0FBVyxDQUFDaUIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDSixTQUFTLENBQUNuRixHQUFHLENBQUMsMEJBQTBCLENBQUM7SUFDM0VzRSxXQUFXLENBQUNhLFNBQVMsQ0FBQ25GLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztFQUN6RDtFQUVBLFNBQVNpRixrQkFBa0JBLENBQUEsRUFBRztJQUM1Qk8sd0NBQXdDLENBQUMsQ0FBQztJQUMxQ2xCLFdBQVcsQ0FDUmlCLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUN4Q0UsZ0JBQWdCLENBQUMsT0FBTyxFQUFFQyxlQUFlLENBQUM7SUFFN0NwQixXQUFXLENBQ1JxQixnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUN0Q25DLE9BQU8sQ0FBRW9DLElBQUksSUFBS0EsSUFBSSxDQUFDSCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVJLFlBQVksQ0FBQyxDQUFDO0lBRWxFdkIsV0FBVyxDQUNSaUIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUM3QkUsZ0JBQWdCLENBQUMsT0FBTyxFQUFHSyxLQUFLLElBQy9CcEIsc0JBQXNCLENBQUNxQixlQUFlLENBQUN6QixXQUFXLEVBQUN3QixLQUFLLENBQzFELENBQUM7SUFFSHBCLHNCQUFzQixDQUFDTyxrQkFBa0IsQ0FBQ1gsV0FBVyxDQUFDO0lBRXRELFNBQVNrQix3Q0FBd0NBLENBQUEsRUFBRztNQUNsRCxJQUFJbkIsSUFBSSxJQUFJLE1BQU0sRUFBRTtRQUNsQkMsV0FBVyxDQUNSaUIsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQ3ZDRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUV2RixRQUFRLENBQUM7TUFDeEMsQ0FBQyxNQUFNO1FBQ0xvRSxXQUFXLENBQ1JpQixhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FDdENFLGdCQUFnQixDQUFDLE9BQU8sRUFBRU8sT0FBTyxDQUFDO01BQ3ZDO0lBQ0Y7RUFDRjtFQUVBLFNBQVNBLE9BQU9BLENBQUEsRUFBRztJQUNqQk4sZUFBZSxDQUFDLENBQUM7SUFDakIsTUFBTXZELFlBQVksR0FBRyxJQUFJZ0IsV0FBVyxDQUFDLFNBQVMsRUFBRTtNQUM5Q2QsTUFBTSxFQUFFNEQsNkJBQTZCLENBQUM7SUFDeEMsQ0FBQyxDQUFDO0lBQ0Z6QixrQkFBa0IsQ0FBQ3RCLGFBQWEsQ0FBQ2YsWUFBWSxDQUFDO0VBQ2hEO0VBRUEsU0FBU2pDLFFBQVFBLENBQUEsRUFBRztJQUNsQndGLGVBQWUsQ0FBQyxDQUFDO0lBQ2pCLE1BQU1oRCxVQUFVLEdBQUd1RCw2QkFBNkIsQ0FBQyxDQUFDO0lBQ2xEdkQsVUFBVSxDQUFDSixJQUFJLEdBQUdNLElBQUksQ0FBQ04sSUFBSTtJQUMzQixNQUFNRyxhQUFhLEdBQUcsSUFBSVUsV0FBVyxDQUFDLFVBQVUsRUFBRTtNQUNoRGQsTUFBTSxFQUFFSztJQUNWLENBQUMsQ0FBQztJQUNGOEIsa0JBQWtCLENBQUN0QixhQUFhLENBQUNULGFBQWEsQ0FBQztFQUNqRDtFQUVBLFNBQVN3RCw2QkFBNkJBLENBQUEsRUFBRztJQUN2QyxPQUFPckgsMkRBQVcsQ0FDaEIwRixXQUFXLENBQUNpQixhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQ1csS0FBSyxFQUN0RDVCLFdBQVcsQ0FBQ2lCLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDVyxLQUFLLEVBQ3ZENUIsV0FBVyxDQUFDaUIsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUNZLFdBQVcsRUFDN0Q1QixhQUNGLENBQUM7RUFDSDtFQUVBLFNBQVNtQixlQUFlQSxDQUFDSSxLQUFLLEVBQUU7SUFDOUJ4QixXQUFXLENBQUNhLFNBQVMsQ0FBQ25GLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQztJQUN0RHNFLFdBQVcsQ0FBQ2lCLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQ0osU0FBUyxDQUFDbkYsR0FBRyxDQUFDLHlCQUF5QixDQUFDO0lBQzFFc0UsV0FBVyxDQUNSaUIsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQ3hDYSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUVWLGVBQWUsQ0FBQztJQUNoRFcsVUFBVSxDQUFDLE1BQU07TUFDZi9CLFdBQVcsQ0FBQ2dDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDVDtFQUVBLFNBQVNULFlBQVlBLENBQUNDLEtBQUssRUFBRTtJQUMzQkEsS0FBSyxDQUFDUyxlQUFlLENBQUMsQ0FBQztJQUN2QixJQUFJaEMsYUFBYSxJQUFJdUIsS0FBSyxDQUFDVSxNQUFNLENBQUNDLE9BQU8sQ0FBQ0MsVUFBVSxFQUFFO01BQ3BEbkMsYUFBYSxHQUFHLENBQUM7SUFDbkIsQ0FBQyxNQUFNO01BQ0xBLGFBQWEsR0FBR3VCLEtBQUssQ0FBQ1UsTUFBTSxDQUFDQyxPQUFPLENBQUNDLFVBQVU7SUFDakQ7SUFDQS9CLG9CQUFvQixDQUFDVyxtQkFBbUIsQ0FDdENmLGFBQWEsRUFDYkQsV0FBVyxDQUFDaUIsYUFBYSxDQUFDLHNCQUFzQixDQUNsRCxDQUFDO0VBQ0g7RUFFQSxTQUFTRixtQkFBbUJBLENBQUEsRUFBRztJQUM3QixPQUFRO0FBQ1o7QUFDQTtBQUNBLDREQUE0RGxCLFVBQVc7QUFDdkU7QUFDQTtBQUNBLGtFQUFrRXZCLElBQUksQ0FBQy9ELEtBQU07QUFDN0U7QUFDQTtBQUNBO0FBQ0EsbUVBQ3NCK0QsSUFBSSxDQUFDOUQsTUFDTjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I0RixzQkFBc0IsQ0FBQ2lDLHVCQUF1QixDQUFDL0QsSUFBSSxDQUFDN0QsTUFBTSxDQUFFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCNEYsb0JBQW9CLENBQUNpQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUU7QUFDcEU7QUFDQTtBQUNBLHlDQUF5Q3ZDLElBQUssdUNBQXNDRCxVQUFXO0FBQy9GO0FBQ0EsQ0FBQztFQUNDO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEt3QjtBQUNnRDtBQUNLO0FBRTlELFNBQVMwQyxlQUFlQSxDQUFBLEVBQUc7RUFDeEMsTUFBTUMsaUJBQWlCLEdBQUcsSUFBSWhILFdBQVcsQ0FBQyxDQUFDO0VBQzNDZ0gsaUJBQWlCLENBQUNDLGNBQWMsR0FBR0MsZUFBZTtFQUNsREYsaUJBQWlCLENBQUNoQixlQUFlLEdBQUdtQixnQkFBZ0I7RUFDcERILGlCQUFpQixDQUFDSSxjQUFjLEdBQUdDLGVBQWU7RUFFbEQsTUFBTXpDLG9CQUFvQixHQUFHWCx1RUFBMkIsQ0FDdERZLGdCQUFnQixDQUFDQyxRQUFRLENBQUNDLGVBQWUsQ0FBQyxDQUFDQyxnQkFBZ0IsQ0FDekQsd0JBQ0YsQ0FBQyxFQUNESCxnQkFBZ0IsQ0FBQ0MsUUFBUSxDQUFDQyxlQUFlLENBQUMsQ0FBQ0MsZ0JBQWdCLENBQ3pELG1CQUNGLENBQ0YsQ0FBQztFQUVELE1BQU1zQyxxQkFBcUIsR0FBR1IsMkVBQTRCLENBQUMsQ0FBQztFQUU1RCxPQUFPRSxpQkFBaUI7RUFFeEIsU0FBU0UsZUFBZUEsQ0FBQ0ssVUFBVSxFQUFFO0lBQ25DLE1BQU1DLFFBQVEsR0FBRzFDLFFBQVEsQ0FBQ0ssYUFBYSxDQUFDLElBQUksQ0FBQztJQUM3Q3FDLFFBQVEsQ0FBQ3BDLFNBQVMsQ0FBQ25GLEdBQUcsQ0FDcEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsRUFDZixpQkFDRixDQUFDO0lBQ0R1SCxRQUFRLENBQUNDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRUYsVUFBVSxDQUFDaEYsSUFBSSxDQUFDO0lBQ3hEaUYsUUFBUSxDQUFDbkMsa0JBQWtCLENBQUMsWUFBWSxFQUFFcUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQy9ERixRQUFRLENBQUNoQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQ1ksV0FBVyxHQUN2RG1CLFVBQVUsQ0FBQ3pJLEtBQUs7SUFDbEIwSSxRQUFRLENBQUNoQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQ1ksV0FBVyxHQUN4RG1CLFVBQVUsQ0FBQ3hJLE1BQU07SUFDbkJ5SSxRQUFRLENBQUNoQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQ1ksV0FBVyxHQUN4RG1CLFVBQVUsQ0FBQ3ZJLE1BQU07SUFDbkJzSSxxQkFBcUIsQ0FBQ3BDLGtCQUFrQixDQUFDc0MsUUFBUSxDQUFDO0lBQ2xERixxQkFBcUIsQ0FBQzVCLGdCQUFnQixDQUFDLGNBQWMsRUFBR0ssS0FBSyxJQUFLO01BQ2hFaUIsaUJBQWlCLENBQUM3RCxhQUFhLENBQzdCLElBQUlDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7UUFBRWQsTUFBTSxFQUFFeUQsS0FBSyxDQUFDekQ7TUFBTyxDQUFDLENBQzFELENBQUM7SUFDSCxDQUFDLENBQUM7SUFDRmtGLFFBQVEsQ0FBQ2hDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQ0UsZ0JBQWdCLENBQUMsTUFBTSxFQUFHSyxLQUFLLElBQUs7TUFDekVzQixlQUFlLENBQUN0QixLQUFLLEVBQUVBLEtBQUssQ0FBQ1UsTUFBTSxDQUFDa0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztJQUVGL0Msb0JBQW9CLENBQUNXLG1CQUFtQixDQUFDZ0MsVUFBVSxDQUFDdEksTUFBTSxFQUFFdUksUUFBUSxDQUFDO0lBQ3JFLE9BQU9BLFFBQVE7RUFDakI7RUFFQSxTQUFTTCxnQkFBZ0JBLENBQUNTLFlBQVksRUFBRTtJQUN0Q04scUJBQXFCLENBQUN0QixlQUFlLENBQUM0QixZQUFZLENBQUM7RUFDckQ7RUFFQSxTQUFTUCxlQUFlQSxDQUFDdEIsS0FBSyxFQUFFNkIsWUFBWSxFQUFFO0lBQzVDTixxQkFBcUIsQ0FBQ0YsY0FBYyxDQUFDckIsS0FBSyxFQUFFNkIsWUFBWSxDQUFDO0VBQzNEO0VBRUEsU0FBU0Ysa0JBQWtCQSxDQUFBLEVBQUc7SUFDNUIsT0FBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCSixxQkFBcUIsQ0FBQ1YsdUJBQXVCLENBQUMsQ0FBRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEJoQyxvQkFBb0IsQ0FBQ2lDLHFCQUFxQixDQUFDLENBQUMsQ0FBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0VBQ0M7QUFDRjs7Ozs7Ozs7Ozs7Ozs7QUN2R2UsU0FBUzVDLDJCQUEyQkEsQ0FBQzRELFFBQVEsRUFBRUMsVUFBVSxFQUFFO0VBQ3hFLFNBQVNqQixxQkFBcUJBLENBQUNrQixhQUFhLEVBQUU7SUFDNUMsSUFBSUMsWUFBWSxHQUFHLEVBQUU7SUFDckIsS0FBSyxJQUFJQyxDQUFDLEdBQUdGLGFBQWEsRUFBRUUsQ0FBQyxJQUFJLENBQUMsRUFBRUEsQ0FBQyxFQUFFLEVBQUU7TUFDdkNELFlBQVksSUFBSyx5QkFBd0JDLENBQUU7QUFDakQ7QUFDQSx3Q0FBd0NILFVBQVc7QUFDbkQsNEJBQTRCO0lBQ3hCO0lBQ0EsT0FBT0UsWUFBWTtFQUNyQjtFQUVBLFNBQVN6QyxtQkFBbUJBLENBQUN0RyxNQUFNLEVBQUVpSixnQkFBZ0IsRUFBRTtJQUNyREMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUVuQixJQUFJLENBQUNsSixNQUFNLEVBQUU7SUFDYixNQUFNbUosZ0JBQWdCLEdBQUdGLGdCQUFnQixDQUFDMUMsYUFBYSxDQUNwRCxzQkFBcUJ2RyxNQUFPLElBQy9CLENBQUM7SUFFRG1KLGdCQUFnQixDQUFDWCxZQUFZLENBQUMsTUFBTSxFQUFHLE9BQU1JLFFBQVMsR0FBRSxDQUFDO0lBQ3pETyxnQkFBZ0IsQ0FBQ1gsWUFBWSxDQUFDLFFBQVEsRUFBRyxPQUFNSyxVQUFXLEdBQUUsQ0FBQztJQUM3RCxJQUFJTyxXQUFXLEdBQUdELGdCQUFnQixDQUFDRSxrQkFBa0I7SUFDckQsT0FBT0QsV0FBVyxFQUFFO01BQ2xCQSxXQUFXLENBQUNaLFlBQVksQ0FBQyxNQUFNLEVBQUcsT0FBTUksUUFBUyxHQUFFLENBQUM7TUFDcERRLFdBQVcsQ0FBQ1osWUFBWSxDQUFDLFFBQVEsRUFBRyxPQUFNSyxVQUFXLEdBQUUsQ0FBQztNQUN4RE8sV0FBVyxHQUFHQSxXQUFXLENBQUNDLGtCQUFrQjtJQUM5QztJQUVBLFNBQVNILGVBQWVBLENBQUEsRUFBRztNQUN6QkQsZ0JBQWdCLENBQ2J0QyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUN0Q25DLE9BQU8sQ0FBRW9DLElBQUksSUFBS0EsSUFBSSxDQUFDNEIsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RDtFQUNGO0VBQ0EsT0FBTztJQUFFWixxQkFBcUI7SUFBRXRCO0VBQW9CLENBQUM7QUFDdkQ7Ozs7Ozs7Ozs7Ozs7OztBQ3BDNkI7QUFDZCxTQUFTZ0QsNkJBQTZCQSxDQUFBLEVBQUc7RUFDdEQsTUFBTTVELHNCQUFzQixHQUFHLElBQUkzRSxXQUFXLENBQUMsQ0FBQztFQUNoRDJFLHNCQUFzQixDQUFDaUMsdUJBQXVCLEdBQUc0Qix3QkFBd0I7RUFDekU3RCxzQkFBc0IsQ0FBQ08sa0JBQWtCLEdBQUd1RCxtQkFBbUI7RUFDL0Q5RCxzQkFBc0IsQ0FBQ3FCLGVBQWUsR0FBR21CLGdCQUFnQjtFQUN6RHhDLHNCQUFzQixDQUFDeUMsY0FBYyxHQUFHQyxlQUFlO0VBQ3ZELE9BQU8xQyxzQkFBc0I7RUFFN0IsU0FBUzhELG1CQUFtQkEsQ0FBQ0MsZUFBZSxFQUFFO0lBQzVDQSxlQUFlLENBQ1psRCxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FDN0NFLGdCQUFnQixDQUFDLFdBQVcsRUFBR0ssS0FBSyxJQUFLO01BQ3hDQSxLQUFLLENBQUNTLGVBQWUsQ0FBQyxDQUFDO01BQ3ZCbUMsY0FBYyxDQUFDRCxlQUFlLEVBQUUzQyxLQUFLLENBQUNVLE1BQU0sQ0FBQztJQUMvQyxDQUFDLENBQUM7RUFDTjtFQUVBLFNBQVNVLGdCQUFnQkEsQ0FBQ3lCLFVBQVUsRUFBRTdDLEtBQUssRUFBRTtJQUMzQ0EsS0FBSyxDQUFDUyxlQUFlLENBQUMsQ0FBQztJQUN2QixJQUNFb0MsVUFBVSxDQUNQcEQsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQ2hDcUQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLE1BQU0sRUFDMUM7TUFDQUQsVUFBVSxDQUNQcEQsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQ2hDaUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7SUFDM0MsQ0FBQyxNQUFNO01BQ0xtQixVQUFVLENBQ1BwRCxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FDaENpQyxZQUFZLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztJQUMxQztFQUNGO0VBRUEsU0FBU0osZUFBZUEsQ0FBQ3RCLEtBQUssRUFBRTZDLFVBQVUsRUFBRTtJQUMxQzdDLEtBQUssQ0FBQ1MsZUFBZSxDQUFDLENBQUM7SUFDdkIsSUFBSVQsS0FBSyxDQUFDVSxNQUFNLENBQUNxQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsRUFBRTtNQUN2REYsVUFBVSxDQUFDcEQsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUNZLFdBQVcsR0FDakVMLEtBQUssQ0FBQ1UsTUFBTSxDQUFDTCxXQUFXO0lBQzVCO0lBQ0F3QyxVQUFVLENBQ1BwRCxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FDaENpQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztFQUMzQztFQUVBLFNBQVNrQixjQUFjQSxDQUFDQyxVQUFVLEVBQUVuQyxNQUFNLEVBQUU7SUFDMUNtQyxVQUFVLENBQUNwRCxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQ1ksV0FBVyxHQUMxREssTUFBTSxDQUFDTCxXQUFXO0VBQ3RCO0VBRUEsU0FBU29DLHdCQUF3QkEsQ0FBQ08sd0JBQXdCLEVBQUU7SUFDMUQsT0FBUTtBQUNaO0FBQ0E7QUFDQSwyREFBMkRBLHdCQUF5QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0VBQzdCO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckU4QztBQUN1QztBQUNaO0FBRTFELFNBQVNFLFVBQVVBLENBQUEsRUFBRztFQUNuQztFQUNBLElBQUlsSixTQUFTO0VBQ2IsTUFBTWlILGlCQUFpQixHQUFHZ0MsNEVBQXdCLENBQUMsQ0FBQztFQUVwRCxNQUFNRSxHQUFHLEdBQUc7SUFDVkMsQ0FBQyxFQUFFO01BQ0RDLFdBQVcsRUFBRXRFLFFBQVEsQ0FBQ2MsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUM7TUFDNUR5RCxRQUFRLEVBQUV2RSxRQUFRLENBQUNVLGFBQWEsQ0FBQyxRQUFRLENBQUM7TUFDMUNTLE9BQU8sRUFBRW5CLFFBQVEsQ0FBQ1UsYUFBYSxDQUFDLDRCQUE0QixDQUFDO01BQzdEOEQsT0FBTyxFQUFFeEUsUUFBUSxDQUFDVSxhQUFhLENBQUMseUJBQXlCLENBQUM7TUFDMUQrRCxTQUFTLEVBQUV6RSxRQUFRLENBQUNVLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQztNQUN4RGdFLGVBQWUsRUFBRTFFLFFBQVEsQ0FBQ1UsYUFBYSxDQUFDLG1CQUFtQixDQUFDO01BQzVEaUUsWUFBWSxFQUFFM0UsUUFBUSxDQUFDVSxhQUFhLENBQUMsNEJBQTRCLENBQUM7TUFDbEVrRSxhQUFhLEVBQUU1RSxRQUFRLENBQUNVLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQztNQUNwRXZDLE1BQU0sRUFBRTZCLFFBQVEsQ0FBQ2MsZ0JBQWdCLENBQUMsc0NBQXNDLENBQUM7TUFDekUrRCxXQUFXLEVBQUU3RSxRQUFRLENBQUNVLGFBQWEsQ0FBQyxlQUFlO0lBQ3JEO0VBQ0YsQ0FBQztFQUVEb0UsT0FBTyxDQUFDLENBQUM7RUFFVCxlQUFlQSxPQUFPQSxDQUFBLEVBQUc7SUFDdkIsSUFBSTtNQUNGN0osU0FBUyxHQUFHLE1BQU1OLHlEQUFnQixDQUFDLENBQUM7TUFDcENvSyxjQUFjLENBQUMsQ0FBQztNQUNoQjNFLGtCQUFrQixDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDLE9BQU9qRCxLQUFLLEVBQUUsQ0FBQztFQUNuQjtFQUVBLFNBQVM0SCxjQUFjQSxDQUFBLEVBQUc7SUFDeEJYLEdBQUcsQ0FBQ0MsQ0FBQyxDQUFDRSxRQUFRLENBQUNTLGVBQWUsQ0FDNUIsR0FBRy9KLFNBQVMsQ0FDVE0sUUFBUSxDQUFDLENBQUMsQ0FDVnVDLEdBQUcsQ0FBRTJFLFVBQVUsSUFBS1AsaUJBQWlCLENBQUNDLGNBQWMsQ0FBQ00sVUFBVSxDQUFDLENBQ3JFLENBQUM7RUFDSDtFQUVBLFNBQVNyQyxrQkFBa0JBLENBQUEsRUFBRztJQUM1QixJQUFJNkUscUJBQXFCO0lBRXpCQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xCQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3ZCQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXBCLFNBQVNGLGdCQUFnQkEsQ0FBQSxFQUFHO01BQzFCZCxHQUFHLENBQUNDLENBQUMsQ0FBQ2xELE9BQU8sQ0FBQ1AsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQ3RDeUUsbUJBQW1CLENBQ2pCO1FBQUVyTCxLQUFLLEVBQUUsRUFBRTtRQUFFQyxNQUFNLEVBQUUsRUFBRTtRQUFFQyxNQUFNLEVBQUUsRUFBRTtRQUFFQyxNQUFNLEVBQUU7TUFBRyxDQUFDLEVBQ2pELDZCQUE2QixFQUM3QixVQUFVLEVBQ1YsS0FBSyxFQUNMaUssR0FBRyxDQUFDQyxDQUFDLENBQUNHLE9BQ1IsQ0FDRixDQUFDO01BRUQsTUFBTWMscUJBQXFCLEdBQUdDLFFBQVEsQ0FDbkMvRyxVQUFVLElBQUt2RCxTQUFTLENBQUNnQixZQUFZLENBQUN1QyxVQUFVLENBQUMsRUFDbEQsR0FDRixDQUFDO01BQ0Q0RixHQUFHLENBQUNDLENBQUMsQ0FBQ0ksU0FBUyxDQUFDN0QsZ0JBQWdCLENBQUMsT0FBTyxFQUFHSyxLQUFLLElBQzlDcUUscUJBQXFCLENBQUNyRSxLQUFLLENBQUNVLE1BQU0sQ0FBQ04sS0FBSyxDQUMxQyxDQUFDO01BRUQsU0FBU2tFLFFBQVFBLENBQUNDLEVBQUUsRUFBRUMsS0FBSyxFQUFFO1FBQzNCLElBQUlDLE9BQU87UUFDWCxPQUFPLFlBQWE7VUFBQSxTQUFBQyxJQUFBLEdBQUFDLFNBQUEsQ0FBQTNHLE1BQUEsRUFBVDRHLElBQUksT0FBQUMsS0FBQSxDQUFBSCxJQUFBLEdBQUFJLElBQUEsTUFBQUEsSUFBQSxHQUFBSixJQUFBLEVBQUFJLElBQUE7WUFBSkYsSUFBSSxDQUFBRSxJQUFBLElBQUFILFNBQUEsQ0FBQUcsSUFBQTtVQUFBO1VBQ2JDLFlBQVksQ0FBQ04sT0FBTyxDQUFDO1VBQ3JCMUYsUUFBUSxDQUFDVSxhQUFhLENBQ3BCLG9DQUNGLENBQUMsQ0FBQ3VGLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE9BQU87VUFDekJSLE9BQU8sR0FBR2xFLFVBQVUsQ0FBQyxNQUFNO1lBQ3pCZ0UsRUFBRSxDQUFDLEdBQUdLLElBQUksQ0FBQztZQUNYN0YsUUFBUSxDQUFDVSxhQUFhLENBQ3BCLG9DQUNGLENBQUMsQ0FBQ3VGLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07VUFDMUIsQ0FBQyxFQUFFVCxLQUFLLENBQUM7UUFDWCxDQUFDO01BQ0g7TUFFQXJCLEdBQUcsQ0FBQ0MsQ0FBQyxDQUFDTSxZQUFZLENBQUMvRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUV1RixpQkFBaUIsQ0FBQztNQUMvRG5HLFFBQVEsQ0FBQ1ksZ0JBQWdCLENBQUMsT0FBTyxFQUFFd0Ysc0JBQXNCLENBQUM7TUFFMUQsU0FBU0Esc0JBQXNCQSxDQUFDbkYsS0FBSyxFQUFFO1FBQ3JDLElBQ0UsQ0FBQ0EsS0FBSyxDQUFDVSxNQUFNLENBQUNrQixPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFDMUN1QixHQUFHLENBQUNDLENBQUMsQ0FBQ00sWUFBWSxDQUFDWixZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksTUFBTSxFQUMxRDtVQUNBSyxHQUFHLENBQUNDLENBQUMsQ0FBQ08sYUFBYSxDQUFDcUIsS0FBSyxDQUFDQyxPQUFPLEdBQUcsTUFBTTtVQUMxQzlCLEdBQUcsQ0FBQ0MsQ0FBQyxDQUFDTSxZQUFZLENBQUNoQyxZQUFZLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztRQUMzRDtNQUNGO01BRUEsU0FBU3dELGlCQUFpQkEsQ0FBQ2xGLEtBQUssRUFBRTtRQUNoQyxJQUFJbUQsR0FBRyxDQUFDQyxDQUFDLENBQUNNLFlBQVksQ0FBQ1osWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLE1BQU0sRUFBRTtVQUM5REssR0FBRyxDQUFDQyxDQUFDLENBQUNNLFlBQVksQ0FBQ2hDLFlBQVksQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDO1VBQ3pEeUIsR0FBRyxDQUFDQyxDQUFDLENBQUNPLGFBQWEsQ0FBQ3FCLEtBQUssQ0FBQ0MsT0FBTyxHQUFHLE1BQU07UUFDNUMsQ0FBQyxNQUFNO1VBQ0w5QixHQUFHLENBQUNDLENBQUMsQ0FBQ00sWUFBWSxDQUFDaEMsWUFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUM7VUFDeER5QixHQUFHLENBQUNDLENBQUMsQ0FBQ08sYUFBYSxDQUFDcUIsS0FBSyxDQUFDQyxPQUFPLEdBQUcsT0FBTztRQUM3QztNQUNGO01BRUE5QixHQUFHLENBQUNDLENBQUMsQ0FBQ2xHLE1BQU0sQ0FBQ1EsT0FBTyxDQUFFUixNQUFNLElBQzFCQSxNQUFNLENBQUN5QyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUV5RixhQUFhLENBQUNDLElBQUksQ0FBQ25JLE1BQU0sQ0FBQyxDQUM3RCxDQUFDO01BQ0QsU0FBU2tJLGFBQWFBLENBQUNwRixLQUFLLEVBQUU7UUFDNUIsTUFBTXNGLFVBQVUsR0FDZCxJQUFJLENBQUN6QyxVQUFVLENBQUNwRCxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQ1ksV0FBVztRQUNqRSxJQUFJTCxLQUFLLENBQUNVLE1BQU0sQ0FBQzZFLE9BQU8sRUFBRTtVQUN4QnZMLFNBQVMsQ0FBQ2tCLHNCQUFzQixDQUFDb0ssVUFBVSxDQUFDO1VBQzVDRSxhQUFhLENBQUNGLFVBQVUsQ0FBQztRQUMzQixDQUFDLE1BQU07VUFDTHRMLFNBQVMsQ0FBQ29CLHlCQUF5QixDQUFDa0ssVUFBVSxDQUFDO1VBQy9DRyxnQkFBZ0IsQ0FBQ0gsVUFBVSxDQUFDO1FBQzlCO1FBRUEsU0FBU0UsYUFBYUEsQ0FBQSxFQUFHO1VBQ3ZCckMsR0FBRyxDQUFDQyxDQUFDLENBQUNRLFdBQVcsQ0FBQzhCLE1BQU0sQ0FBQ0Msb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1FBQ2xEO1FBQ0EsU0FBU0YsZ0JBQWdCQSxDQUFBLEVBQUc7VUFDMUIxRyxRQUFRLENBQ0xVLGFBQWEsQ0FBRSwyQkFBMEI2RixVQUFXLElBQUcsQ0FBQyxDQUN4RDlFLE1BQU0sQ0FBQyxDQUFDO1FBQ2I7UUFFQSxTQUFTbUYsb0JBQW9CQSxDQUFBLEVBQUc7VUFDOUIsTUFBTUMsVUFBVSxHQUFHN0csUUFBUSxDQUFDSyxhQUFhLENBQUMsS0FBSyxDQUFDO1VBQ2hEd0csVUFBVSxDQUFDbEUsWUFBWSxDQUFDLHVCQUF1QixFQUFHLEdBQUU0RCxVQUFXLEVBQUMsQ0FBQztVQUNqRU0sVUFBVSxDQUFDdkcsU0FBUyxDQUFDbkYsR0FBRyxDQUN0QixNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFdBQVcsRUFDWCxnQkFDRixDQUFDO1VBQ0QsTUFBTTJMLE9BQU8sR0FBRzlHLFFBQVEsQ0FBQ0ssYUFBYSxDQUFDLFFBQVEsQ0FBQztVQUNoRHlHLE9BQU8sQ0FBQ3hGLFdBQVcsR0FBSSxHQUFFaUYsVUFBVyxXQUFVO1VBQzlDTSxVQUFVLENBQUNGLE1BQU0sQ0FBQ0csT0FBTyxDQUFDO1VBQzFCLE9BQU9ELFVBQVU7UUFDbkI7TUFDRjtNQUVBekMsR0FBRyxDQUFDQyxDQUFDLENBQUNRLFdBQVcsQ0FBQ2pFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVSyxLQUFLLEVBQUU7UUFDM0QsSUFBSUEsS0FBSyxDQUFDVSxNQUFNLENBQUNrQixPQUFPLENBQUMseUJBQXlCLENBQUMsRUFBRTtVQUNuRCxNQUFNZ0UsVUFBVSxHQUFHNUYsS0FBSyxDQUFDVSxNQUFNLENBQUNrQixPQUFPLENBQUMseUJBQXlCLENBQUM7VUFDbEUsTUFBTTBELFVBQVUsR0FBSSxHQUFFTSxVQUFVLENBQUM5QyxZQUFZLENBQzNDLHVCQUNGLENBQUUsRUFBQztVQUNILElBQUksQ0FBQ3JELGFBQWEsQ0FDZiwyQkFBMEI2RixVQUFXLElBQ3hDLENBQUMsQ0FBQzlFLE1BQU0sQ0FBQyxDQUFDO1VBQ1YsTUFBTXNGLFlBQVksR0FBRzNDLEdBQUcsQ0FBQ0MsQ0FBQyxDQUFDTyxhQUFhLENBQUNsRSxhQUFhLENBQ25ELGlCQUFnQm1HLFVBQVUsQ0FBQzlDLFlBQVksQ0FDdEMsdUJBQ0YsQ0FBRSxVQUNKLENBQUM7VUFDRGdELFlBQVksQ0FBQ1AsT0FBTyxHQUFHLEtBQUs7VUFDNUJ2TCxTQUFTLENBQUNvQix5QkFBeUIsQ0FBQ2tLLFVBQVUsQ0FBQztRQUNqRDtNQUNGLENBQUMsQ0FBQztJQUNKO0lBRUEsU0FBU3BCLHFCQUFxQkEsQ0FBQSxFQUFHO01BQy9CO01BQ0FsSyxTQUFTLENBQUMyRixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUVtRSxjQUFjLENBQUM7SUFDdEQ7SUFFQSxTQUFTSyxrQkFBa0JBLENBQUEsRUFBRztNQUM1QmxELGlCQUFpQixDQUFDdEIsZ0JBQWdCLENBQUMsY0FBYyxFQUFHSyxLQUFLLElBQ3ZEaEcsU0FBUyxDQUFDVSxtQkFBbUIsQ0FBQ3NGLEtBQUssQ0FBQ3pELE1BQU0sQ0FBQ0MsSUFBSSxFQUFFd0QsS0FBSyxDQUFDekQsTUFBTSxDQUFDZSxTQUFTLENBQ3pFLENBQUM7TUFDRHlJLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxDQUFDbEUsWUFBWSxFQUFFN0IsS0FBSyxLQUFLO1FBQ3ZFLE1BQU1oRCxTQUFTLEdBQUdnRCxLQUFLLENBQUNVLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxVQUFVO1FBQ2pELE1BQU1vRixNQUFNLEdBQUduRSxZQUFZLENBQUNsQixPQUFPLENBQUNzRixRQUFRO1FBQzVDak0sU0FBUyxDQUFDUSxnQkFBZ0IsQ0FBQ3dMLE1BQU0sRUFBRWhKLFNBQVMsQ0FBQztNQUMvQyxDQUFDLENBQUM7TUFFRitJLGdCQUFnQixDQUNkLE9BQU8sRUFDUCxzQkFBc0IsRUFDdEIsQ0FBQ2xFLFlBQVksRUFBRTdCLEtBQUssS0FBSztRQUN2QixNQUFNakQsUUFBUSxHQUFHOEUsWUFBWSxDQUFDbEIsT0FBTyxDQUFDc0YsUUFBUTtRQUM5Q2pNLFNBQVMsQ0FBQ2MsVUFBVSxDQUFDaUMsUUFBUSxDQUFDO01BQ2hDLENBQ0YsQ0FBQztNQUVEZ0osZ0JBQWdCLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLENBQUNsRSxZQUFZLEVBQUU3QixLQUFLLEtBQUs7UUFDdkVvRSxtQkFBbUIsQ0FDakI7VUFDRTVILElBQUksRUFBRXFGLFlBQVksQ0FBQ2lCLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztVQUNqRC9KLEtBQUssRUFBRThJLFlBQVksQ0FBQ3BDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUNyRFksV0FBVztVQUNkckgsTUFBTSxFQUFFNkksWUFBWSxDQUFDcEMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQ3ZEWSxXQUFXO1VBQ2RwSCxNQUFNLEVBQUU0SSxZQUFZLENBQUNwQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FDdkRZLFdBQVc7VUFDZG5ILE1BQU0sRUFBRWMsU0FBUyxDQUFDWSxhQUFhLENBQUNpSCxZQUFZLENBQUNsQixPQUFPLENBQUNzRixRQUFRO1FBQy9ELENBQUMsRUFDRCxnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLE1BQU0sRUFDTnBFLFlBQ0YsQ0FBQztNQUNILENBQUMsQ0FBQztNQUVGa0UsZ0JBQWdCLENBQ2QsV0FBVyxFQUNYLDZCQUE2QixFQUM3QixDQUFDbEUsWUFBWSxFQUFFN0IsS0FBSyxLQUFLO1FBQ3ZCLE1BQU1qRCxRQUFRLEdBQUc4RSxZQUFZLENBQUNsQixPQUFPLENBQUNzRixRQUFRO1FBQzlDak0sU0FBUyxDQUFDVSxtQkFBbUIsQ0FBQ3FDLFFBQVEsRUFBRWlELEtBQUssQ0FBQ1UsTUFBTSxDQUFDTCxXQUFXLENBQUM7TUFDbkUsQ0FDRixDQUFDO01BRUQwRixnQkFBZ0IsQ0FDZCxPQUFPLEVBQ1AsZ0NBQWdDLEVBQ2hDLENBQUNsRSxZQUFZLEVBQUU3QixLQUFLLEtBQUs7UUFDdkJpQixpQkFBaUIsQ0FBQ2hCLGVBQWUsQ0FBQzRCLFlBQVksQ0FBQztNQUNqRCxDQUNGLENBQUM7TUFFRCxTQUFTa0UsZ0JBQWdCQSxDQUFDRyxTQUFTLEVBQUVDLFFBQVEsRUFBRUMsT0FBTyxFQUFFO1FBQ3REakQsR0FBRyxDQUFDQyxDQUFDLENBQUNFLFFBQVEsQ0FBQzNELGdCQUFnQixDQUFDdUcsU0FBUyxFQUFHbEcsS0FBSyxJQUFLO1VBQ3BELElBQUlBLEtBQUssQ0FBQ1UsTUFBTSxDQUFDcUMsT0FBTyxDQUFDb0QsUUFBUSxDQUFDLEVBQUU7WUFDbENDLE9BQU8sQ0FBQ3BHLEtBQUssQ0FBQ1UsTUFBTSxDQUFDa0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFNUIsS0FBSyxDQUFDO1VBQy9DO1FBQ0YsQ0FBQyxDQUFDO01BQ0o7SUFDRjtJQUVBLFNBQVNvRSxtQkFBbUJBLENBQzFCdEgsSUFBSSxFQUNKdUIsVUFBVSxFQUNWQyxVQUFVLEVBQ1ZDLElBQUksRUFDSjhILGNBQWMsRUFDZDtNQUNBckMscUJBQXFCLEdBQUc1RixvRkFBNEIsQ0FDbER0QixJQUFJLEVBQ0p1QixVQUFVLEVBQ1ZDLFVBQVUsRUFDVkMsSUFDRixDQUFDOztNQUVEO01BQ0F5RixxQkFBcUIsQ0FBQ3JFLGdCQUFnQixDQUFDLFNBQVMsRUFBRTNGLFNBQVMsQ0FBQ0UsR0FBRyxDQUFDO01BQ2hFOEoscUJBQXFCLENBQUNyRSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUzRixTQUFTLENBQUNJLFFBQVEsQ0FBQzs7TUFFdEU7TUFDQSxNQUFNb0UsV0FBVyxHQUFHd0YscUJBQXFCLENBQUNyRixzQkFBc0IsQ0FBQyxDQUFDO01BQ2xFLE1BQU0ySCxVQUFVLEdBQUdELGNBQWMsQ0FBQ0MsVUFBVTtNQUM1Q0QsY0FBYyxDQUFDRSxZQUFZLENBQUMvSCxXQUFXLEVBQUU4SCxVQUFVLENBQUM7TUFDcEQ7SUFDRjtFQUNGO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7O0FDcFFlLFNBQVNFLGNBQWNBLENBQUNDLFVBQVUsRUFBRTtFQUNqRCxNQUFNQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0VBQ25CLEtBQUssTUFBTUMsU0FBUyxJQUFJRixVQUFVLEVBQUU7SUFDbEMsTUFBTUcsR0FBRyxHQUFHQyxTQUFTLENBQUNGLFNBQVMsQ0FBQztJQUNoQ0QsUUFBUSxDQUFDRSxHQUFHLENBQUMsR0FBR0QsU0FBUztFQUMzQjtFQUNBLE9BQU9HLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDTCxRQUFRLENBQUM7QUFDaEM7QUFFQSxTQUFTRyxTQUFTQSxDQUFDRyxNQUFNLEVBQUU7RUFDekIsT0FBT0EsTUFBTSxDQUNWQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1ZwSyxHQUFHLENBQUMsQ0FBQ3FLLElBQUksRUFBRUMsS0FBSyxLQUFLO0lBQ3BCLE1BQU1DLGFBQWEsR0FBR0YsSUFBSSxDQUFDRyxXQUFXLENBQUMsQ0FBQztJQUN4QyxPQUFPRixLQUFLLElBQUksQ0FBQyxHQUNaLEdBQUVDLGFBQWEsQ0FBQ0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDQyxXQUFXLENBQUMsQ0FBRSxHQUFFSCxhQUFhLENBQUNJLEtBQUssQ0FBQyxDQUFDLENBQUUsRUFBQyxHQUNuRUosYUFBYTtFQUNuQixDQUFDLENBQUMsQ0FDREssSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNiOzs7Ozs7Ozs7Ozs7OztBQ25CQTtBQUNBLHdTQUF3Uyw0R0FBNEcsbUJBQW1CLGdkQUFnZCxrREFBa0QsaUNBQWlDLHdDQUF3QyxrREFBa0QsaUNBQWlDLHdDQUF3QyxrREFBa0QsaUNBQWlDLHdDQUF3QyxrREFBa0QsaUNBQWlDO0FBQzN6QztBQUNBLGlFQUFlLElBQUk7Ozs7Ozs7Ozs7O0FDSG5COzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBLGlFQUFlO0FBQ2Y7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ0hELGlFQUFlLGNBQWMsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsR0FBRyx5Q0FBeUM7Ozs7Ozs7Ozs7Ozs7O0FDQXBJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQnFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLHdEQUFRO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaENTO0FBQ047QUFDc0I7O0FBRWpEO0FBQ0EsTUFBTSxrREFBTTtBQUNaLFdBQVcsa0RBQU07QUFDakI7O0FBRUE7QUFDQSxpREFBaUQsK0NBQUcsS0FBSzs7QUFFekQ7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMsOERBQWU7QUFDeEI7O0FBRUEsaUVBQWUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0FDNUJjOztBQUUvQjtBQUNBLHFDQUFxQyxpREFBSztBQUMxQzs7QUFFQSxpRUFBZSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDTjs7QUFFN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMseUNBQXlDLElBQUk7QUFDOUU7QUFDQSx3QkFBd0IscURBQUk7QUFDNUI7QUFDQTtBQUNBLG9CQUFvQixxREFBSSxzREFBc0QscURBQUk7QUFDbEYsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixVQUFVLElBQUk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxxREFBSTtBQUNmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFMkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RjVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXFHOzs7Ozs7O1VDeExyRztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOc0I7QUFDbUI7QUFDVDtBQUVoQyxNQUFNRSxhQUFhLEdBQUd6RSwwREFBVSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2xpYnJhcnkvLi9zcmMvYm9va0ZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9ib29rTW9kZWwuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9jb21wb25lbnRzL2FkZEJvb2tNb2RhbC9hZGRCb29rTW9kYWwuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9jb21wb25lbnRzL2Jvb2tDYXJkL2Jvb2tDYXJkLmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29tcG9uZW50cy9yYXRpbmdTdGFycy9yYXRpbmdTdGFycy5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2NvbXBvbmVudHMvcmVhZGluZ1N0YXR1cy9yZWFkaW5nU3RhdHVzLmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9pbmRleC5odG1sIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29tcG9uZW50cy9hZGRCb29rTW9kYWwvYWRkQm9va01vZGFsLmNzcz82ZGEwIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29tcG9uZW50cy9ib29rQ2FyZC9ib29rQ2FyZC5jc3M/OTg2OCIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2NvbXBvbmVudHMvcmVhZGluZ1N0YXR1cy9yZWFkaW5nU3RhdHVzLmNzcz85YzExIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvc3R5bGVzLmNzcz8xNTUzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL25hdGl2ZS5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL2luZGV4LmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL3dyYXAtaWRiLXZhbHVlLmpzIiwid2VicGFjazovL2xpYnJhcnkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbGlicmFyeS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2xpYnJhcnkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJvb2tGYWN0b3J5KHRpdGxlLCBhdXRob3IsIHN0YXR1cywgcmF0aW5nKSB7XHJcbiAgcmV0dXJuIHsgdGl0bGUsIGF1dGhvciwgc3RhdHVzLCByYXRpbmcgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBvcGVuREIsIGRlbGV0ZURCLCB3cmFwLCB1bndyYXAgfSBmcm9tIFwiaWRiXCI7XHJcbmltcG9ydCBlbnVtRmFjdG9yeSBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBib29rTW9kZWxGYWN0b3J5KCkge1xyXG4gIGxldCBkYjtcclxuICBsZXQgYm9va3M7XHJcbiAgbGV0IHNlYXJjaEZpbHRlciA9IFwiXCI7XHJcbiAgbGV0IHJlYWRpbmdTdGF0dXNGaWx0ZXIgPSBbXTtcclxuICBjb25zdCBib29rU3RhdHVzID0gZW51bUZhY3RvcnkoW1wiUmVhZFwiLCBcIldhbnQgdG8gUmVhZFwiLCBcIkN1cnJlbnRseSBSZWFkaW5nXCJdKTtcclxuXHJcbiAgLyogV2h5IGRvZXMgdGhpcyBnaXZlIFwiaW52YWxpZCBpbnZvY2F0b3IgZXJyb3Igb24gLmFkZEV2ZW50TGlzdGVuZXIsIHdoYXRzIHRoZSBkaWZmZXJlbmNlIHRvIGNvbnN0cnVjdG9yIGZ1bmN0aW9uP1wiICovXHJcbiAgLyogICBsZXQgYm9va01vZGVsID0gT2JqZWN0LmNyZWF0ZShFdmVudFRhcmdldC5wcm90b3R5cGUpOyAqL1xyXG5cclxuICBjb25zdCBib29rTW9kZWwgPSBuZXcgRXZlbnRUYXJnZXQoKTtcclxuXHJcbiAgYm9va01vZGVsLmFkZCA9IF9hZGQ7XHJcbiAgYm9va01vZGVsLmVkaXRCb29rID0gX2VkaXRCb29rO1xyXG4gIGJvb2tNb2RlbC5nZXRCb29rcyA9IF9nZXRCb29rcztcclxuICBib29rTW9kZWwudXBkYXRlQm9va1JhdGluZyA9IF91cGRhdGVCb29rUmF0aW5nO1xyXG4gIGJvb2tNb2RlbC51cGRhdGVSZWFkaW5nU3RhdHVzID0gX3VwZGF0ZVJlYWRpbmdTdGF0dXM7XHJcbiAgYm9va01vZGVsLmdldEJvb2tSYXRpbmcgPSBfZ2V0Qm9va1JhdGluZztcclxuICBib29rTW9kZWwuZGVsZXRlQm9vayA9IF9kZWxldGVCb29rO1xyXG4gIGJvb2tNb2RlbC51cGRhdGVTZWFyY2ggPSBfdXBkYXRlU2VhcmNoO1xyXG4gIGJvb2tNb2RlbC5hZGRSZWFkaW5nU3RhdHVzRmlsdGVyID0gX2FkZFJlYWRpbmdTdGF0dXNGaWx0ZXI7XHJcbiAgYm9va01vZGVsLmRlbGV0ZVJlYWRpbmdTdGF0dXNGaWx0ZXIgPSBfZGVsZXRlUmVhZGluZ1N0YXR1c0ZpbHRlcjtcclxuXHJcbiAgYXdhaXQgaW5pdE1vZGVsKCk7XHJcblxyXG4gIHJldHVybiBib29rTW9kZWw7XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluaXRNb2RlbCgpIHtcclxuICAgIGJvb2tzID0gW107XHJcbiAgICBhd2FpdCBnZXRBbGxCb29rcygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0YWJhc2UoKSB7XHJcbiAgICByZXR1cm4gb3BlbkRCKFwiYm9va1N0b3JhZ2VcIiwgMSwgeyB1cGdyYWRlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBncmFkZShkYikge1xyXG4gICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFwiYm9va3NcIikpIHtcclxuICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoXCJib29rc1wiLCB7IGtleVBhdGg6IFwidXVpZFwiIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQm9va3MoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBkYiA9IGF3YWl0IGdldERhdGFiYXNlKCk7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW1wiYm9va3NcIl0sIFwicmVhZG9ubHlcIik7XHJcbiAgICAgIGNvbnN0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoXCJib29rc1wiKTtcclxuICAgICAgYm9va3MgPSBhd2FpdCBzdG9yZS5nZXRBbGwoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hZGQoYWRkQm9va0V2ZW50KSB7XHJcbiAgICBjb25zdCBib29rVG9BZGQgPSBhZGRCb29rRXZlbnQuZGV0YWlsO1xyXG4gICAgYm9va1RvQWRkLnV1aWQgPSB1dWlkdjQoKTtcclxuXHJcbiAgICBib29rcy5wdXNoKGJvb2tUb0FkZCk7XHJcbiAgICB0cnkge1xyXG4gICAgICB1cGRhdGUoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwic2NoYWlzaW5uXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2VkaXRCb29rKGVkaXRCb29rRXZlbnQpIHtcclxuICAgIGNvbnN0IGJvb2tUb0VkaXQgPSBlZGl0Qm9va0V2ZW50LmRldGFpbDtcclxuICAgIGJvb2tzID0gYm9va3MubWFwKChib29rKSA9PiB7XHJcbiAgICAgIGlmIChib29rLnV1aWQgPT0gYm9va1RvRWRpdC51dWlkKSByZXR1cm4gYm9va1RvRWRpdDtcclxuICAgICAgcmV0dXJuIGJvb2s7XHJcbiAgICB9KTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzY2hhaXNpbm5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdXBkYXRlQm9va1JhdGluZyhib29rVVVJRCwgbmV3UmF0aW5nKSB7XHJcbiAgICBib29rcyA9IGJvb2tzLm1hcCgoYm9vaykgPT4ge1xyXG4gICAgICBpZiAoYm9vay51dWlkICE9IGJvb2tVVUlEKSByZXR1cm4gYm9vaztcclxuXHJcbiAgICAgIGlmIChib29rLnJhdGluZyA9PSBuZXdSYXRpbmcpIHtcclxuICAgICAgICBib29rLnJhdGluZyA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYm9vay5yYXRpbmcgPSBuZXdSYXRpbmc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJvb2s7XHJcbiAgICB9KTtcclxuICAgIHVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2dldEJvb2tSYXRpbmcoYm9va1VVSUQpIHtcclxuICAgIHJldHVybiBib29rcy5maW5kKChib29rKSA9PiBib29rLnV1aWQgPT0gYm9va1VVSUQpLnJhdGluZztcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9kZWxldGVCb29rKGJvb2tVVUlEKSB7XHJcbiAgICBib29rcyA9IGJvb2tzLmZpbHRlcigoYm9vaykgPT4gYm9vay51dWlkICE9IGJvb2tVVUlEKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJib29rc1wiLCBcInJlYWR3cml0ZVwiKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcImJvb2tzXCIpO1xyXG4gICAgICBhd2FpdCBvYmplY3RTdG9yZS5kZWxldGUoYm9va1VVSUQpO1xyXG4gICAgICBib29rTW9kZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVcIikpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgYm9va01vZGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidXBkYXRlRmFpbHVyZVwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdXBkYXRlUmVhZGluZ1N0YXR1cyhib29rVVVJRCwgbmV3U3RhdHVzKSB7XHJcbiAgICBib29rcyA9IGJvb2tzLm1hcCgoYm9vaykgPT4ge1xyXG4gICAgICBpZiAoYm9vay51dWlkID09IGJvb2tVVUlEKSB7XHJcbiAgICAgICAgYm9vay5zdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJvb2s7XHJcbiAgICB9KTtcclxuICAgIHVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3VwZGF0ZVNlYXJjaChzZWFyY2hUZXJtKSB7XHJcbiAgICBzZWFyY2hGaWx0ZXIgPSBzZWFyY2hUZXJtLnRyaW0oKTtcclxuICAgIGJvb2tNb2RlbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInVwZGF0ZVwiKSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfYWRkUmVhZGluZ1N0YXR1c0ZpbHRlcihyZWFkaW5nU3RhdHVzRmlsdGVyVGVybSkge1xyXG4gICAgcmVhZGluZ1N0YXR1c0ZpbHRlci5wdXNoKHJlYWRpbmdTdGF0dXNGaWx0ZXJUZXJtKTtcclxuICAgIGJvb2tNb2RlbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInVwZGF0ZVwiKSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfZGVsZXRlUmVhZGluZ1N0YXR1c0ZpbHRlcihyZWFkaW5nU3RhdHVzRmlsdGVyVGVybSkge1xyXG4gICAgcmVhZGluZ1N0YXR1c0ZpbHRlciA9IHJlYWRpbmdTdGF0dXNGaWx0ZXIuZmlsdGVyKFxyXG4gICAgICAoZmlsdGVyKSA9PiBmaWx0ZXIgIT0gcmVhZGluZ1N0YXR1c0ZpbHRlclRlcm1cclxuICAgICk7XHJcbiAgICBib29rTW9kZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVcIikpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihcImJvb2tzXCIsIFwicmVhZHdyaXRlXCIpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcImJvb2tzXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGJvb2tzLmZvckVhY2goKGJvb2spID0+IHN0b3JlLnB1dChib29rKSk7XHJcbiAgICAgIGJvb2tNb2RlbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInVwZGF0ZVwiKSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBib29rTW9kZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVGYWlsdXJlXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBXaHkgZG9lcyB0aGlzIG5vdCB3b3JrPyAqL1xyXG4gICAgLyogICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGJsYSA9IGF3YWl0IFByb21pc2UuYWxsKGJvb2tzLm1hcCgoYm9vaykgPT4gc3RvcmUucHV0KGJvb2spKSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImJsYVwiKTtcclxuICAgIH0gKi9cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9nZXRCb29rcygpIHtcclxuICAgIGxldCBib29rc1RvUmV0dXJuID0gYm9va3M7XHJcblxyXG4gICAgaWYgKHNlYXJjaEZpbHRlciAhPSBcIlwiKSB7XHJcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKHNlYXJjaEZpbHRlciwgXCJpXCIpO1xyXG4gICAgICBib29rc1RvUmV0dXJuID0gYm9va3MuZmlsdGVyKChib29rKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBhdHRlcm4udGVzdChib29rLnRpdGxlKSB8fCBwYXR0ZXJuLnRlc3QoYm9vay5hdXRob3IpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVhZGluZ1N0YXR1c0ZpbHRlci5sZW5ndGggIT0gMCkge1xyXG4gICAgICBib29rc1RvUmV0dXJuID0gYm9va3NUb1JldHVybi5maWx0ZXIoKGJvb2spID0+IHtcclxuICAgICAgICByZXR1cm4gcmVhZGluZ1N0YXR1c0ZpbHRlci5pbmNsdWRlcyhib29rLnN0YXR1cyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvb2tzVG9SZXR1cm47XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBcIi4vYWRkQm9va01vZGFsLmNzc1wiO1xyXG5pbXBvcnQgcmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5IGZyb20gXCIuLi9yYXRpbmdTdGFycy9yYXRpbmdTdGFyc1wiO1xyXG5pbXBvcnQgYm9va0ZhY3RvcnkgZnJvbSBcIi4uLy4uL2Jvb2tGYWN0b3J5LmpzXCI7XHJcbmltcG9ydCByZWFkaW5nU3RhdHVzRmFjdG9yeSBmcm9tIFwiLi4vcmVhZGluZ1N0YXR1cy9yZWFkaW5nU3RhdHVzLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRCb29rTW9kYWxDb21wb25lbnRGYWN0b3J5KFxyXG4gIGJvb2ssXHJcbiAgZm9ybUhlYWRlcixcclxuICBidXR0b25UZXh0LFxyXG4gIG1vZGVcclxuKSB7XHJcbiAgbGV0IGZvcm1XcmFwcGVyO1xyXG4gIGxldCBjdXJyZW50UmF0aW5nO1xyXG5cclxuICBjb25zdCBib29rTW9kYWxDb21wb25lbnQgPSBuZXcgRXZlbnRUYXJnZXQoKTtcclxuICBib29rTW9kYWxDb21wb25lbnQuY3JlYXRlQm9va01vZGFsRE9NTm9kZSA9IGNyZWF0ZUJvb2tNb2RhbERPTU5vZGU7XHJcblxyXG4gIGNvbnN0IHJlYWRpbmdTdGF0dXNDb21wb25lbnQgPSByZWFkaW5nU3RhdHVzRmFjdG9yeSgpO1xyXG5cclxuICBjb25zdCByYXRpbmdTdGFyc0NvbXBvbmVudCA9IHJhdGluZ1N0YXJzQ29tcG9uZW50RmFjdG9yeShcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFxyXG4gICAgICBcIi0tY2xyLXNlY29uZGFyeS1hY2NlbnRcIlxyXG4gICAgKSxcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jbHItd2hpdGVcIilcclxuICApO1xyXG5cclxuICByZXR1cm4gYm9va01vZGFsQ29tcG9uZW50O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVCb29rTW9kYWxET01Ob2RlKCkge1xyXG4gICAgY3JlYXRlRm9ybVdyYXBwZXJOb2RlKCk7XHJcbiAgICBpbml0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHJldHVybiBmb3JtV3JhcHBlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUZvcm1XcmFwcGVyTm9kZSgpIHtcclxuICAgIGZvcm1XcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBmb3JtV3JhcHBlci5jbGFzc0xpc3QuYWRkKFxyXG4gICAgICBcImZvcm0td3JhcHBlclwiLFxyXG4gICAgICBcImluc2V0MFwiLFxyXG4gICAgICBcImdyaWRcIixcclxuICAgICAgXCJwaS1jZW50ZXJcIixcclxuICAgICAgXCJwb3MtZml4ZWRcIlxyXG4gICAgKTtcclxuXHJcbiAgICBmb3JtV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIHJldHVybkJvb2tNb2RhbEhUTUwoKSk7XHJcbiAgICBjdXJyZW50UmF0aW5nID0gYm9vay5yYXRpbmc7XHJcbiAgICByYXRpbmdTdGFyc0NvbXBvbmVudC5jb2xvcml6ZVJhdGluZ1N0YXJzKFxyXG4gICAgICBjdXJyZW50UmF0aW5nLFxyXG4gICAgICBmb3JtV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwicmF0aW5nXCJdJylcclxuICAgICk7XHJcbiAgICBmb3JtV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtZW50cmFuY2UtYW5pbWF0aW9uXCIpO1xyXG4gICAgZm9ybVdyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndyYXBwZXItZW50cmFuY2UtYW5pbWF0aW9uXCIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgaW5pdENvcnJlY3RCdXR0b25MaXN0ZW5lckFjY29yZGluZ1RvTW9kZSgpO1xyXG4gICAgZm9ybVdyYXBwZXJcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFkZC1ib29rPVwiY2xvc2VcIl0nKVxyXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUJvb2tNb2RhbCk7XHJcblxyXG4gICAgZm9ybVdyYXBwZXJcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zdGFyLW51bWJlcl1cIilcclxuICAgICAgLmZvckVhY2goKHN0YXIpID0+IHN0YXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoYW5nZVJhdGluZykpO1xyXG5cclxuICAgIGZvcm1XcmFwcGVyXHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmJvb2stc3RhdHVzXCIpXHJcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PlxyXG4gICAgICAgIHJlYWRpbmdTdGF0dXNDb21wb25lbnQub25Ecm9wRG93bkZvY3VzKGZvcm1XcmFwcGVyLGV2ZW50KVxyXG4gICAgICApO1xyXG5cclxuICAgIHJlYWRpbmdTdGF0dXNDb21wb25lbnQuaW5pdEV2ZW50TGlzdGVuZXJzKGZvcm1XcmFwcGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Q29ycmVjdEJ1dHRvbkxpc3RlbmVyQWNjb3JkaW5nVG9Nb2RlKCkge1xyXG4gICAgICBpZiAobW9kZSA9PSBcImVkaXRcIikge1xyXG4gICAgICAgIGZvcm1XcmFwcGVyXHJcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcignW2RhdGEtYWRkLWJvb2s9XCJlZGl0XCJdJylcclxuICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWRpdEJvb2spO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1XcmFwcGVyXHJcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcignW2RhdGEtYWRkLWJvb2s9XCJhZGRcIl0nKVxyXG4gICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRCb29rKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQm9vaygpIHtcclxuICAgIHJlbW92ZUJvb2tNb2RhbCgpO1xyXG4gICAgY29uc3QgYWRkQm9va0V2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiYWRkQm9va1wiLCB7XHJcbiAgICAgIGRldGFpbDogY3JlYXRlQm9va09iamVjdEZyb21Vc2VySW5wdXQoKSxcclxuICAgIH0pO1xyXG4gICAgYm9va01vZGFsQ29tcG9uZW50LmRpc3BhdGNoRXZlbnQoYWRkQm9va0V2ZW50KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVkaXRCb29rKCkge1xyXG4gICAgcmVtb3ZlQm9va01vZGFsKCk7XHJcbiAgICBjb25zdCBib29rVG9FZGl0ID0gY3JlYXRlQm9va09iamVjdEZyb21Vc2VySW5wdXQoKTtcclxuICAgIGJvb2tUb0VkaXQudXVpZCA9IGJvb2sudXVpZDtcclxuICAgIGNvbnN0IGVkaXRCb29rRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlZGl0Qm9va1wiLCB7XHJcbiAgICAgIGRldGFpbDogYm9va1RvRWRpdCxcclxuICAgIH0pO1xyXG4gICAgYm9va01vZGFsQ29tcG9uZW50LmRpc3BhdGNoRXZlbnQoZWRpdEJvb2tFdmVudCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVCb29rT2JqZWN0RnJvbVVzZXJJbnB1dCgpIHtcclxuICAgIHJldHVybiBib29rRmFjdG9yeShcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInRpdGxlXCJdJykudmFsdWUsXHJcbiAgICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJvb2s9XCJhdXRob3JcIl0nKS52YWx1ZSxcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInN0YXR1c1wiXScpLnRleHRDb250ZW50LFxyXG4gICAgICBjdXJyZW50UmF0aW5nXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlQm9va01vZGFsKGV2ZW50KSB7XHJcbiAgICBmb3JtV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid3JhcHBlci1jbG9zaW5nLWFuaW1hdGlvblwiKTtcclxuICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1jbG9zaW5nLWFuaW1hdGlvblwiKTtcclxuICAgIGZvcm1XcmFwcGVyXHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hZGQtYm9vaz1cImNsb3NlXCJdJylcclxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmVCb29rTW9kYWwpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGZvcm1XcmFwcGVyLnJlbW92ZSgpO1xyXG4gICAgfSwgNDAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoYW5nZVJhdGluZyhldmVudCkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoY3VycmVudFJhdGluZyA9PSBldmVudC50YXJnZXQuZGF0YXNldC5zdGFyTnVtYmVyKSB7XHJcbiAgICAgIGN1cnJlbnRSYXRpbmcgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudFJhdGluZyA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnN0YXJOdW1iZXI7XHJcbiAgICB9XHJcbiAgICByYXRpbmdTdGFyc0NvbXBvbmVudC5jb2xvcml6ZVJhdGluZ1N0YXJzKFxyXG4gICAgICBjdXJyZW50UmF0aW5nLFxyXG4gICAgICBmb3JtV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwicmF0aW5nXCJdJylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXR1cm5Cb29rTW9kYWxIVE1MKCkge1xyXG4gICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJhZGQtYm9vay1mb3JtIHBvcy1yZWxcIiBvbnN1Ym1pdD1cInJldHVybiBmYWxzZTtcIiBhY3Rpb249XCJcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS1hZGQtYm9vaz1cImNsb3NlXCIgY2xhc3M9XCJhZGQtYm9vay1mb3JtX19jbG9zZS1idXR0b24gcG9zLWFicyBjbHItd2hpdGVcIj5YPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8bGVnZW5kIGNsYXNzPVwiY2xyLXdoaXRlIG1yZ24tYm90dG9tLTcwMFwiPiR7Zm9ybUhlYWRlcn08L2xlZ2VuZD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8cD5Cb29rIFRpdGxlPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBkYXRhLWJvb2s9XCJ0aXRsZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCIke2Jvb2sudGl0bGV9XCI+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPkF1dGhvcjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgZGF0YS1ib29rPVwiYXV0aG9yXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7XHJcbiAgICAgICAgICAgICAgICAgICAgICBib29rLmF1dGhvclxyXG4gICAgICAgICAgICAgICAgICAgIH1cIj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+U3RhdHVzPC9wPlxyXG4gICAgICAgICAgICAgICAgJHtyZWFkaW5nU3RhdHVzQ29tcG9uZW50LnJldHVyblJlYWRpbmdTdGF0dXNIVE1MKGJvb2suc3RhdHVzKX1cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJyYXRpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5SYXRpbmc8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJvb2s9XCJyYXRpbmdcIiBjbGFzcz1cImZsZXggcmF0aW5nIGpjLXN0YXJ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtyYXRpbmdTdGFyc0NvbXBvbmVudC5yZXR1cm5SYXRpbmdTdGFyc0hUTUwoNSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWFkZC1ib29rPVwiJHttb2RlfVwiIGNsYXNzPVwiYWRkLWJvb2stZm9ybV9fYWRkLWJ1dHRvblwiPiR7YnV0dG9uVGV4dH08L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9mb3JtPlxyXG5gO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgXCIuL2Jvb2tDYXJkLmNzc1wiO1xyXG5pbXBvcnQgcmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5IGZyb20gXCIuLi9yYXRpbmdTdGFycy9yYXRpbmdTdGFycy5qc1wiO1xyXG5pbXBvcnQgcmVhZGluZ1N0YXR1c0Ryb3Bkb3duRmFjdG9yeSBmcm9tIFwiLi4vcmVhZGluZ1N0YXR1cy9yZWFkaW5nU3RhdHVzLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBib29rQ2FyZEZhY3RvcnkoKSB7XHJcbiAgY29uc3QgYm9va0NhcmRDb21wb25lbnQgPSBuZXcgRXZlbnRUYXJnZXQoKTtcclxuICBib29rQ2FyZENvbXBvbmVudC5jcmVhdGVCb29rQ2FyZCA9IF9jcmVhdGVCb29rQ2FyZDtcclxuICBib29rQ2FyZENvbXBvbmVudC5vbkRyb3BEb3duRm9jdXMgPSBfb25Ecm9wRG93bkZvY3VzO1xyXG4gIGJvb2tDYXJkQ29tcG9uZW50Lm9uRHJvcERvd25CbHVyID0gX29uRHJvcERvd25CbHVyO1xyXG5cclxuICBjb25zdCByYXRpbmdTdGFyc0NvbXBvbmVudCA9IHJhdGluZ1N0YXJzQ29tcG9uZW50RmFjdG9yeShcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFxyXG4gICAgICBcIi0tY2xyLXNlY29uZGFyeS1hY2NlbnRcIlxyXG4gICAgKSxcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFxyXG4gICAgICBcIi0tY2xyLW1haW4tYWNjZW50XCJcclxuICAgIClcclxuICApO1xyXG5cclxuICBjb25zdCByZWFkaW5nU3RhdHVzRHJvcGRvd24gPSByZWFkaW5nU3RhdHVzRHJvcGRvd25GYWN0b3J5KCk7XHJcblxyXG4gIHJldHVybiBib29rQ2FyZENvbXBvbmVudDtcclxuXHJcbiAgZnVuY3Rpb24gX2NyZWF0ZUJvb2tDYXJkKGJvb2tPYmplY3QpIHtcclxuICAgIGNvbnN0IGJvb2tDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgYm9va0NhcmQuY2xhc3NMaXN0LmFkZChcclxuICAgICAgXCJib29rXCIsXHJcbiAgICAgIFwicG9zLXJlbFwiLFxyXG4gICAgICBcImZsZXhcIixcclxuICAgICAgXCJhaS1zdGFydFwiLFxyXG4gICAgICBcInBiLWJvdHRvbS03MDBcIixcclxuICAgICAgXCJtcmduLWJvdHRvbS03MDBcIlxyXG4gICAgKTtcclxuICAgIGJvb2tDYXJkLnNldEF0dHJpYnV0ZShcImRhdGEtYm9vay11dWlkXCIsIGJvb2tPYmplY3QudXVpZCk7XHJcbiAgICBib29rQ2FyZC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIHJldHVybkJvb2tDYXJkSFRNTCgpKTtcclxuICAgIGJvb2tDYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJvb2s9XCJ0aXRsZVwiXScpLnRleHRDb250ZW50ID1cclxuICAgICAgYm9va09iamVjdC50aXRsZTtcclxuICAgIGJvb2tDYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJvb2s9XCJhdXRob3JcIl0nKS50ZXh0Q29udGVudCA9XHJcbiAgICAgIGJvb2tPYmplY3QuYXV0aG9yO1xyXG4gICAgYm9va0NhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInN0YXR1c1wiXScpLnRleHRDb250ZW50ID1cclxuICAgICAgYm9va09iamVjdC5zdGF0dXM7XHJcbiAgICByZWFkaW5nU3RhdHVzRHJvcGRvd24uaW5pdEV2ZW50TGlzdGVuZXJzKGJvb2tDYXJkKTtcclxuICAgIHJlYWRpbmdTdGF0dXNEcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKFwic3RhdHVzdXBkYXRlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICBib29rQ2FyZENvbXBvbmVudC5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcInN0YXR1c3VwZGF0ZVwiLCB7IGRldGFpbDogZXZlbnQuZGV0YWlsIH0pXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGJvb2tDYXJkLnF1ZXJ5U2VsZWN0b3IoXCIuYm9vay1zdGF0dXNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIF9vbkRyb3BEb3duQmx1cihldmVudCwgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuYm9va1wiKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByYXRpbmdTdGFyc0NvbXBvbmVudC5jb2xvcml6ZVJhdGluZ1N0YXJzKGJvb2tPYmplY3QucmF0aW5nLCBib29rQ2FyZCk7XHJcbiAgICByZXR1cm4gYm9va0NhcmQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb25Ecm9wRG93bkZvY3VzKGJvb2tMaXN0SXRlbSkge1xyXG4gICAgcmVhZGluZ1N0YXR1c0Ryb3Bkb3duLm9uRHJvcERvd25Gb2N1cyhib29rTGlzdEl0ZW0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29uRHJvcERvd25CbHVyKGV2ZW50LCBib29rTGlzdEl0ZW0pIHtcclxuICAgIHJlYWRpbmdTdGF0dXNEcm9wZG93bi5vbkRyb3BEb3duQmx1cihldmVudCwgYm9va0xpc3RJdGVtKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJldHVybkJvb2tDYXJkSFRNTCgpIHtcclxuICAgIHJldHVybiBgPGltZyBkYXRhLWJvb2s9XCJpbWFnZVwiIHNyYz1cIlwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3aWR0aC0xMDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzcz1cImZsZXggYWktY2VudGVyIGpjLXNiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgZGF0YS1ib29rPVwidGl0bGVcIiBjbGFzcz1cImZzLWJvb2stdGl0bGVcIj48L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggYm9va19faWNvbi1ncm91cFwiID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGRhdGEtYm9vaz1cImVkaXRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMjJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAtOTYwIDk2MCA5NjBcIiB3aWR0aD1cIjIyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkPVwiTTE4MC0xODBoNDRsNDQzLTQ0My00NC00NC00NDMgNDQzdjQ0Wm02MTQtNDg2TDY2Ni03OTRsNDItNDJxMTctMTcgNDItMTd0NDIgMTdsNDQgNDRxMTcgMTcgMTcgNDJ0LTE3IDQybC00MiA0MlptLTQyIDQyTDI0OC0xMjBIMTIwdi0xMjhsNTA0LTUwNCAxMjggMTI4Wm0tMTA3LTIxLTIyLTIyIDQ0IDQ0LTIyLTIyWlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgZGF0YS1ib29rPVwiZGVsZXRlXCIgd2lkdGg9XCIyMnB4XCIgaGVpZ2h0PVwiMjJweFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMCAxMlYxN1wiIHN0cm9rZT1cIiMwMDAwMDBcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNCAxMlYxN1wiIHN0cm9rZT1cIiMwMDAwMDBcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00IDdIMjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNiAxMFYxOEM2IDE5LjY1NjkgNy4zNDMxNSAyMSA5IDIxSDE1QzE2LjY1NjkgMjEgMTggMTkuNjU2OSAxOCAxOFYxMFwiIHN0cm9rZT1cIiMwMDAwMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk05IDVDOSAzLjg5NTQzIDkuODk1NDMgMyAxMSAzSDEzQzE0LjEwNDYgMyAxNSAzLjg5NTQzIDE1IDVWN0g5VjVaXCIgc3Ryb2tlPVwiIzAwMDAwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGRhdGEtYm9vaz1cImF1dGhvclwiIGNsYXNzPVwiZnMtYm9vay1hdXRob3IgbXJnbi1ib3R0b20tNTAwXCI+PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHtyZWFkaW5nU3RhdHVzRHJvcGRvd24ucmV0dXJuUmVhZGluZ1N0YXR1c0hUTUwoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPllvdXIgcmF0aW5nPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggcmF0aW5nIGFpLXN0YXJ0IGpjLXN0YXJ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3JhdGluZ1N0YXJzQ29tcG9uZW50LnJldHVyblJhdGluZ1N0YXJzSFRNTCg1KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuYDtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5KHN0YXJGaWxsLCBzdGFyU3Ryb2tlKSB7XHJcbiAgZnVuY3Rpb24gcmV0dXJuUmF0aW5nU3RhcnNIVE1MKG51bWJlck9mU3RhcnMpIHtcclxuICAgIGxldCByYXRpbmdTdHJpbmcgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IG51bWJlck9mU3RhcnM7IGkgPj0gMTsgaS0tKSB7XHJcbiAgICAgIHJhdGluZ1N0cmluZyArPSBgPHN2ZyBkYXRhLXN0YXItbnVtYmVyPSR7aX0gd2lkdGg9XCIxN3B4XCIgaGVpZ2h0PVwiMTdweFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNC42NSA4LjkzMjc0TDEyLjQ4NTIgNC4zMDkwMUMxMi4yOTIzIDMuODk2OTkgMTEuNzA3NyAzLjg5NyAxMS41MTQ4IDQuMzA5MDJMOS4zNTAwMiA4LjkzMjc0TDQuNDU1NTkgOS42ODI0M0M0LjAyNDM1IDkuNzQ4NDggMy44NDgyNyAxMC4yNzU4IDQuMTUyOTIgMTAuNTg4OEw3LjcxMjI1IDE0LjI0NjFMNi44Nzc3NCAxOS4zNzQ5QzYuODA1NzEgMTkuODE3NiA3LjI3NDQ1IDIwLjE0ODcgNy42NjYwMSAxOS45MzE3TDEyIDE3LjUyOTlMMTYuMzM0IDE5LjkzMTdDMTYuNzI1NiAyMC4xNDg3IDE3LjE5NDMgMTkuODE3NiAxNy4xMjIzIDE5LjM3NDlMMTYuMjg3OCAxNC4yNDYxTDE5Ljg0NzEgMTAuNTg4OEMyMC4xNTE3IDEwLjI3NTggMTkuOTc1NiA5Ljc0ODQ4IDE5LjU0NDQgOS42ODI0M0wxNC42NSA4LjkzMjc0WlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9IFwiaHNsKCR7c3RhclN0cm9rZX0pXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICA8L3N2Zz5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZ1N0cmluZztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNvbG9yaXplUmF0aW5nU3RhcnMocmF0aW5nLCBvYmplY3RUaGF0c1JhdGVkKSB7XHJcbiAgICBkZWNvbG9yQWxsU3RhcnMoKTsgLy9hbHdheXMgcmVzZXQgYWxsIFN0YXJzIGJlZm9yZSByZWNvbG9yaXppbmcgYWNjb3JkaW5nIHRvIG5ldyByYXRpbmdcclxuXHJcbiAgICBpZiAoIXJhdGluZykgcmV0dXJuO1xyXG4gICAgY29uc3QgbWF4Q29sb3JpemVkU3RhciA9IG9iamVjdFRoYXRzUmF0ZWQucXVlcnlTZWxlY3RvcihcclxuICAgICAgYFtkYXRhLXN0YXItbnVtYmVyPVwiJHtyYXRpbmd9XCJdYFxyXG4gICAgKTtcclxuXHJcbiAgICBtYXhDb2xvcml6ZWRTdGFyLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgYGhzbCgke3N0YXJGaWxsfSlgKTtcclxuICAgIG1heENvbG9yaXplZFN0YXIuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIGBoc2woJHtzdGFyU3Ryb2tlfSlgKTtcclxuICAgIGxldCBuZXh0U2libGluZyA9IG1heENvbG9yaXplZFN0YXIubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgd2hpbGUgKG5leHRTaWJsaW5nKSB7XHJcbiAgICAgIG5leHRTaWJsaW5nLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgYGhzbCgke3N0YXJGaWxsfSlgKTtcclxuICAgICAgbmV4dFNpYmxpbmcuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIGBoc2woJHtzdGFyU3Ryb2tlfSlgKTtcclxuICAgICAgbmV4dFNpYmxpbmcgPSBuZXh0U2libGluZy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVjb2xvckFsbFN0YXJzKCkge1xyXG4gICAgICBvYmplY3RUaGF0c1JhdGVkXHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zdGFyLW51bWJlcl1cIilcclxuICAgICAgICAuZm9yRWFjaCgoc3RhcikgPT4gc3Rhci5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB7IHJldHVyblJhdGluZ1N0YXJzSFRNTCwgY29sb3JpemVSYXRpbmdTdGFycyB9O1xyXG59XHJcbiIsImltcG9ydCBcIi4vcmVhZGluZ1N0YXR1cy5jc3NcIjtcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVhZGluZ1N0YXR1c0NvbXBvbmVudEZhY3RvcnkoKSB7XHJcbiAgY29uc3QgcmVhZGluZ1N0YXR1c0NvbXBvbmVudCA9IG5ldyBFdmVudFRhcmdldCgpO1xyXG4gIHJlYWRpbmdTdGF0dXNDb21wb25lbnQucmV0dXJuUmVhZGluZ1N0YXR1c0hUTUwgPSBfcmV0dXJuUmVhZGluZ1N0YXR1c0hUTUw7XHJcbiAgcmVhZGluZ1N0YXR1c0NvbXBvbmVudC5pbml0RXZlbnRMaXN0ZW5lcnMgPSBfaW5pdEV2ZW50TGlzdGVuZXJzO1xyXG4gIHJlYWRpbmdTdGF0dXNDb21wb25lbnQub25Ecm9wRG93bkZvY3VzID0gX29uRHJvcERvd25Gb2N1cztcclxuICByZWFkaW5nU3RhdHVzQ29tcG9uZW50Lm9uRHJvcERvd25CbHVyID0gX29uRHJvcERvd25CbHVyO1xyXG4gIHJldHVybiByZWFkaW5nU3RhdHVzQ29tcG9uZW50O1xyXG5cclxuICBmdW5jdGlvbiBfaW5pdEV2ZW50TGlzdGVuZXJzKGNvbnRhaW5lck9iamVjdCkge1xyXG4gICAgY29udGFpbmVyT2JqZWN0XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtYm9vaz0nc3RhdHVzLW9wdGlvbnMnXVwiKVxyXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBvblN0YXR1c0Nob2ljZShjb250YWluZXJPYmplY3QsIGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29uRHJvcERvd25Gb2N1cyhwYXJlbnROb2RlLCBldmVudCkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoXHJcbiAgICAgIHBhcmVudE5vZGVcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIlthcmlhLWV4cGFuZGVkXVwiKVxyXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IFwidHJ1ZVwiXHJcbiAgICApIHtcclxuICAgICAgcGFyZW50Tm9kZVxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2FyaWEtZXhwYW5kZWRdXCIpXHJcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhcmVudE5vZGVcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIlthcmlhLWV4cGFuZGVkXVwiKVxyXG4gICAgICAgIC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vbkRyb3BEb3duQmx1cihldmVudCwgcGFyZW50Tm9kZSkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoJ1tkYXRhLWJvb2s9XCJzdGF0dXMtb3B0aW9uXCJdJykpIHtcclxuICAgICAgcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwic3RhdHVzLW9wdGlvblwiXScpLnRleHRDb250ZW50ID1cclxuICAgICAgICBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICBwYXJlbnROb2RlXHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2FyaWEtZXhwYW5kZWRdXCIpXHJcbiAgICAgIC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblN0YXR1c0Nob2ljZShwYXJlbnROb2RlLCB0YXJnZXQpIHtcclxuICAgIHBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInN0YXR1c1wiXScpLnRleHRDb250ZW50ID1cclxuICAgICAgdGFyZ2V0LnRleHRDb250ZW50O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JldHVyblJlYWRpbmdTdGF0dXNIVE1MKHJlYWRpbmdTdGF0dXNUZXh0Q29udGVudCkge1xyXG4gICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwicmVhZGluZy1zdGF0dXMgcG9zLXJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBhcmlhLWxhYmVsPVwiY29sbGFwc2UtYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1jb250cm9scz1cInJlYWRpbmctc3RhdHVzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImJnLWNvbG9yLW1haW4gYm9vay1zdGF0dXMgbXJnbi1ib3R0b20tMjAwIGZsZXggYWktY2VudGVyIGpjLXNiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1ib29rPVwic3RhdHVzXCI+JHtyZWFkaW5nU3RhdHVzVGV4dENvbnRlbnR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCIjMDAwMDAwXCIgd2lkdGg9XCIyMnB4XCIgaGVpZ2h0PVwiMjJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEwbDUgNSA1LTV6XCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgZGF0YS1ib29rPVwic3RhdHVzLW9wdGlvbnNcIiBjbGFzcz1cInJlYWRpbmctc3RhdHVzX19saXN0Ym94ICBwb3MtcmVsIGJnLWNvbG9yLW1haW4tdGhpblwiIGlkPVwicmVhZGluZy1zdGF0dXNcIiByb2xlPVwibGlzdGJveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlJlYWRpbmcgc3RhdHVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYm9vaz1cInN0YXR1cy1vcHRpb25cIiBjbGFzcz1cImNsci13aGl0ZVwiIHJvbGU9XCJvcHRpb25cIj5SZWFkPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1ib29rPVwic3RhdHVzLW9wdGlvblwiIGNsYXNzPVwiY2xyLXdoaXRlXCIgcm9sZT1cIm9wdGlvblwiPldhbnQgdG8gUmVhZDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYm9vaz1cInN0YXR1cy1vcHRpb25cIiBjbGFzcz1cImNsci13aGl0ZVwiIHJvbGU9XCJvcHRpb25cIj5DdXJyZW50bHkgUmVhZGluZzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgYm9va01vZGVsRmFjdG9yeSBmcm9tIFwiLi9ib29rTW9kZWwuanNcIjtcclxuaW1wb3J0IGFkZEJvb2tNb2RhbENvbXBvbmVudEZhY3RvcnkgZnJvbSBcIi4vY29tcG9uZW50cy9hZGRCb29rTW9kYWwvYWRkQm9va01vZGFsLmpzXCI7XHJcbmltcG9ydCBib29rQ2FyZENvbXBvbmVudEZhY3RvcnkgZnJvbSBcIi4vY29tcG9uZW50cy9ib29rQ2FyZC9ib29rQ2FyZC5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwRmFjdG9yeSgpIHtcclxuICAvKiBGdW5jdGlvbiBtZW1iZXIgYXR0cmlidXRlcyAqL1xyXG4gIGxldCBib29rTW9kZWw7XHJcbiAgY29uc3QgYm9va0NhcmRDb21wb25lbnQgPSBib29rQ2FyZENvbXBvbmVudEZhY3RvcnkoKTtcclxuXHJcbiAgY29uc3QgQXBwID0ge1xyXG4gICAgJDoge1xyXG4gICAgICByYXRpbmdTdGFyczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXN0YXItbnVtYmVyXVwiKSxcclxuICAgICAgYm9va0xpc3Q6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9va3NcIiksXHJcbiAgICAgIGFkZEJvb2s6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWdsb2JhbC1hY3Rpb249XCJhZGRcIl0nKSxcclxuICAgICAgd3JhcHBlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZ2xvYmFsPVwid3JhcHBlclwiXScpLFxyXG4gICAgICBzZWFyY2hCYXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdC1zZWFyY2hfX2lucHV0XCIpLFxyXG4gICAgICBmaWx0ZXJDb250YWluZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyLWNvbnRhaW5lclwiKSxcclxuICAgICAgZmlsdGVyQnV0dG9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHA9XCJmaWx0ZXItYnV0dG9uXCJdJyksXHJcbiAgICAgIGZpbHRlclNlY3Rpb246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcD1cImZpbHRlci1vcHRpb25zXCJdJyksXHJcbiAgICAgIGZpbHRlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl0gaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKSxcclxuICAgICAgZmlsdGVyQ2FyZHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyLWNhcmRzXCIpLFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBpbml0QXBwKCk7XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluaXRBcHAoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBib29rTW9kZWwgPSBhd2FpdCBib29rTW9kZWxGYWN0b3J5KCk7XHJcbiAgICAgIGZ1bGxSZW5kZXJWaWV3KCk7XHJcbiAgICAgIGluaXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmdWxsUmVuZGVyVmlldygpIHtcclxuICAgIEFwcC4kLmJvb2tMaXN0LnJlcGxhY2VDaGlsZHJlbihcclxuICAgICAgLi4uYm9va01vZGVsXHJcbiAgICAgICAgLmdldEJvb2tzKClcclxuICAgICAgICAubWFwKChib29rT2JqZWN0KSA9PiBib29rQ2FyZENvbXBvbmVudC5jcmVhdGVCb29rQ2FyZChib29rT2JqZWN0KSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0RXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBsZXQgYWRkQm9va01vZGFsQ29tcG9uZW50O1xyXG5cclxuICAgIGluaXRHbG9iYWxFdmVudHMoKTtcclxuICAgIGluaXRCb29rU3RvcmFnZUV2ZW50cygpO1xyXG4gICAgaW5pdEJvb2tDYXJkRXZlbnRzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEdsb2JhbEV2ZW50cygpIHtcclxuICAgICAgQXBwLiQuYWRkQm9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICBjcmVhdGVCb29rTW9kYWxWaWV3KFxyXG4gICAgICAgICAgeyB0aXRsZTogXCJcIiwgYXV0aG9yOiBcIlwiLCBzdGF0dXM6IFwiXCIsIHJhdGluZzogXCJcIiB9LFxyXG4gICAgICAgICAgXCJBZGQgYSBuZXcgYm9vayB0byB5b3VyIGxpc3RcIixcclxuICAgICAgICAgIFwiQWRkIGJvb2tcIixcclxuICAgICAgICAgIFwiYWRkXCIsXHJcbiAgICAgICAgICBBcHAuJC53cmFwcGVyXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgZGVib3VuY2VkU2VhcmNoSW5MaXN0ID0gZGVib3VuY2UoXHJcbiAgICAgICAgKHNlYXJjaFRlcm0pID0+IGJvb2tNb2RlbC51cGRhdGVTZWFyY2goc2VhcmNoVGVybSksXHJcbiAgICAgICAgNDAwXHJcbiAgICAgICk7XHJcbiAgICAgIEFwcC4kLnNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PlxyXG4gICAgICAgIGRlYm91bmNlZFNlYXJjaEluTGlzdChldmVudC50YXJnZXQudmFsdWUpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBkZWJvdW5jZShjYiwgZGVsYXkpIHtcclxuICAgICAgICBsZXQgdGltZW91dDtcclxuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICdbZGF0YS1hcHA9XCJzZWFyY2gtaW4tbGlzdC1sb2FkZXJcIl0nXHJcbiAgICAgICAgICApLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNiKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICdbZGF0YS1hcHA9XCJzZWFyY2gtaW4tbGlzdC1sb2FkZXJcIl0nXHJcbiAgICAgICAgICAgICkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIEFwcC4kLmZpbHRlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb3BlbkZpbHRlclNlY3Rpb24pO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VGaWx0ZXJTZWN0aW9uQmx1cik7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjbG9zZUZpbHRlclNlY3Rpb25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgIWV2ZW50LnRhcmdldC5jbG9zZXN0KFwiLmZpbHRlci1jb250YWluZXJcIikgJiZcclxuICAgICAgICAgIEFwcC4kLmZpbHRlckJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IFwidHJ1ZVwiXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBBcHAuJC5maWx0ZXJTZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgIEFwcC4kLmZpbHRlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvcGVuRmlsdGVyU2VjdGlvbihldmVudCkge1xyXG4gICAgICAgIGlmIChBcHAuJC5maWx0ZXJCdXR0b24uZ2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKSA9PSBcInRydWVcIikge1xyXG4gICAgICAgICAgQXBwLiQuZmlsdGVyQnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcclxuICAgICAgICAgIEFwcC4kLmZpbHRlclNlY3Rpb24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBBcHAuJC5maWx0ZXJCdXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XHJcbiAgICAgICAgICBBcHAuJC5maWx0ZXJTZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBBcHAuJC5maWx0ZXIuZm9yRWFjaCgoZmlsdGVyKSA9PlxyXG4gICAgICAgIGZpbHRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25GaWx0ZXJDbGljay5iaW5kKGZpbHRlcikpXHJcbiAgICAgICk7XHJcbiAgICAgIGZ1bmN0aW9uIG9uRmlsdGVyQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBmaWx0ZXJUZXJtID1cclxuICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZmlsdGVyLW5hbWVdXCIpLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgYm9va01vZGVsLmFkZFJlYWRpbmdTdGF0dXNGaWx0ZXIoZmlsdGVyVGVybSk7XHJcbiAgICAgICAgICBhZGRGaWx0ZXJDYXJkKGZpbHRlclRlcm0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBib29rTW9kZWwuZGVsZXRlUmVhZGluZ1N0YXR1c0ZpbHRlcihmaWx0ZXJUZXJtKTtcclxuICAgICAgICAgIHJlbW92ZUZpbHRlckNhcmQoZmlsdGVyVGVybSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRGaWx0ZXJDYXJkKCkge1xyXG4gICAgICAgICAgQXBwLiQuZmlsdGVyQ2FyZHMuYXBwZW5kKHJldHVybkZpbHRlckNhcmROb2RlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVGaWx0ZXJDYXJkKCkge1xyXG4gICAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoYFtyZWFkaW5nLXN0YXR1cy1maWx0ZXI9XCIke2ZpbHRlclRlcm19XCJdYClcclxuICAgICAgICAgICAgLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmV0dXJuRmlsdGVyQ2FyZE5vZGUoKSB7XHJcbiAgICAgICAgICBjb25zdCBmaWx0ZXJDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGZpbHRlckNhcmQuc2V0QXR0cmlidXRlKFwicmVhZGluZy1zdGF0dXMtZmlsdGVyXCIsIGAke2ZpbHRlclRlcm19YCk7XHJcbiAgICAgICAgICBmaWx0ZXJDYXJkLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgICAgIFwiZmxleFwiLFxyXG4gICAgICAgICAgICBcImFpLWl0ZW1zLWNlbnRlclwiLFxyXG4gICAgICAgICAgICBcImpjLWNlbnRlclwiLFxyXG4gICAgICAgICAgICBcImZzLWZpbHRlci1jYXJkXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBjb25zdCBCYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgIEJidXR0b24udGV4dENvbnRlbnQgPSBgJHtmaWx0ZXJUZXJtfSAgICAgICAgeGA7XHJcbiAgICAgICAgICBmaWx0ZXJDYXJkLmFwcGVuZChCYnV0dG9uKTtcclxuICAgICAgICAgIHJldHVybiBmaWx0ZXJDYXJkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgQXBwLiQuZmlsdGVyQ2FyZHMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2xvc2VzdChcIltyZWFkaW5nLXN0YXR1cy1maWx0ZXJdXCIpKSB7XHJcbiAgICAgICAgICBjb25zdCBmaWx0ZXJDYXJkID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCJbcmVhZGluZy1zdGF0dXMtZmlsdGVyXVwiKTtcclxuICAgICAgICAgIGNvbnN0IGZpbHRlclRlcm0gPSBgJHtmaWx0ZXJDYXJkLmdldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgXCJyZWFkaW5nLXN0YXR1cy1maWx0ZXJcIlxyXG4gICAgICAgICAgKX1gO1xyXG4gICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICBgW3JlYWRpbmctc3RhdHVzLWZpbHRlcj1cIiR7ZmlsdGVyVGVybX1cIl1gXHJcbiAgICAgICAgICApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgY29uc3QgZmlsdGVyT3B0aW9uID0gQXBwLiQuZmlsdGVyU2VjdGlvbi5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICBgW2RhdGEtZmlsdGVyPVwiJHtmaWx0ZXJDYXJkLmdldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgICBcInJlYWRpbmctc3RhdHVzLWZpbHRlclwiXHJcbiAgICAgICAgICAgICl9XCJdIGlucHV0YFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGZpbHRlck9wdGlvbi5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICBib29rTW9kZWwuZGVsZXRlUmVhZGluZ1N0YXR1c0ZpbHRlcihmaWx0ZXJUZXJtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRCb29rU3RvcmFnZUV2ZW50cygpIHtcclxuICAgICAgLyogV2hlbiBzdG9yYWdlIGhhcyBiZWVuIGNoYW5nZWQgLT4gcmVyZW5kZXIgVmlldyAqL1xyXG4gICAgICBib29rTW9kZWwuYWRkRXZlbnRMaXN0ZW5lcihcInVwZGF0ZVwiLCBmdWxsUmVuZGVyVmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEJvb2tDYXJkRXZlbnRzKCkge1xyXG4gICAgICBib29rQ2FyZENvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKFwic3RhdHVzdXBkYXRlXCIsIChldmVudCkgPT5cclxuICAgICAgICBib29rTW9kZWwudXBkYXRlUmVhZGluZ1N0YXR1cyhldmVudC5kZXRhaWwudXVpZCwgZXZlbnQuZGV0YWlsLm5ld1N0YXR1cylcclxuICAgICAgKTtcclxuICAgICAgYWRkQm9va0NhcmRFdmVudChcImNsaWNrXCIsIFwiW2RhdGEtc3Rhci1udW1iZXJdXCIsIChib29rTGlzdEl0ZW0sIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3UmF0aW5nID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuc3Rhck51bWJlcjtcclxuICAgICAgICBjb25zdCBib29rSUQgPSBib29rTGlzdEl0ZW0uZGF0YXNldC5ib29rVXVpZDtcclxuICAgICAgICBib29rTW9kZWwudXBkYXRlQm9va1JhdGluZyhib29rSUQsIG5ld1JhdGluZyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYWRkQm9va0NhcmRFdmVudChcclxuICAgICAgICBcImNsaWNrXCIsXHJcbiAgICAgICAgJ1tkYXRhLWJvb2s9XCJkZWxldGVcIl0nLFxyXG4gICAgICAgIChib29rTGlzdEl0ZW0sIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBib29rVVVJRCA9IGJvb2tMaXN0SXRlbS5kYXRhc2V0LmJvb2tVdWlkO1xyXG4gICAgICAgICAgYm9va01vZGVsLmRlbGV0ZUJvb2soYm9va1VVSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIGFkZEJvb2tDYXJkRXZlbnQoXCJjbGlja1wiLCAnW2RhdGEtYm9vaz1cImVkaXRcIl0nLCAoYm9va0xpc3RJdGVtLCBldmVudCkgPT4ge1xyXG4gICAgICAgIGNyZWF0ZUJvb2tNb2RhbFZpZXcoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHV1aWQ6IGJvb2tMaXN0SXRlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJvb2stdXVpZFwiKSxcclxuICAgICAgICAgICAgdGl0bGU6IGJvb2tMaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwidGl0bGVcIl0nKVxyXG4gICAgICAgICAgICAgIC50ZXh0Q29udGVudCxcclxuICAgICAgICAgICAgYXV0aG9yOiBib29rTGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cImF1dGhvclwiXScpXHJcbiAgICAgICAgICAgICAgLnRleHRDb250ZW50LFxyXG4gICAgICAgICAgICBzdGF0dXM6IGJvb2tMaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwic3RhdHVzXCJdJylcclxuICAgICAgICAgICAgICAudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgIHJhdGluZzogYm9va01vZGVsLmdldEJvb2tSYXRpbmcoYm9va0xpc3RJdGVtLmRhdGFzZXQuYm9va1V1aWQpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiRWRpdCB0aGlzIGJvb2tcIixcclxuICAgICAgICAgIFwiQ29uZmlybSBFZGl0XCIsXHJcbiAgICAgICAgICBcImVkaXRcIixcclxuICAgICAgICAgIGJvb2tMaXN0SXRlbVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYWRkQm9va0NhcmRFdmVudChcclxuICAgICAgICBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgICdbZGF0YS1ib29rPVwic3RhdHVzLW9wdGlvblwiXScsXHJcbiAgICAgICAgKGJvb2tMaXN0SXRlbSwgZXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGJvb2tVVUlEID0gYm9va0xpc3RJdGVtLmRhdGFzZXQuYm9va1V1aWQ7XHJcbiAgICAgICAgICBib29rTW9kZWwudXBkYXRlUmVhZGluZ1N0YXR1cyhib29rVVVJRCwgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBhZGRCb29rQ2FyZEV2ZW50KFxyXG4gICAgICAgIFwiY2xpY2tcIixcclxuICAgICAgICAnW2FyaWEtbGFiZWw9XCJjb2xsYXBzZS1idXR0b25cIl0nLFxyXG4gICAgICAgIChib29rTGlzdEl0ZW0sIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBib29rQ2FyZENvbXBvbmVudC5vbkRyb3BEb3duRm9jdXMoYm9va0xpc3RJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBhZGRCb29rQ2FyZEV2ZW50KGV2ZW50TmFtZSwgc2VsZWN0b3IsIGhhbmRsZXIpIHtcclxuICAgICAgICBBcHAuJC5ib29rTGlzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuYm9va1wiKSwgZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9va01vZGFsVmlldyhcclxuICAgICAgYm9vayxcclxuICAgICAgZm9ybUhlYWRlcixcclxuICAgICAgYnV0dG9uVGV4dCxcclxuICAgICAgbW9kZSxcclxuICAgICAgbm9kZVRvQXBwZW5kVG9cclxuICAgICkge1xyXG4gICAgICBhZGRCb29rTW9kYWxDb21wb25lbnQgPSBhZGRCb29rTW9kYWxDb21wb25lbnRGYWN0b3J5KFxyXG4gICAgICAgIGJvb2ssXHJcbiAgICAgICAgZm9ybUhlYWRlcixcclxuICAgICAgICBidXR0b25UZXh0LFxyXG4gICAgICAgIG1vZGVcclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8qIEFkZCBCb29rIEV2ZW50IGRpc3BhdGNoZWQgZnJvbSBNb2RhbCBjb21wb25lbnQqL1xyXG4gICAgICBhZGRCb29rTW9kYWxDb21wb25lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImFkZEJvb2tcIiwgYm9va01vZGVsLmFkZCk7XHJcbiAgICAgIGFkZEJvb2tNb2RhbENvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKFwiZWRpdEJvb2tcIiwgYm9va01vZGVsLmVkaXRCb29rKTtcclxuXHJcbiAgICAgIC8qIGNyZWF0ZSB0aGUgTW9kYWwgdmlldyAqL1xyXG4gICAgICBjb25zdCBmb3JtV3JhcHBlciA9IGFkZEJvb2tNb2RhbENvbXBvbmVudC5jcmVhdGVCb29rTW9kYWxET01Ob2RlKCk7XHJcbiAgICAgIGNvbnN0IGZpcnN0Q2hpbGQgPSBub2RlVG9BcHBlbmRUby5maXJzdENoaWxkO1xyXG4gICAgICBub2RlVG9BcHBlbmRUby5pbnNlcnRCZWZvcmUoZm9ybVdyYXBwZXIsIGZpcnN0Q2hpbGQpO1xyXG4gICAgICAvKiAgICAgICBBcHAuJC53cmFwcGVyLmluc2VydEJlZm9yZShmb3JtV3JhcHBlciwgZmlyc3RDaGlsZCk7ICovXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUVudW1QT0pPKGVudW1WYWx1ZXMpIHtcclxuICBjb25zdCBlbnVtUE9KTyA9IHt9O1xyXG4gIGZvciAoY29uc3QgZW51bVZhbHVlIG9mIGVudW1WYWx1ZXMpIHtcclxuICAgIGNvbnN0IGtleSA9IGNhbWVsQ2FzZShlbnVtVmFsdWUpO1xyXG4gICAgZW51bVBPSk9ba2V5XSA9IGVudW1WYWx1ZTtcclxuICB9XHJcbiAgcmV0dXJuIE9iamVjdC5mcmVlemUoZW51bVBPSk8pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYW1lbENhc2Uoc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG4gICAgLnNwbGl0KFwiIFwiKVxyXG4gICAgLm1hcCgod29yZCwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3Qgd29yZExvd2VyQ2FzZSA9IHdvcmQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgcmV0dXJuIGluZGV4ICE9IDBcclxuICAgICAgICA/IGAke3dvcmRMb3dlckNhc2UuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt3b3JkTG93ZXJDYXNlLnNsaWNlKDEpfWBcclxuICAgICAgICA6IHdvcmRMb3dlckNhc2U7XHJcbiAgICB9KVxyXG4gICAgLmpvaW4oXCJcIik7XHJcbn1cclxuIiwiLy8gTW9kdWxlXG52YXIgY29kZSA9IFwiPGh0bWwgbGFuZz1cXFwiZW5cXFwiPlxcclxcbjxoZWFkPlxcclxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJVVEYtOFxcXCI+XFxyXFxuICAgIDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXFxcIj5cXHJcXG4gICAgPHRpdGxlPkxpYnJhcnk8L3RpdGxlPlxcclxcbjwvaGVhZD5cXHJcXG48c3R5bGU+XFxyXFxuICAgIEBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUluZGllK0Zsb3dlciZkaXNwbGF5PXN3YXAnKTtcXHJcXG48L3N0eWxlPlxcclxcbjxzdHlsZT5cXHJcXG4gICAgQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Q291cmllcitQcmltZTp3Z2h0QDQwMDs3MDAmZGlzcGxheT1zd2FwJyk7XFxyXFxuPC9zdHlsZT5cXHJcXG48Ym9keSBjbGFzcz1cXFwiYmctY29sb3IgZmYtbWFpblxcXCI+XFxyXFxuXFxyXFxuXFxyXFxuICAgIDxkaXYgZGF0YS1nbG9iYWw9XFxcIndyYXBwZXJcXFwiIGNsYXNzPVxcXCJ3cmFwcGVyIHBvcy1yZWxcXFwiPlxcclxcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cXFwiZ3JpZCBwaS1jZW50ZXIgbXJnbi1ib3R0b20tODAwXFxcIj5cXHJcXG4gICAgICAgICAgICA8aDEgY2xhc3M9XFxcInN2Zy1oMSBwYi1ib3R0b20tNTAwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cXFwiMTAwcHhcXFwiIGhlaWdodD1cXFwiMTAwcHhcXFwiIHZpZXdCb3g9XFxcIjAgLTAuNDYgMzIxLjM5NSAzMjEuMzk1XFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRlZnM+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0eWxlPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYSB7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAjZmZmZmZmO1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5iIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6ICM2QjcwNUM7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmMge1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogIzIxMTcxNTtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZCB7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAjZmZkYTcxO1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHlsZT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0zMDQuNDE4LDIzOC45Yy0uMDE3LTExLjk1MS0uMDc3LTM2LjQxLS4wNzctNDUuMSwwLDAsMC0uMTIxLjAwNi0uMzU2LTUzLjktMzEuMDEtMTM1LjA2MS03Ny45MTktMTcxLjkyMi05OS4yNTQtMzEuMjEzLDE4LjA1OS05NC4wMzEsNTQuMzU3LTEzMC4zNzMsNzUuMjM0LDAsMTAuMTM4LjA3NCw0MC4xNzQuMDY4LDQ5LjA4NSwzMy4xNSwxOS4yLDExOS45NTcsNjkuMzcyLDE3My4zMjUsMTAwLjA1OCwzNy44ODUtMjEuNzc4LDk5LjgyOS01Ny41NzUsMTI4Ljk3OC03NC40NDd2LS40NTlDMzA0LjQyMywyNDIuNDkzLDMwNC40MjEsMjQwLjg2NSwzMDQuNDE4LDIzOC45WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJiXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMzEuNzA2LDk0LjZDMTAwLjM3LDExMi43MywzOC41NjcsMTQ4LjQ0MSwyLjQ0NSwxNjkuMTkzYzI3LjM3MiwxNS44NTMsMTI2LjM0Nyw3My4wNzEsMTcyLjIyNyw5OS4zODUsMzMuNS0xOS4yLDEwNi44NTktNjEuNTc4LDEyOS42NjktNzQuNzgzLDAsMCwwLS4xMjEuMDA2LS4zNTYtNTMuOS0zMS4wMS0xMzUuMDYxLTc3LjkxOS0xNzEuOTIyLTk5LjI1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMzA2LjQxOCwyMzguOXEtLjAxNy0xMi4xLS4wNDYtMjQuMmMtLjAxNC03LjA4LS4xOC0xNC4xOC0uMDI1LTIxLjI1OWEyLDIsMCwwLDAtLjk5LTEuNzI3cS0zNS43LTIwLjUzOS03MS4zNjUtNDEuMTM4LTM1LjM3Ni0yMC40MTktNzAuNzM2LTQwLjg2Ni0xNC45MTMtOC42MjItMjkuODIyLTE3LjI1YTIuMDIyLDIuMDIyLDAsMCwwLTIuMDE5LDBxLTIzLjc2MSwxMy43NDgtNDcuNTM0LDI3LjQ3Ny0yNy44NDMsMTYuMDgzLTU1LjcsMzIuMTQxLTEzLjU2NCw3LjgxNS0yNy4xMzcsMTUuNjE2YTIuMDExLDIuMDExLDAsMCwwLS45OSwxLjcyN3EwLDE3LjMyNS4wNTIsMzQuNjUxLjAwOCw0LjI3OC4wMTMsOC41NTVhMzguNjU2LDM4LjY1NiwwLDAsMCwuMDM5LDYuMTQ1Yy4yMywxLjM2MiwxLjcyMywxLjkwNSwyLjgsMi41MzFMNS43LDIyMi44ODZsNi4wMzIsMy40OTFRMjYuOSwyMzUuMTU3LDQyLjA4LDI0My45MjlxMTguNjYyLDEwLjc5LDM3LjMyOCwyMS41NjksMTkuODQyLDExLjQ2LDM5LjY4NywyMi45MDksMTkuMDc4LDExLjAwNiwzOC4xNjQsMjJjNS42NSwzLjI1NCwxMS4yMiw2LjgwNywxNy4wMTUsOS43OTIsMS43MDkuODgsMy4zMTQtLjU1OSw0Ljc3OC0xLjRsNC4yLTIuNDEzcTQuNDItMi41NDQsOC44NC01LjA4OSwxOS42ODktMTEuMzM3LDM5LjM2My0yMi43LDE5Ljc1NS0xMS40LDM5LjUtMjIuODE1LDE2LjE2Ny05LjM0NCwzMi4zMy0xOC43YzEuMTQxLS42NjEsMi44NjUtMS4yNjcsMy4xLTIuNzA1YTM0LjIzNCwzNC4yMzQsMCwwLDAsLjAzMS01LjQ4MmMwLTIuNTc0LTQtMi41NzktNCwwcTAsMi42MDcsMCw1LjIxNmwuOTktMS43MjdxLTIyLjg1MSwxMy4yMjctNDUuNzE1LDI2LjQzMy0yNy43LDE2LTU1LjQwOSwzMS45NzgtMTMuOTIzLDguMDI1LTI3Ljg1NCwxNi4wMzZoMi4wMTlxLTM2LjQ0My0yMC45NTQtNzIuODQzLTQxLjk4MlE2Ny42NDYsMjU0LjA5MywzMS43LDIzMy4zLDE3LjQxMSwyMjUuMDQ0LDMuMTMsMjE2Ljc3N2wuOTksMS43MjdjLjAwOC0xMy4zMTQtLjA0MS0yNi42MjgtLjA2LTM5Ljk0MnEtLjAwNy00LjU3Mi0uMDA4LTkuMTQzbC0uOTkxLDEuNzI3cTI1LjYxNi0xNC43MTUsNTEuMi0yOS40ODlRODEuNiwxMjUuODgsMTA4LjkzNCwxMTAuMDhxMTIuMjUyLTcuMDgzLDI0LjUtMTQuMTY4aC0yLjAxOXEyOS41OTIsMTcuMTI3LDU5LjIsMzQuMjMsMzcuMDczLDIxLjQyLDc0LjE2Myw0Mi44MTEsMTkuMjc1LDExLjExNSwzOC41NjEsMjIuMjEzbC0uOTkxLTEuNzI3Yy0uMTU1LDcuMDc5LjAxMSwxNC4xNzkuMDI1LDIxLjI1OXEuMDI0LDEyLjEuMDQ2LDI0LjJDMzAyLjQyMiwyNDEuNDcyLDMwNi40MjIsMjQxLjQ3NywzMDYuNDE4LDIzOC45WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNzMuMDcsMjY4LjQ0NHEwLDIwLjczNi4wNzIsNDEuNDcyLjAwNyw0LjE5NC4wMSw4LjM4OWMwLDIuNTc0LDQsMi41NzgsNCwwLDAtMTMuNS0uMDUtMjctLjA3Mi00MC41cS0uMDA4LTQuNjgzLS4wMS05LjM2NmMwLTIuNTc0LTQtMi41NzgtNCwwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0zLjQzMSwxNzIuMDY2cTEyLjExLDcuMDE3LDI0LjIyNiwxNC4wMjMsMTcuMDM4LDkuODU1LDM0LjA4MywxOS43LDE5LjM0OCwxMS4xNzksMzguNywyMi4zNDksMTkuMDM5LDEwLjk4OCwzOC4wODUsMjEuOTYsMTYuMTA5LDkuMjc5LDMyLjIzLDE4LjUzNmwzLjMwNiwxLjljMi4yMzYsMS4yODMsNC4yNTQtMi4xNzIsMi4wMTgtMy40NTRxLTE1LjU4Mi04LjkzNC0zMS4xNDYtMTcuOS0xOC44MjktMTAuODQyLTM3LjY0Ny0yMS43LTE5LjQ1OC0xMS4yMjgtMzguOTEtMjIuNDY1UTUwLjkxLDE5NC45MTQsMzMuNDQ0LDE4NC44MTVxLTEyLjg2My03LjQ0LTI1LjcyMS0xNC44ODZMNS40NSwxNjguNjEyYy0yLjIzMi0xLjI5My00LjI0OCwyLjE2My0yLjAxOSwzLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTc1LjA5MywyODMuNTY3cS0xMy40NDEtNy43MDctMjYuODY1LTE1LjQ0NC0xNi4zNzctOS40My0zMi43NDUtMTguODc3UTk4LjYsMjM5LjUwNSw4MS43MjQsMjI5Ljc1NXEtMTUuMjM2LTguOC0zMC40NjgtMTcuNjA5LTExLjE2Ni02LjQ1Ny0yMi4zMzEtMTIuOTItLjk5Mi0uNTc2LTEuOTg1LTEuMTVjLTIuMjMyLTEuMjkzLTQuMjQ4LDIuMTYyLTIuMDE5LDMuNDU0UTM1LjQzLDIwNy42MTcsNDUuOTQ0LDIxMy43cTE0Ljg2LDguNiwyOS43MjMsMTcuMTgxLDE2Ljc5LDkuNywzMy41ODQsMTkuMzkzLDE2LjU2Niw5LjU1OSwzMy4xMzgsMTkuMTA4LDEzLjksOC4wMSwyNy44MjIsMTZsMi44NjMsMS42NDJjMi4yMzcsMS4yODIsNC4yNTQtMi4xNzIsMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE2NC4xMTUsMjkzLjQ0N3EtMTMuMDE5LTcuNDY1LTI2LTE1Yy0yLjIzMi0xLjI5My00LjI0OCwyLjE2Mi0yLjAxOSwzLjQ1M3ExMi45ODcsNy41MjIsMjYsMTVjMi4yMzcsMS4yODMsNC4yNTQtMi4xNzIsMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImRcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTI0OS40MjMsMjgxLjUyNmMtNC42MTgsMi42NTItMTkuNTk0LDExLjMtMjYuNDA2LDE1LjIyNS02LjU3My0zLjc3NS0xOC4yMzEtMTAuNDkzLTI2LjkzNi0xNS41MTcsOC4yMjYtNC43MzIsMTcuMjc0LTkuOTQyLDI2LjQyNi0xNS4yMjVDMjMxLjQ0MSwyNzEuMTY3LDI0My4xNzIsMjc3LjkzOCwyNDkuNDIzLDI4MS41MjZaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE5Ni4wODEsMjgzLjIzNGguMDFsLTEuMDA5LS4yNzNxMTIuNTQ2LDcuMjU1LDI1LjExMywxNC40NzZhOC4wMyw4LjAzLDAsMCwwLDIuNTU2LDEuMjc4YzEsLjEzNSwxLjkyOC0uNjEyLDIuNzU2LTEuMDlsNC43My0yLjcyNiwxMC43NTItNi4ycTQuNzItMi43MjQsOS40NDMtNS40NDJhMi4wMTksMi4wMTksMCwwLDAsMC0zLjQ1NHEtMTMuNDcxLTcuNzM0LTI2LjkxNS0xNS41MTdjLTIuMjM0LTEuMjktNC4yNSwyLjE2Ni0yLjAxOSwzLjQ1NHExMy40NTIsNy43NjcsMjYuOTE1LDE1LjUxN1YyNzkuOHEtMTMuMjE1LDcuNTktMjYuNCwxNS4yMjVoMi4wMThxLTYuNi0zLjc5Mi0xMy4yLTcuNi0zLjctMi4xMy03LjQtNC4yNjRsLTMuNjcyLTIuMTIxYy0xLjAyNy0uNTkzLTIuNDYzLTEuODA5LTMuNjc3LTEuODA5LTIuNTc0LDAtMi41NzgsNCwwLDRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTI4Ni44MSwyMjYuNTYxcS0xOC40NTgsMTAuNjg5LTM2LjkzMSwyMS4zNDgtMjQuODQxLDE0LjM0My00OS43LDI4LjY1OS0xMi44NTYsNy40LTI1LjcyMSwxNC43ODVjLTIuMjM0LDEuMjc5LS4yMjEsNC43MzYsMi4wMTksMy40NTRxMjMuNzU4LTEzLjYsNDcuNDU2LTI3LjMxMiwyMy40ODEtMTMuNTM3LDQ2Ljk0OC0yNy4xLDguOTc0LTUuMTg3LDE3Ljk0Ny0xMC4zODFjMi4yMjctMS4yOS4yMTUtNC43NDgtMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE3NS45LDI3MC4xNzlxMjYuMDY5LTE0Ljk0MSw1Mi4wODYtMjkuOTczLDI4LjA2OC0xNi4xODUsNTYuMTE5LTMyLjQsMTAuNjIzLTYuMTM5LDIxLjI0My0xMi4yODVjMi4yMjctMS4yODkuMjE1LTQuNzQ3LTIuMDE5LTMuNDU0UTI4MS4xNjksMjA0LjksMjU4Ljk4OSwyMTcuN3EtMjkuMTQsMTYuODI3LTU4LjMsMzMuNjIyLTEzLjQsNy43MTMtMjYuODA3LDE1LjQwNmMtMi4yMzMsMS4yOC0uMjIxLDQuNzM3LDIuMDE5LDMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yNjIuMjQ5LDE2NS41ODdjLS4wMTMtOC45MjItLjA1OC0yNy4xODEtLjA1OC0zMy42NzIsMCwwLDAtLjA5LjAwNS0uMjY2LTQwLjIzOC0yMy4xNS0xMDAuODMxLTU4LjE3LTEyOC4zNDktNzQuMS0yMy4zLDEzLjQ4Mi03MC4yLDQwLjU4LTk3LjMzMSw1Ni4xNjYsMCw3LjU2OC4wNTYsMjkuOTkyLjA1MSwzNi42NDQsMjQuNzQ5LDE0LjMzLDg5LjU1NSw1MS43OTEsMTI5LjQsNzQuNywyOC4yODQtMTYuMjU5LDc0LjUyOC00Mi45ODQsOTYuMjg5LTU1LjU3OXYtLjM0M0MyNjIuMjUyLDE2OC4yNywyNjIuMjUxLDE2Ny4wNTUsMjYyLjI0OSwxNjUuNTg3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMzIuMSw1OC41NjFjLTIzLjgzMSwxMy43ODYtNjkuMTE1LDM5Ljk1LTk1LjU4NSw1NS4xNTYsMCw3LjU2OC4wNTYsMjkuOTkyLjA1MSwzNi42NDQsMTAuNzYzLDYuMjMzLDI5LjEsMTYuODM5LDQ5LjY3LDI4LjcyMi0uMDE1LTkuMTMyLS4wNTQtMjkuMzA3LS4wNTgtMzYuOTgzLDQxLjgzMy0yNC4xNjYsNzcuMDc3LTQ0LjU0NSw5Ni45NTUtNTYuMDUyLTE5LjY5My0xMS4zNzctMzcuNTE2LTIxLjY4NC00OS4yODctMjguNVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjY0LjI0OSwxNjUuNTg3Yy0uMDE3LTExLjMtLjMtMjIuNjM3LS4wNTMtMzMuOTM4YTIsMiwwLDAsMC0uOTkxLTEuNzI3cS0yNi42NDQtMTUuMzMtNTMuMjY1LTMwLjctMjYuNDA2LTE1LjI0Mi01Mi44LTMwLjVRMTQ2LDYyLjI3MSwxMzQuODU2LDU1LjgyNGEyLjAyMiwyLjAyMiwwLDAsMC0yLjAxOSwwUTExNS4wNzMsNjYuMSw5Ny4zLDc2LjM2Nyw3Ni41NjYsODguMzQzLDU1LjgyMiwxMDAuM3EtMTAuMTU1LDUuODUxLTIwLjMxNSwxMS42OTFhMi4wMTIsMi4wMTIsMCwwLDAtLjk5MSwxLjcyN3EwLDEzLjA4Ny4wNCwyNi4xNzQuMDA2LDMuMTY4LjAwOSw2LjMzNmMwLDEuNDIzLS4zMDcsMy4yODIuMDc0LDQuNjY2LjQwNywxLjQ3OCwzLjE5LDIuNTEsNC40NSwzLjI0bDQuNiwyLjY2NHEyNS4yODMsMTQuNjMsNTAuNTc5LDI5LjIzNywyOS4wMTQsMTYuNzU3LDU4LjA0NSwzMy40ODJsNi42MjIsMy44MTIsMy4wNDksMS43NTRhMjQuNjQ2LDI0LjY0NiwwLDAsMCwzLjIwNSwxLjgwNmMxLjMyLjUxMSwyLjU1NC0uNTQ2LDMuNjU1LTEuMTc5bDMuMzI3LTEuOTEzLDYuNzI3LTMuODczcTE0LjY0OS04LjQzNiwyOS4yOS0xNi44ODksMjYuODE0LTE1LjQ3NSw1My42MTItMzAuOTgyYzEuMDkyLS42MzIsMi4zNDYtMS4xMjUsMi40NDgtMi41Ny4wOTEtMS4yODUsMC0yLjYwOCwwLTMuOSwwLTIuNTczLTQtMi41NzgtNCwwcTAsMS45NDcsMCwzLjlsLjk5MS0xLjcyN3EtMTcuMDIyLDkuODUyLTM0LjA1NCwxOS42ODktMjAuNzE5LDExLjk3Mi00MS40NSwyMy45MjMtMTAuMzkxLDUuOTg4LTIwLjc4NSwxMS45NjdoMi4wMTlxLTI3LjE3My0xNS42MjUtNTQuMzE0LTMxLjNRODUuODQsMTc2LjU1MSw1OS4wMzUsMTYxLjA1LDQ4LjMsMTU0Ljg0NSwzNy41NzcsMTQ4LjYzNGwuOTksMS43MjdjLjAwNi05LjkxMS0uMDMtMTkuODIyLS4wNDUtMjkuNzM0cTAtMy40NTQtLjAwNi02LjkxbC0uOTksMS43MjdxMTkuMTQ5LTExLDM4LjI3My0yMi4wNDZROTYuMTYxLDgxLjY1LDExNi41MTIsNjkuODg1cTkuMTc0LTUuMywxOC4zNDQtMTAuNjA3aC0yLjAxOXEyMi4wODYsMTIuNzgzLDQ0LjE4NCwyNS41NDgsMjcuNjcxLDE1Ljk4OSw1NS4zNTUsMzEuOTU0LDE0LjQsOC4zLDI4LjgxLDE2LjZsLS45OS0xLjcyN2MtLjI0OCwxMS4zLjAzNiwyMi42MzUuMDUzLDMzLjkzOEMyNjAuMjUzLDE2OC4xNjEsMjY0LjI1MywxNjguMTY2LDI2NC4yNDksMTY1LjU4N1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTYzLjY4NCwxODcuNjQ0YzAsOC40NjQuMDYsMTYuOTI3LjA2MSwyNS4zOTEsMCwyLjU3Myw0LDIuNTc4LDQsMCwwLTguNDY0LS4wNi0xNi45MjctLjA2MS0yNS4zOTEsMC0yLjU3My00LTIuNTc4LTQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTY3LjA3OCwxODYuNDA4cS0yMi43NjctMTMuMDU0LTQ1LjQ4Ni0yNi4xODlROTcuMDgxLDE0Ni4wNzcsNzIuNTgzLDEzMS45MXEtOS4yNzktNS4zNjUtMTguNTU1LTEwLjczN2MtMi4yMzEtMS4yOTItNC4yNDgsMi4xNjMtMi4wMTksMy40NTRxMTkuMzU1LDExLjIxMSwzOC43MjMsMjIuMzk0LDI1LjQ0OSwxNC43LDUwLjkxMywyOS4zNzgsMTEuNyw2Ljc0MSwyMy40MTQsMTMuNDYzYzIuMjM3LDEuMjgzLDQuMjU0LTIuMTcyLDIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNjYuNTYsMTg5LjM3N3ExNi40NTMtOS40MjksMzIuODc1LTE4LjkxNywxNy42NTItMTAuMTgxLDM1LjI5NS0yMC4zNzcsNi43NTYtMy45LDEzLjUwOS03LjgxM2MyLjIyOC0xLjI4OS4yMTYtNC43NDctMi4wMTgtMy40NTNxLTEzLjk4OSw4LjEtMjcuOTg4LDE2LjE3Ni0xOC4zMjEsMTAuNTc5LTM2LjY1NSwyMS4xNC04LjUxNiw0LjktMTcuMDM3LDkuNzljLTIuMjMzLDEuMjgtLjIyLDQuNzM4LDIuMDE5LDMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk04Ny4zLDE0My43NnEyMS45NTYtMTIuNjgyLDQzLjkwNy0yNS4zNzEsMTcuODI3LTEwLjMsMzUuNjUyLTIwLjYxNSw3LjYyNC00LjQxLDE1LjI0Ny04LjgyM2MyLjIyNy0xLjI4OS4yMTYtNC43NDctMi4wMTktMy40NTRxLTE0Ljc0Miw4LjUzNS0yOS40OSwxNy4wNjEtMTkuODM2LDExLjQ3LTM5LjY3NSwyMi45MzRROTguMSwxMzIuOSw4NS4yODUsMTQwLjMwNmMtMi4yMjksMS4yODgtLjIxNyw0Ljc0NSwyLjAxOCwzLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNODQuMTc0LDE0Mi4wODJjLjAxMywxMS4zNDMuMDYxLDIyLjY4Ni4wNjIsMzQuMDI5LDAsMi41NzQsNCwyLjU3OCw0LDAsMC0xMS4zNDMtLjA0OS0yMi42ODYtLjA2Mi0zNC4wMjksMC0yLjU3My00LTIuNTc4LTQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYlxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTQ3LjMsMTQyLjc1OGExNS43OTMsMTUuNzkzLDAsMCwxLTEuNiw2LjE2NWMtMS45ODYsMy45LTUuODE4LDYuNTY5LTkuODUzLDguMjY5cy00LjYxMywxLjI1OC04Ljc4OCwyLjU3NmMtMy4yNTUsMS4wMjctNi42NjMsMi41MDYtOC4wNTgsNS44YTE5LjI0NSwxOS4yNDUsMCwwLDAtMS4wMzEsNS4yMzFjLS4zLDYuNzQ4LS4yNDYsMTMuNzY3LS4zMywyMC43MTFhMi4yNzksMi4yNzksMCwwLDEtMS41NywyLjE5LDMyLjEzOSwzMi4xMzksMCwwLDEtMTQuNjU1Ljc4MSwyLjkyNSwyLjkyNSwwLDAsMS0xLjMtLjg3MywzLjk1OSwzLjk1OSwwLDAsMS0xLjEtMS44MzFjLS4zNzYtMy4xNTItLjU1Ny02LjE4OC0uNjY0LTkuMjI4LTMuNDkzLjc3Ni03LjQ4NSwyLjExNi0xMS4yLDEuMjA5LTIuNTgzLS42My01LTIuNi01LjQtNS4yMjlsLS4zMjgtMi4xNzFjLS41NzctMTAuNjItMS4xNTMtOS4yODMtMS43My0xOS45LS4xOTQtMy41NzMtLjM1LTcuMzQxLDEuMjgyLTEwLjUyNmExNy44MjYsMTcuODI2LDAsMCwxLDUuNjY0LTUuOTA5LDY5LjAzLDY5LjAzLDAsMCwxLDE0LjQ2NC04LjEwN1MxNDAuNjE5LDE0MS4zOTQsMTQ3LjMsMTQyLjc1OFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTM5LjIyMSwxNDYuMzE3YzIuMy0xLjI4OCw1LjI2My0yLjczOCw4LjEyMy00LjQ1Miw0Ljc0Ni0yLjg0LDkuMjU4LTYuNDI5LDEwLjE5MS0xMS4yNDZhMjAuMTI2LDIwLjEyNiwwLDAsMC0uMDMtNi4yODhjLS45MTMtNy4zNzItMi42NTctMTYuNzgyLTcuMjUxLTIyLjg0Ny0yLjgtMy43MTEtNy4yMi04LjUtMTEuNTMtMTAuNzA4LDAsMC03LjQ3Ny0zLjYyLTE0Ljc0MS00LjA5NC0xMS42NjItLjc2LTE3LjYzLDQuMjExLTE3LjYzLDQuMjExYTM1LjI1NiwzNS4yNTYsMCwwLDAtMTMuMiwyMC44bC0yLjAzNiwxMS43MTYtLjczNSw0LjIyOVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNOTIuNDcyLDIwNC4wMjhhNy4zNTksNy4zNTksMCwwLDEsMS40MjktNi4wMiwxOC4xNTgsMTguMTU4LDAsMCwxLDUuNDM2LTQuMzc1YzIuMSwxLjY0NCwxMC42MzIsMS45NjIsMTYuNzM4LjA3YTIuMTU1LDIuMTU1LDAsMCwwLC41ODMtLjI4MWMuMDc1LjcxMi4xMjMsMS4xNTMuMTIzLDEuMTUzLjYzNSw1LjgtMi44NzgsOC4xMzItNS4xMDgsOS40NTlhMzMuNjE5LDMzLjYxOSwwLDAsMS04LjUsMy41NzgsMTMuOSwxMy45LDAsMCwxLTUuNTQ3LjU0NEE2LjQ1Myw2LjQ1MywwLDAsMSw5MywyMDUuMzA2LDQuOTc1LDQuOTc1LDAsMCwxLDkyLjQ3MiwyMDQuMDI4WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk03NC42MDksMTkxLjQ2MWE4LjAxMyw4LjAxMywwLDAsMSwxLjE0My0yLjEzMywxOS4yODMsMTkuMjgzLDAsMCwxLDUuODkyLTQuNjE0LDkuOTIzLDkuOTIzLDAsMCwxLDMuODA4LTEuNTgxLDguMTE4LDguMTE4LDAsMCwwLDEuNzA4LjYyOGMzLjcxNS45MDcsNy43MDYtLjQzMiwxMS4yLTEuMjA4LjA3NSwyLjE5LjE5MSw0LjM3OS4zOSw2LjYxbC0xLjU2OS4yNTljLjExNywyLjUtMi4xLDQuNDUxLTQuMjUxLDUuNzNhMzIuNTIzLDMyLjUyMywwLDAsMS04LjIxOSwzLjQ1OSwxMy4zNDgsMTMuMzQ4LDAsMCwxLTUuMzYzLjUyLDYuMiw2LjIsMCwwLDEtNC40NjktMi43NTJBNS44MzQsNS44MzQsMCwwLDEsNzQuNjA5LDE5MS40NjFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTExNC43ODEsMTk0LjU3NWE3LjE3Myw3LjE3MywwLDAsMS0yLjYsNi43NDQsMjcuNzg3LDI3Ljc4NywwLDAsMS05LjU0Niw0LjM2NWMtMi43NzQuNzM0LTguMjg3LDEuMjE3LTguMzQxLTMuMDM2LS4wNDgtMy44LDMuODc0LTYsNi43MDYtNy42NzcsMi4yMTUtMS4zMDguMi00Ljc2Ny0yLjAxOS0zLjQ1My0zLjM0NywxLjk3OC02LjcwOCw0LjE5NC04LjEyNSw4YTcuNjQ2LDcuNjQ2LDAsMCwwLDMuNDE1LDkuNjEzYzMuODQzLDIuMDEzLDguMzc0LjkzNCwxMi4yMzUtLjQ2N2EyOC42MDgsMjguNjA4LDAsMCwwLDguNzE3LTQuNjg0LDEwLjcsMTAuNywwLDAsMCwzLjU1Ny05LjQsMi4wNTQsMi4wNTQsMCwwLDAtMi0yLDIuMDE0LDIuMDE0LDAsMCwwLTIsMlpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNODQuNjU0LDE4MS4yNDJhMTYuMDMsMTYuMDMsMCwwLDAtNC45NDcsMi4zLDIzLjgyOCwyMy44MjgsMCwwLDAtNC4xOCwzLjA0N2MtMi40NjIsMi4zNDYtNC4wODEsNi4wMDktMi45OTEsOS40LDEuMTUyLDMuNTg2LDQuOTE0LDUuMzI3LDguNDc0LDUuMjM0LDMuODM5LS4xLDcuNzc0LTEuNjMyLDExLjE1My0zLjM2MSwzLjMyNS0xLjcsNy4wNDktNC4yODIsNy4wMjEtOC40NC0uMDE3LTIuNTczLTQuMDE3LTIuNTc4LTQsMCwuMDIsMi45MzktNC4zMTYsNC43MS02LjUsNS42OTFhMjkuMzU1LDI5LjM1NSwwLDAsMS00LjksMS42NzQsOC44NzMsOC44NzMsMCwwLDEtNS4yMTkuMDkyYy0yLjg5LTEuMDg0LTIuODE4LTQuMjI4LTEuMTcyLTYuNDE5YTEzLjMzMywxMy4zMzMsMCwwLDEsMy43MjMtMy4wODksMTQuNjM1LDE0LjYzNSwwLDAsMSw0LjYwNy0yLjI3MmMyLjUyMS0uNTEzLDEuNDU0LTQuMzctMS4wNjMtMy44NTdaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEwMC41NzksMTI5Ljk4OWE3MC40MzQsNzAuNDM0LDAsMCwwLTE1LjkzNiw5LjA1NUExNy40NjUsMTcuNDY1LDAsMCwwLDc4LjksMTQ1LjdhMjAuMjEzLDIwLjIxMywwLDAsMC0xLjI4OCw4LjgxNmMuMTQ1LDQuMzE1LjU2LDguNiwxLjA3OCwxMi44ODIuNDY4LDMuODcxLjQ0NSw3LjgxNCwxLjE0LDExLjY1YTguNTcsOC41NywwLDAsMCw1LjIzOCw2LjA5NWMzLjM2LDEuNDQ0LDcuMDYxLjkwNywxMC41MTYuMTI2LDIuNTEtLjU2NywxLjQ0OC00LjQyNS0xLjA2My0zLjg1Ny0zLjczMy44NDQtMTAuMDMzLDEuNS0xMC44NjMtMy42MTUtLjU0Ny0zLjM3Ni0uNTQzLTYuODU3LS45NTUtMTAuMjg3LS40MzItMy42LS43ODYtNy4xODUtLjk4Ny0xMC44YTI2LjYzNywyNi42MzcsMCwwLDEsLjI1OC03LjY1LDExLjQyMywxMS40MjMsMCwwLDEsNC4xMjMtNi4wODUsNTkuODg0LDU5Ljg4NCwwLDAsMSwxNS41NDctOS4xMjMsMi4wNjcsMi4wNjcsMCwwLDAsMS40LTIuNDYxLDIuMDEyLDIuMDEyLDAsMCwwLTIuNDYtMS40WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMDAuMTY0LDE0OS4yNzVjLTMuNDI3LDIuMzgyLTQuMjg3LDYuMTE3LTQuMzQ5LDEwLjA0My0uMDYzLDMuOTgyLjE0OSw3Ljk2My4yNzMsMTEuOTQyLjE2Myw1LjIyLjE0LDEwLjQ0Ny40OSwxNS42NTkuMTYyLDIuNDE1LS4wMTUsNS4zNjYsMS41MTgsNy4zNjcsMS40NzEsMS45MiwzLjI3NCwyLjMyMyw1LjU1NSwyLjU2M2EzMi42OTEsMzIuNjkxLDAsMCwwLDYuNTgzLS4wMjMsMjUuNDY4LDI1LjQ2OCwwLDAsMCw2LjY4Mi0xLjMxM2MyLjYxLTEuMDE3LDIuNzI0LTMuNTE5LDIuNzQ4LTUuOTM5LjAyNi0yLjc1LjAzNi01LjUuMDYzLTguMjQ4LjAyNi0yLjcxOS4wNjctNS40MzkuMTU3LTguMTU3YTIxLjEzMiwyMS4xMzIsMCwwLDEsLjg2OS02LjU4MWMxLjMzNS0zLjYxNiw2LjA3NC00LjgwNiw5LjQxLTUuNjExLDQuMzI2LTEuMDQ0LDguNDktMi40LDEyLjA5Mi01LjEyOGExNy42NjEsMTcuNjYxLDAsMCwwLDcuMDg5LTEzLjk4NGMuMS0yLjU3NS0zLjktMi41Ny00LDBhMTMuNTIxLDEzLjUyMSwwLDAsMS01LjIwOSwxMC42LDI0LjI3NywyNC4yNzcsMCwwLDEtOS42NjEsNC4zMzhjLTMuNTY1Ljc5Mi03LjM1MSwxLjgtMTAuMjcsNC4xLTMuMjQxLDIuNTUtNC4wNDEsNi40NDctNC4yNDgsMTAuMzczLS4yNjMsNC45NTctLjIzMiw5LjkzNS0uMjY2LDE0LjlxLS4wMTIsMS44MjEtLjAyOSwzLjY0MWE2LjQ3Myw2LjQ3MywwLDAsMS0uMDE5LDEuN2MtLjExMy4zMjEtLjA2Ni4yLS4yNzcuMzE2YTEwLjI5LDEwLjI5LDAsMCwxLTIuODY0LjY3OSwyOS4wMjMsMjkuMDIzLDAsMCwxLTMuMDY4LjM4NiwzMiwzMiwwLDAsMS01Ljc4Mi0uMDQ2LDQuODMzLDQuODMzLDAsMCwxLTEuODMzLS4zOGMtLjkzMS0uNTU0LS45MDYtMS42MjctMS0yLjU1OS0uNDU4LTQuNzA5LS41MzEtOS40NC0uNjI1LTE0LjE2Ny0uMDktNC40OS0uMzE5LTguOTc3LS4zNzktMTMuNDY4LS4wMjItMS42OTEtLjA1LTMuNC4wOC01LjA4My4wMTEtLjE0LjAyMi0uMjguMDM2LS40Mi4wNDEtLjQtLjAyNi4xMjIuMDExLS4wNjZhOS4yMTUsOS4yMTUsMCwwLDEsLjQzMy0xLjU2Myw1LjIxLDUuMjEsMCwwLDEsMS44MDUtMi40MTRjMi4xLTEuNDYuMS00LjkyOS0yLjAxOS0zLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTA1LjM0NCw4OS4xNjZhMzcuNTc5LDM3LjU3OSwwLDAsMC0xNC4xMTcsMjEuOTkxYy0uNTM1LDIuNTExLDMuMzIsMy41ODQsMy44NTcsMS4wNjNhMzMuNDM3LDMzLjQzNywwLDAsMSwxMi4yNzktMTkuNiwyLjA2NSwyLjA2NSwwLDAsMCwuNzE3LTIuNzM2LDIuMDEzLDIuMDEzLDAsMCwwLTIuNzM2LS43MThaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTkzLjA3MywxMzEuOTEyYy0yLjIyNC0xLjM4Ny0zLjE0OS0zLjczLTMuNTEyLTYuMjE3LS40MDctMi43ODguMDctNi4zMzcsNC4xMjctNy4zNTFhNS43NzYsNS43NzYsMCwwLDEsNC4yMjUuNzg5LDcuOTE3LDcuOTE3LDAsMCwxLDMuODkxLDcuNjgyYy0uMjc0LDMuMzA2LTMuMzkxLDYuMzM2LTYuNjczLDUuODU3QTUuMyw1LjMsMCwwLDEsOTMuMDczLDEzMS45MTJaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTk0LjA4MiwxMzAuMTg1YTQuNzg5LDQuNzg5LDAsMCwxLTEuMi0xLjA5MWMuMTc5LjIyNC0uMDgtLjEyMS0uMTE4LS4xNzZxLS4xNDItLjIxNi0uMjctLjQzOWMtLjA2OC0uMTItLjEzMy0uMjQxLS4xOTUtLjM2NCwwLDAtLjI0Ny0uNTYzLS4xMzUtLjI4MWExMC44ODQsMTAuODg0LDAsMCwxLS41MjctMS44MjVjLS4wMzYtLjE3NS0uMDY4LS4zNS0uMS0uNTI3LS4wMjMtLjEzNi0uMDc2LS42MTktLjAxOC0uMDgzLS4wMjctLjI1My0uMDUzLS41LS4wNjYtLjc1OWExMS4wODgsMTEuMDg4LDAsMCwxLC4wMzEtMS40Yy4wMjgtLjM3NCwwLDAtLjAxLjA2Ny4wMjYtLjEyNy4wNDYtLjI1Ni4wNzUtLjM4My4wNjItLjI4MS4xNTItLjU0OC4yNDEtLjgyMS0uMTQ1LjQ1LjA4Ni0uMTY3LjE2MS0uM3MuNDgxLS42MzcuMTg1LS4zMDlhNy4zMyw3LjMzLDAsMCwxLC41MTgtLjUyNWMuMjMyLS4yMDktLjM5LjIyNC4wNzItLjA1My4xNTUtLjA5Mi4zLS4xOTMuNDY0LS4yNzguMTExLS4wNi4yMjQtLjExOC4zMzktLjE2Ny0uMjg3LjEyNC4wMjgsMCwuMDc2LS4wMTlhOC4xMjYsOC4xMjYsMCwwLDEsLjkwNy0uMjRjLS40NDcuMDc2LjE4NS4wMTIuMzUuMDE1cy4zMy4wMTIuNDk0LjAzYy4xNDEuMDE0LjEzNS4wMTQtLjAxNywwLC4xMDYuMDE4LjIxMS4wNDEuMzE0LjA2N2E0LjA5Myw0LjA5MywwLDAsMSwxLjYuNzc0Yy4wMjMuMDE2LjMuMjI2LjEuMDY1LjEwOC4wODMuMjEyLjE3My4zMTUuMjYyYTguOTM5LDguOTM5LDAsMCwxLC43OC43NjUsNS4zNDgsNS4zNDgsMCwwLDEsMS4yNjYsMi41MzFjLS4wMDctLjAzMy4xMTIuNTg4LjA2OC4zMDlzLjAzNC4zNjIuMDMxLjMyNmE4LjkyNCw4LjkyNCwwLDAsMSwuMDE5LjkyNWMwLC4xNzgtLjAxNC4zNTUtLjAyOS41MzIuMDA3LS4wODcuMDczLS4zNC0uMDEuMDcyYTguMDQ4LDguMDQ4LDAsMCwxLS4yNjguOTc5Yy0uMi42LjA4Ni0uMTUtLjA3OC4xNzktLjA5LjE4NC0uMTg3LjM2My0uMjkyLjUzOWEyLjUzOSwyLjUzOSwwLDAsMS0uNDc0LjY2MSw2LjcxMyw2LjcxMywwLDAsMS0uNzI5LjdjLjIxNi0uMTc3LS4wNDEuMDI3LS4wNzcuMDUtLjE2OC4xMDgtLjMzNC4yMTgtLjUxLjMxNGEzLjQyOCwzLjQyOCwwLDAsMS0xLjQzNi40MSwzLjExMiwzLjExMiwwLDAsMS0xLjg0OC0uNTM2LDIsMiwwLDAsMC0yLjAxOSwzLjQ1NGMzLjcsMi4yLDgsLjcwNiwxMC4zMjYtMi42OTNhOS41MTEsOS41MTEsMCwwLDAtLjAzOS0xMC4xOTJjLTEuOTgxLTMuMDQ2LTUuNy01LjMxMS05LjQtNC4yODNhNy40ODIsNy40ODIsMCwwLDAtNS40ODUsNy4wODFjLS4yNDcsMy44MzUsMS4zMTQsNy45NjEsNC42LDEwLjA4N2EyLDIsMCwxLDAsMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiIGQ9XFxcIk0xMDUuOTM2LDEwNS41MjJ2MjIuMjk0YzAsMi41NzQsNCwyLjU3OCw0LDBWMTA1LjUyMmMwLTIuNTczLTQtMi41NzgtNCwwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMDcuMjQxLDEzMS42MDhjLTYuMTUxLDEuMDQyLTEyLjQyOSwzLjQ0Mi0yMS41LDQuOTQ3LDUuNTkxLDIuNjk1LDE2LjEwNiw3Ljg3MiwyNi4xNjEsMTIuOSw4LjczNy0zLjU1NywxMS4yMjQtNC4xNzcsMTYuNjkyLTYuMjc0QzExOS40NDYsMTM4LjQ2MiwxMDcuMjU5LDEzMS42LDEwNy4yNDEsMTMxLjYwOFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTA2LjcxLDEyOS42NzljLTcuMjUyLDEuMjU2LTE0LjIzLDMuNzIyLTIxLjUsNC45NDgtMS42NjQuMjgtMS45NzEsMi45MzUtLjQ3NywzLjY1NSw1LjkxMSwyLjg1MiwxMS44LDUuNzU5LDE3LjY3NCw4LjY3NnEyLjY0NywxLjMxMyw1LjI5MSwyLjYzMWMuOTI0LjQ2MSwxLjg0My45MzIsMi43NzEsMS4zODRhMy4xNiwzLjE2LDAsMCwwLDMuMDc5LS4wMzdxNC4xMzgtMS42NjgsOC4zMzItMy4xODljMi40MTgtLjg3LDQuODQ1LTEuNzE2LDcuMjQ2LTIuNjM0LDEuNDc5LS41NjYsMi4xMzgtMi44LjQ3OC0zLjY1Ni00LjczOC0yLjQ0OS05LjQyNy00Ljk5MS0xNC4xLTcuNTYtMi40MDgtMS4zMjQtNC43NzYtMi44MjMtNy4yNTItNC4wMTYtMi4zMDktMS4xMTMtNC4zNCwyLjMzNS0yLjAxOSwzLjQ1NCwyLjQ3NiwxLjE5Myw0Ljg0NCwyLjY5Miw3LjI1Myw0LjAxNiw0LjY3MywyLjU2OSw5LjM2Miw1LjExMSwxNC4xLDcuNTZsLjQ3OC0zLjY1NWMtNS41NTUsMi4xMjQtMTEuMTc4LDQuMDMzLTE2LjY5MSw2LjI3NGwxLjU0MS4yYy04LjctNC4zNS0xNy40LTguNjc4LTI2LjE2MS0xMi45bC0uNDc4LDMuNjU2YzcuMjctMS4yMjYsMTQuMjQ3LTMuNjkxLDIxLjUtNC45NDhhMi4wMTYsMi4wMTYsMCwwLDAsMS40LTIuNDZBMi4wNDYsMi4wNDYsMCwwLDAsMTA2LjcxLDEyOS42NzlaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEyMy4zNDYsMTQwLjg3Yy41OS00Ljc3OSw1LjU5Mi04Ljc2NSwxMi4wMTUtNiwuOTcsMi45ODIsMi42NTUsNy40OSwzLjY5MSwxMS4yNTgtMS40MTIsMS4xNDItMi42MzMsMi4xMzQtMi42MzMsMi4xMzQtMi4wNjYsMi40OTQtNi42MywyLjA0NS05LjExMi41MzVBOC4yNDcsOC4yNDcsMCwwLDEsMTIzLjM0NiwxNDAuODdaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEzNC42NjksMTMyLjQ4N2ExMC44NzUsMTAuODc1LDAsMCwwLTguMTA5LjYwNiw5LjkzMSw5LjkzMSwwLDAsMC00LjY2NSw1LjM1NmMtMS45OCw1LjIsMS4xNTIsMTEuMDU2LDYuMjQ2LDEyLjkyMiwzLjExNywxLjE0MSw3LjM4Ljk3NSw5LjY5Mi0xLjdhMi4wNSwyLjA1LDAsMCwwLDAtMi44MjksMi4wMTgsMi4wMTgsMCwwLDAtMi44MjgsMGMtLjEuMTExLS4yLjIxMi0uMy4zMjEtLjA2Ni4wNzQtLjM2OS4zMTYtLjA1OC4wOGE1LjI0NCw1LjI0NCwwLDAsMS0uNjY1LjQwNWMtLjEuMDUzLS40NDkuMTY2LS4wODUuMDQzLS4xMTMuMDM4LS4yMjMuMDc4LS4zMzcuMTEyYTYuNjI2LDYuNjI2LDAsMCwxLS44OC4yYy40LS4wNjMsMCwwLS4xMDcsMC0uMTU1LjAwNi0uMzA5LjAxOS0uNDY0LjAyMS0uMjgxLjAwNS0uNTYtLjAxNC0uODQtLjAyNi0uMSwwLS41MS0uMDUxLS4xMiwwLS4xMjMtLjAxNi0uMjQ2LS4wMzgtLjM2OC0uMDYxYTkuNSw5LjUsMCwwLDEtLjk4NC0uMjMzYy0uMjU3LS4wNzUtLjUwOS0uMTY0LS43Ni0uMjU2LjM4Ni4xNDItLjI2NC0uMTI4LS4zNzItLjE4NmE2LjU4MSw2LjU4MSwwLDAsMS0uNjYzLS40MTZjLS40ODctLjMzOC4xNjEuMTQtLjEwNi0uMDgyLS4xMzgtLjExNC0uMjc0LS4yMy0uNDA2LS4zNXEtLjI4OC0uMjYzLS41NTUtLjU0NmMtLjA3Ni0uMDgyLS4xNTEtLjE2NS0uMjI1LS4yNSwwLDAtLjM0My0uNDE5LS4xNTYtLjE3OXMtLjEyOS0uMTg0LS4xMzEtLjE4N2MtLjA2LS4wODctLjExOS0uMTc1LS4xNzUtLjI2NGE3Ljk1Myw3Ljk1MywwLDAsMS0uNDE5LS43NDFjLS4wNTYtLjExMi0uMTA5LS4yMjctLjE2MS0uMzQyLjAyNy4wNjEuMTQ0LjQuMDMyLjA2My0uMDc2LS4yMzMtLjE2LS40NjEtLjIyNC0uNy0uMDUtLjE4Ny0uMDktLjM3NS0uMTI5LS41NjQtLjAwNy0uMDM2LS4wNzUtLjUtLjAzMS0uMTU3LjA0My4zMzEtLjAxLS4xNjMtLjAxNC0uMjI4YTEwLjU1OCwxMC41NTgsMCwwLDEsLjAyNy0xLjMzMWMtLjAyNi40NDktLjAxMS4wNjguMDMzLS4xNTVhOC4wNDQsOC4wNDQsMCwwLDEsLjItLjgwNWMuMDU1LS4xNzYuMTI0LS4zNDYuMTgyLS41MjEuMTQtLjQyNS0uMTY0LjI2OC0uMDEyLjAzMy4wNi0uMDk0LjEtLjIxMS4xNTEtLjMxMXEuMTQyLS4yNzYuMzA2LS41NDFjLjA3MS0uMTE1LjU0OS0uNzY0LjItLjMzMmE4LjM4OSw4LjM4OSwwLDAsMSwuODQ5LS45MTljLjA3Ni0uMDY5LjU1Ni0uNDYzLjMzNC0uMjk0LS4yNjEuMi4xMTUtLjA3Ny4xMzktLjA5My4xMTktLjA3Ny4yMzYtLjE1Ny4zNTgtLjIzLjItLjEyNC40MTQtLjIzOS42MjgtLjM0My4wMjUtLjAxMi40Ni0uMi4xNTgtLjA3Ny0uMjg1LjExOC4xODItLjA2My4yNC0uMDgyYTcuNjI2LDcuNjI2LDAsMCwxLC43ODgtLjIyNmMuMTc2LS4wNDEuODcxLS4xMy4zNzUtLjA4NGExMi43MjgsMTIuNzI4LDAsMCwxLDEuNzc5LS4wMThjLjA4NiwwLC4zOTIuMDQ3LS4wMjMtLjAxMS4xNzQuMDI0LjM0Ny4wNTUuNTE5LjA4OS4zNTkuMDcxLjcxMi4xNjUsMS4wNjMuMjdhMiwyLDAsMSwwLDEuMDYzLTMuODU3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNDAuNzkzLDExOC40NTljLS4wNzYtLjUzNC0uMDMtLjIzMywwLC4wNzkuMDIyLjI2Mi4wNDMuNTIzLjA2Mi43ODUuMDUzLjc0OS4wOTMsMS41LjEyOCwyLjI0OS4wNzUsMS42NDEuMTMsMy4yODkuMDkxLDQuOTMyLS4wMDcuMzIxLS4wMTcuNjQzLS4wMzkuOTY0LS4wMTIuMTg3LS4wMjQuOS0uMDIyLjM2NCwwLC41MjktLjE4MSwwLC4wNzQtLjA0My0uMjgxLjA1Mi0uODE5LjYyNy0xLjExMi44NjMtMi4wMTEsMS42MjQtMy45NjUsMy4zMTYtNS45OCw0LjkzNGExLjk0NSwxLjk0NSwwLDAsMC0uNTE0LDEuOTQ2YzEuMjQ5LDMuNzg5LDIuNjYyLDcuNTI1LDMuNzE2LDExLjM3NmEyLjAyMywyLjAyMywwLDAsMCwyLjkzOCwxLjJjOC4yOTMtNC42MzksMTkuODgyLTkuMzY2LDE5LjYzNi0yMC42MmE2NS4zNzIsNjUuMzcyLDAsMCwwLTIuMzE4LTE0LjYzNSwzNS4zNTMsMzUuMzUzLDAsMCwwLTUuNjgtMTIuNjUzYy0zLjI4LTQuMy03LjE5MS04LjU5Mi0xMi4wMzQtMTEuMTQ2LTIuMjc2LTEuMi00LjMsMi4yNTEtMi4wMTksMy40NTQsMy44NjQsMi4wMzgsNy4wMTYsNS4zMjEsOS43NjIsOC42NjVhMzAuNDY1LDMwLjQ2NSwwLDAsMSw1LjU3OCwxMC44MjQsNzQuOTgzLDc0Ljk4MywwLDAsMSwyLjQ3OSwxMi41ODFjLjI4NiwyLjM4MS41MTIsNC45NDgtLjQyMiw3LjIyMmExMy4xMzksMTMuMTM5LDAsMCwxLTMuNDk0LDQuNTcyYy0zLjkzMSwzLjU2NC04LjkyMyw1LjcxOC0xMy41MDcsOC4yODJsMi45MzgsMS4yYy0xLjA1NC0zLjg1Mi0yLjQ2Ny03LjU4OC0zLjcxNi0xMS4zNzdsLS41MTUsMS45NDZjMi4xNTUtMS43Myw0LjIzOC0zLjU0OSw2LjQtNS4yNywxLjUtMS4xOTEsMS43NjUtMi4zNTQsMS44MzgtNC4xODlhNTMuNiw1My42LDAsMCwwLS40MDYtOS41NiwyLjAxMywyLjAxMywwLDAsMC0yLjQ2LTEuNCwyLjA1NCwyLjA1NCwwLDAsMC0xLjQsMi40NjFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEwNy4wOTIsNzEuMzYyQTIzLjAzNCwyMy4wMzQsMCwwLDAsMTEyLjU3Nyw4Ny40LDE5Ljg3NywxOS44NzcsMCwwLDAsMTQwLjUsODkuNDI1YTExLjQ4OCwxMS40ODgsMCwwLDAsNy42MzUtMi4zOSw3LjI4NCw3LjI4NCwwLDAsMCwyLjc3MS02LjUsNS4yOTQsNS4yOTQsMCwwLDAtMy4wODUtMy44OTUsMTguOTgsMTguOTgsMCwwLDAtNi41NjgtMjIuMTc0Yy04LjktNi4zMjEtMjEuNDc0LTUuNDUxLTI4Ljc4NSwyLjg2NkEyMi40NjEsMjIuNDYxLDAsMCwwLDEwNy4wOTIsNzEuMzYyWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMDkuOTg5LDYwLjgzMWEyMi43MzYsMjIuNzM2LDAsMCwwLTIuNiw3LjUsMzguMDcxLDM4LjA3MSwwLDAsMCwxNS42MzgtMS44ODUsMS4wODcsMS4wODcsMCwwLDEsLjg2MS4wNzRjLjYzMS4zNTUtLjEzMSwxLjczMy0uNDg3LDIuMzYzLDIuMjQuNjMxLDcuNzI1LS40LDEwLjE0OS0xLjczMiwxLjM0OCwzLjI3NiwyLjcyMyw0Ljk4Myw1LjM2NSw2LjIyTDE0Ni4wMSw3Ni4yYTUuMDU5LDUuMDU5LDAsMCwxLDEuODEzLjQ0NSwxOC45OTQsMTguOTk0LDAsMCwwLTYuNTc0LTIyLjE3N2MtOC45LTYuMzIxLTIxLjQ3NC01LjQ1MS0yOC43ODUsMi44NjZBMjAuNTYsMjAuNTYsMCwwLDAsMTA5Ljk4OSw2MC44MzFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE1MC4wNTgsNzYuMzI1YTIxLjE0MywyMS4xNDMsMCwwLDAtNy4wMDYtMjIuOTkxLDI0LjI1MywyNC4yNTMsMCwwLDAtMjMuNjE0LTMuMzA4Yy04LjIsMy4zNjUtMTMuMzQyLDExLjAyMS0xNC4yMzQsMTkuNzI5YTI0LjYzMiwyNC42MzIsMCwwLDAsMTAuMDEyLDIyLjYzOGM4LjE4Niw1LjcxNiwyMC4wMjMsNC43MSwyNy4yNjMtMi4wNzUsMS44ODMtMS43NjQtLjk1LTQuNTg4LTIuODI4LTIuODI4YTE4LjIxLDE4LjIxLDAsMCwxLTIwLjA0MiwyLjg2MmMtNi43MzItMy4zNjItMTAuNDkxLTEwLjU4Ni0xMC41MzItMTcuOTYxLS4wMzktNy4wODksMy4zMzQtMTMuOTg4LDkuNTgzLTE3LjU3YTIwLjEsMjAuMSwwLDAsMSwxOS42Mi4xMjlBMTcuMTgxLDE3LjE4MSwwLDAsMSwxNDYuMiw3NS4yNjFjLS43OTIsMi40NTYsMy4wNjksMy41MDgsMy44NTcsMS4wNjRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE0Ni4wMSw3OC4yYy40NzEuMDMzLS4yMTktLjA4Ny4yLjAyMi4xNzguMDQ3LjM1OC4wODQuNTM0LjE0MS4xLjAzMy41MS4yMjguMjA3LjA3My4xNjUuMDg0LjMyOS4xNy40ODYuMjY3LjA3Mi4wNDUuNDY0LjMyOS4yLjExN2E1LjE5Miw1LjE5MiwwLDAsMSwuNDEyLjM3Myw0Ljg0OCw0Ljg0OCwwLDAsMSwuMzcyLjQxM2MtLjIzNC0uMy4wNzIuMTM0LjExMy4yYTQuODIsNC44MiwwLDAsMSwuMjYxLjQ5MmMtLjE2LS4zNTYuMDM0LjEzOS4wNTcuMjJhNC4xMjMsNC4xMjMsMCwwLDEsLjEyMy41NWMtLjA1Ny0uMzk1LS4wMDYuMTU5LDAsLjI0MiwwLC4yLS4wMDkuMzktLjAyLjU4NS0uMDI0LjQ0Ny4wNjgtLjE1Mi0uMDQyLjI0Ny0uMDg5LjMyNi0uMjYzLjk1Ni0uMzIxLDEuMDkxYTYuODYyLDYuODYyLDAsMCwxLTEuMDY0LDEuNjM3LDUuODc0LDUuODc0LDAsMCwxLTEuNzM0LDEuMzM4LDcuOTc2LDcuOTc2LDAsMCwxLTIuMTQ4Ljg4NSwxMS41NTUsMTEuNTU1LDAsMCwxLTEuMjc1LjI4M3EtLjIxMy4wMzMsMCwwYy0uMTA2LjAxMi0uMjEyLjAyMy0uMzE4LjAzMS0uMjQ1LjAyMS0uNDg5LjAzMi0uNzM1LjAzOGEyLDIsMCwwLDAsMCw0YzQuNzcxLS4xMTcsOS41OTItMi43LDExLjIxMy03LjM4YTcuNDU4LDcuNDU4LDAsMCwwLS42ODktNi41MTRBNy41NjcsNy41NjcsMCwwLDAsMTQ2LjAxLDc0LjJhMi4wMSwyLjAxLDAsMCwwLTIsMiwyLjA0OSwyLjA0OSwwLDAsMCwyLDJaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTExOS43MDgsNzguNjM3YTMuMTYyLDMuMTYyLDAsMCwxLTEuMjksMi4zODIsMi40NTksMi40NTksMCwwLDEtMS44MTEuMzQzLDIuNzYsMi43NiwwLDAsMS0xLjk5My0xLjUsMy4yMjgsMy4yMjgsMCwwLDEsLjgtMy43MTQsMi41NTUsMi41NTUsMCwwLDEsMy40NzQuMTkxQTIuODQ1LDIuODQ1LDAsMCwxLDExOS43MDgsNzguNjM3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMzEuODY3LDgxLjEyMWEzLjE3MiwzLjE3MiwwLDAsMS0xLjI5LDIuMzgyLDIuNDY0LDIuNDY0LDAsMCwxLTEuODEyLjM0MiwyLjc1NiwyLjc1NiwwLDAsMS0xLjk5Mi0xLjUsMy4yMjgsMy4yMjgsMCwwLDEsLjgtMy43MTQsMi41NTQsMi41NTQsMCwwLDEsMy40NzMuMTkxQTIuODUsMi44NSwwLDAsMSwxMzEuODY3LDgxLjEyMVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTMxLjYyNSw2Ny42ODRhMTcuNDEyLDE3LjQxMiwwLDAsMCwyLjY4Niw0LjcyOCwxMC42NDIsMTAuNjQyLDAsMCwwLDMuNiwyLjY4OCwyLjE1NiwyLjE1NiwwLDAsMCwxLjU0MS4yLDIsMiwwLDAsMCwuNDc4LTMuNjU1LDEwLjQ2LDEwLjQ2LDAsMCwxLTEuOTE1LTEuMTQ4bC40LjMxM2E4Ljc4Niw4Ljc4NiwwLDAsMS0xLjU0My0xLjU1OGwuMzEyLjRhMTUuMDEsMTUuMDEsMCwwLDEtMS43ODctMy4yMjlsLjIuNDc4Yy0uMDQtLjA5NS0uMDgtLjE5LS4xMTktLjI4NWEyLjIsMi4yLDAsMCwwLS45MTktMS4xOTUsMiwyLDAsMCwwLTIuNzM3LjcxNywxLjkyOSwxLjkyOSwwLDAsMC0uMiwxLjU0MVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTMyLjU0NCw2NS40MjZjLTIuMjgzLDEuMi02LjE4NywyLjEzNS04LjYwOCwxLjUzbDEuMTk1LDIuOTM4Yy43Ny0xLjM3NiwxLjYxLTMuMjg5LjMyNC00LjY1LTEuNDg2LTEuNTcyLTMuNi0uNDY1LTUuMywwYTM3Ljc1NCwzNy43NTQsMCwwLDEtMTIuMTEyLDEuMTM2Yy0yLjU3Mi0uMTQyLTIuNTY0LDMuODU4LDAsNGE0My40NTUsNDMuNDU1LDAsMCwwLDguMTE5LS4yNzljMS4yNjgtLjE2OCwyLjUyNy0uMzg0LDMuNzczLS42NzVxLjk2OS0uMjI3LDEuOTIzLS41MDUuNTM1LS4xNTYsMS4wNjQtLjMyOWMuMTQyLS4wNDUuMjg0LS4wOTIuNDI1LS4xNDFxLjQyLS4xNDUuMDEsMGwtLjg4Mi0uNTE0LjE0OS4xMzUtLjUxNC0uODgzYy0uMi0uNDc4LjE3NC0uNDM2LS4wNTMtLjAzNS0uMTM0LjIzNi0uMjQ5LjQ4NC0uMzgyLjcyMWEyLjAyMiwyLjAyMiwwLDAsMCwxLjE5NSwyLjkzOCwxNC41MjIsMTQuNTIyLDAsMCwwLDUuOS0uMSwxOS4zNTMsMTkuMzUzLDAsMCwwLDUuNzk0LTEuODMzYzIuMjc4LTEuMi4yNTktNC42NTUtMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE0Mi44NzUsMTI1LjQ5MUExMTguNDQyLDExOC40NDIsMCwwLDAsMTU2LjksMTI2LjlhMiwyLDAsMCwwLDAtNCwxMTAuNjE5LDExMC42MTksMCwwLDEtMTIuOTYzLTEuMjYyLDIuMDYzLDIuMDYzLDAsMCwwLTIuNDYsMS40LDIuMDE2LDIuMDE2LDAsMCwwLDEuNCwyLjQ2WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk05NC41NzksMTA2LjMxMWwxMS41OCw3LjUyN2EyLjAxNCwyLjAxNCwwLDAsMCwyLjczNi0uNzE3LDIuMDQ1LDIuMDQ1LDAsMCwwLS43MTctMi43MzdMOTYuNiwxMDIuODU3YTIuMDE2LDIuMDE2LDAsMCwwLTIuNzM3LjcxNywyLjA0NiwyLjA0NiwwLDAsMCwuNzE4LDIuNzM3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMDQuMjcyLDI5LjM1MWMuMzQ4LDAsLjY4Ni4wMjMsMS4wMjMuMDVhMTUuMjgyLDE1LjI4MiwwLDAsMSwyNi41ODksMS4zYy40ODctLjA0NC45ODItLjA3MiwxLjQ4OC0uMDcyQTE0LjU5LDE0LjU5LDAsMCwxLDI0OC4yNSw0NS40MmMwLDguOTIxLTYuMjExLDE1LjA2NC0xNC44NzksMTUuMDY0YTE1LjAzNSwxNS4wMzUsMCwwLDEtOS44NzEtMy4zMzksMTEuNjQ2LDExLjY0NiwwLDAsMS03LjY2MiwyLjY2OGMtNS4zNzQsMC05LjMwNi0yLjg0OS0xMC44NDUtNy4yOS0uMjQuMDEzLS40NzYuMDMzLS43MjEuMDMzLTcsMC0xMS41NjYtNC44MjEtMTEuNTY2LTExLjcxQTExLjMzMiwxMS4zMzIsMCwwLDEsMjA0LjI3MiwyOS4zNTFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTI4NS4xNjEsODkuOTQ4Yy4yNzEsMCwuNTM0LjAxOC44LjAzOUExMS45LDExLjksMCwwLDEsMzA2LjY2NSw5MWMuMzgtLjAzNC43NjUtLjA1NiwxLjE1OS0uMDU2YTExLjM2MywxMS4zNjMsMCwwLDEsMTEuNTg4LDExLjUxN2MwLDYuOTQ4LTQuODM4LDExLjczMi0xMS41ODksMTEuNzMyYTExLjcxLDExLjcxLDAsMCwxLTcuNjg3LTIuNiw5LjA3MSw5LjA3MSwwLDAsMS01Ljk2OCwyLjA3OGMtNC4xODUsMC03LjI0Ny0yLjIyLTguNDQ2LTUuNjc4LS4xODcuMDEtLjM3MS4wMjUtLjU2Mi4wMjUtNS40NDksMC05LjAwNy0zLjc1NC05LjAwNy05LjEyQTguODI1LDguODI1LDAsMCwxLDI4NS4xNjEsODkuOTQ4WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xOS41NjgsMi40MjhhMTguOCwxOC44LDAsMCwxLDIyLjczNywxNC42MWMyLjQxLDExLjIzOC0zLjc1NiwyMC42NTUtMTQuNjc1LDIzQzE2LjI5MSw0Mi40NjUsNy4yMTEsMzYuMjQxLDQuODE3LDI1LjA3NUExOC43ODEsMTguNzgxLDAsMCwxLDE5LjU2OCwyLjQyOFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjAuMSw0LjM1N2ExNi45NzQsMTYuOTc0LDAsMCwxLDE4LjUxMSw4LjM3MmMzLjMyNSw2LjA5LDMuMDYzLDE0LjQ2LTEuNjE1LDE5Ljc5NEExOC45LDE4LjksMCwwLDEsMTcuNDQ5LDM3LjdjLTYuNjA5LTIuMi0xMC43LTkuMDI0LTExLjA1LTE1Ljc4QTE3LjEwNiwxNy4xMDYsMCwwLDEsOS42ODQsMTAuOCwxNy41MTMsMTcuNTEzLDAsMCwxLDIwLjEsNC4zNTdDMjIuNjExLDMuOCwyMS41NDgtLjA2MSwxOS4wMzcuNUEyMS4wMjgsMjEuMDI4LDAsMCwwLDIuNDY5LDE4Ljk2N0MxLjYzOSwyNy4zNDYsNiwzNi42MDgsMTMuNjczLDQwLjQyOWM3Ljc4MywzLjg3NywxNy44ODQsMi4yODYsMjQuNDA5LTMuMzUsNi42MDgtNS43MDcsOC4zMzQtMTUuNDgxLDUuMjkxLTIzLjQ4N0EyMS4xNjksMjEuMTY5LDAsMCwwLDM0LjE5NCwyLjY2NywyMS41ODQsMjEuNTg0LDAsMCwwLDE5LjAzNy41QzE2LjUxNywxLjAxNywxNy41ODMsNC44NzQsMjAuMSw0LjM1N1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMzguNSw2NC44N3EtMS4zMDYtNS4xMi0yLjYxMi0xMC4yNGEyLDIsMCwwLDAtMy44NTcsMS4wNjNxMS4zMDUsNS4xMjEsMi42MTIsMTAuMjQxQTIsMiwwLDAsMCwzOC41LDY0Ljg3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMi40NDIsNTYuNzA5cS0xLjIyNiwxMy4wNDctMi40MzEsMjYuMWEyLjAxNSwyLjAxNSwwLDAsMCwyLDIsMi4wNDMsMi4wNDMsMCwwLDAsMi0ycTEuMjE1LTEzLjA0OSwyLjQzMS0yNi4xYTIuMDE1LDIuMDE1LDAsMCwwLTItMiwyLjA0MywyLjA0MywwLDAsMC0yLDJaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTcwLjg2NSwxMC41OTIsNTkuNjc5LDEyLjY2N2EyLjAxLDIuMDEsMCwwLDAtMS40LDIuNDYsMi4wNTIsMi4wNTIsMCwwLDAsMi40NiwxLjRsMTEuMTg2LTIuMDc1YTIuMDExLDIuMDExLDAsMCwwLDEuNC0yLjQ2MSwyLjA1MywyLjA1MywwLDAsMC0yLjQ2LTEuNFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNODMuNSwzOC42MTJxLTExLjktMy42NzgtMjMuOC03LjM2NGMtMi40NjUtLjc2Mi0zLjUxOSwzLjEtMS4wNjMsMy44NTdxMTEuOSwzLjY3NSwyMy44LDcuMzY0YzIuNDY1Ljc2MiwzLjUxOS0zLjEsMS4wNjMtMy44NTdaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTYzLjU2OSw2MC4wMzNxLTYuNDIyLTYuNjU2LTEyLjgzOC0xMy4zMTRBMiwyLDAsMCwwLDQ3LjksNDkuNTQ3UTU0LjMyLDU2LjIwNiw2MC43NCw2Mi44NjJhMiwyLDAsMCwwLDIuODI5LTIuODI5WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMDQuMjcyLDMxLjM1MWMuMzQzLjAwNy42ODEuMDI1LDEuMDIzLjA1YTEuOTksMS45OSwwLDAsMCwxLjcyNy0uOTkxLDEzLjIsMTMuMiwwLDAsMSwxMi4zNzItNi4xLDEyLjk0MiwxMi45NDIsMCwwLDEsMTAuNzYzLDcuNCwxLjk0MywxLjk0MywwLDAsMCwxLjcyNy45OSwxMy40NjEsMTMuNDYxLDAsMCwxLDkuNjU4LDIuNjgxLDEyLjgzMSwxMi44MzEsMCwwLDEsNC42MTEsOC4yNzlDMjQ3LDUwLjE5MywyNDMuMzI2LDU2LjUyLDIzNi44LDU4LjFhMTMuOTc3LDEzLjk3NywwLDAsMS0xMS44ODItMi4zNjcsMi4wNzYsMi4wNzYsMCwwLDAtMi44MjgsMGMtNC44MTEsMy45NDgtMTMsMi4yMzctMTUuMTY1LTMuNzM5YTIuMDUzLDIuMDUzLDAsMCwwLTEuOTI4LTEuNDY5LDkuOTU4LDkuOTU4LDAsMCwxLTcuMTgyLTIuMTQ2LDkuNSw5LjUsMCwwLDEtMy4wOC02LjY2Nyw5LjUzNyw5LjUzNywwLDAsMSw5LjU0MS0xMC4zNTljMi41NzItLjAzNSwyLjU3OS00LjAzNSwwLTRhMTMuNTMzLDEzLjUzMywwLDAsMC0xMi45NjUsOS40MzJjLTEuNjczLDUuNC4wNzEsMTEuOCw0LjY0OSwxNS4yYTEzLjksMTMuOSwwLDAsMCw5LjAzNywyLjUzOGwtMS45MjktMS40NjhhMTIuODI3LDEyLjgyNywwLDAsMCw4LjUsOC4xNzEsMTQuNjA1LDE0LjYwNSwwLDAsMCwxMy4zNTItMi42NjdoLTIuODI4YzYuOTQsNS42ODMsMTguNDM3LDUuMjg5LDI0LjI5MS0xLjg0OWExNy43NDYsMTcuNzQ2LDAsMCwwLS44NTMtMjMuMDg4LDE3LjA3NCwxNy4wNzQsMCwwLDAtMTMuNjQtNC45MThsMS43MjcuOTkxYTE2Ljk1OSwxNi45NTksMCwwLDAtMTQuMjE3LTkuMzg2LDE3LjE4MSwxNy4xODEsMCwwLDAtMTUuODI2LDguMDgybDEuNzI3LS45OWMtLjM0Mi0uMDI1LS42OC0uMDQzLTEuMDIzLS4wNUMyMDEuNywyNy4zLDIwMS43LDMxLjMsMjA0LjI3MiwzMS4zNTFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTI4NS4xNjEsOTEuOTQ4Yy4yNjYsMCwuNTMxLjAxNS44LjAzOUExLjk5MywxLjk5MywwLDAsMCwyODcuNjg0LDkxYTkuODI3LDkuODI3LDAsMCwxLDkuMTMtNC41NCw5LjY2LDkuNjYsMCwwLDEsOC4xMjQsNS41NTYsMS45NDUsMS45NDUsMCwwLDAsMS43MjcuOTksOS44MzcsOS44MzcsMCwwLDEsOC43MzQsMy40OSwxMC4yMzUsMTAuMjM1LDAsMCwxLDEuNjQsOC45MjgsOC44ODcsOC44ODcsMCwwLDEtNS40NDksNi4xMjYsMTAuNTkzLDEwLjU5MywwLDAsMS0xMC4wNC0xLjM2NSwyLjA3OSwyLjA3OSwwLDAsMC0yLjgyOSwwYy0zLjUsMi44NDctOS40ODIsMS42MS0xMS4wNzEtMi43MTdBMi4wNTMsMi4wNTMsMCwwLDAsMjg1LjcyMiwxMDZjLTQuMDEuMjMzLTcuMy0yLjI3OS03LjU0OS02LjRhNi45ODcsNi45ODcsMCwwLDEsNi45ODgtNy42NDNjMi41NzEtLjA0NSwyLjU3OS00LjA0NSwwLTRhMTEuMDEsMTEuMDEsMCwwLDAtMTAuOTg4LDExLjY0M0ExMC43NzcsMTAuNzc3LDAsMCwwLDI4NS43MjIsMTEwbC0xLjkyOS0xLjQ2OGExMC40NzgsMTAuNDc4LDAsMCwwLDcuMDA4LDYuNywxMS44NTgsMTEuODU4LDAsMCwwLDEwLjc0OS0yLjIxNWgtMi44MjljNS41NjQsNC41MjIsMTQuNjU1LDQuMzI2LDE5LjQ0MS0xLjMxN2ExNC4yNjIsMTQuMjYyLDAsMCwwLS41NjEtMTguNzNBMTMuNzQyLDEzLjc0MiwwLDAsMCwzMDYuNjY1LDg5bDEuNzI3Ljk5MWExMy42NzcsMTMuNjc3LDAsMCwwLTExLjU3OC03LjUzNywxMy44MjksMTMuODI5LDAsMCwwLTEyLjU4NCw2LjUyMmwxLjcyNy0uOTkxYy0uMjY1LS4wMjQtLjUzLS4wMzYtLjgtLjAzOUMyODIuNTg2LDg3Ljg3NSwyODIuNTg4LDkxLjg3NSwyODUuMTYxLDkxLjk0OFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjIxLjI0NCwxMjIuMTcxYzAsMy4yLTIuMjMxLDYuMzY0LTYuNDE4LDguNzgyYTMxLjcyNSwzMS43MjUsMCwwLDEtMzAuNzMzLjEwOWMtNC41NzUtMi42NDEtNi44MTYtNS44NjEtNi42NzItOS4wODQuMDM5LTMuMDkyLDIuMjgtNi4xNiw2LjY3LTguN2wzMC43MzUuMTE1YzQuMTg5LDIuNDE5LDYuNDE5LDUuNTcxLDYuNDE5LDguNzc1XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImRcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIxMi4zMTQsMTExLjQ0MWMtMi45LTMuNTg3LTcuNDA2LTUuNzE4LTEyLjk4Mi01LjcxOC03LjUzMywwLTEzLjQwNiw0LjE1OC0xNS42MzcsMTAuN2E0LjU3MSw0LjU3MSwwLDAsMCwxLjE4MiwxLjM4Niw1Ljg0OSw1Ljg0OSwwLDAsMCwzLjY0NSwxLjAxMSwxMi43NjUsMTIuNzY1LDAsMCwxLDEuMzEzLjEsMTcuODQ1LDE3Ljg0NSwwLDAsMCwxOS4zLS4wMTcsNy43Nyw3Ljc3LDAsMCwxLDEuMDA3LS4wODUsNS44MjksNS44MjksMCwwLDAsMy42NDUtMS4wMTEsNC41NTcsNC41NTcsMCwwLDAsMS4yLTEuNDI2QTE1LjcsMTUuNywwLDAsMCwyMTIuMzE0LDExMS40NDFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIxNy45NDUsMTIyLjU0M2MtLjA1Ny03LjMxMS0zLjYzMi0xNC4yNjItMTAuNTU0LTE3LjIyNC03LjA5Mi0zLjAzNC0xNi4xOTUtMS44LTIxLjYyNSwzLjg4N2ExOS4zNDgsMTkuMzQ4LDAsMCwwLTUuMDQ2LDEzLjE4NWMtLjA0NiwyLjU3NSwzLjk1NCwyLjU3Niw0LDAsLjEyMS02Ljc0Niw0LTEyLjYsMTAuNzI0LTE0LjIyNiw1LjU2Ni0xLjM0NiwxMi4xNDMuMTkxLDE1LjY1MSw0Ljk1MWExNS45MTYsMTUuOTE2LDAsMCwxLDIuODUsOS40MjdjLjAyLDIuNTczLDQuMDIsMi41NzksNCwwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xOTMuNzYsMTEwLjIyNWE1Ny4xOCw1Ny4xOCwwLDAsMC01LjI3OC04Ljg5MiwyLjA0OCwyLjA0OCwwLDAsMC0yLjczNy0uNzE4LDIuMDIzLDIuMDIzLDAsMCwwLS43MTcsMi43MzcsNTcuMSw1Ny4xLDAsMCwxLDUuMjc4LDguODkyLDIuMDExLDIuMDExLDAsMCwwLDIuNzM3LjcxOCwyLjA1NCwyLjA1NCwwLDAsMCwuNzE3LTIuNzM3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xODkuNjMzLDEyMS4xNTZhMjAuMTc3LDIwLjE3NywwLDAsMCwxOS40LjE2N2MyLjI2NS0xLjIyNy4yNDctNC42ODItMi4wMTktMy40NTRhMTYuMDMxLDE2LjAzMSwwLDAsMS0xNS4zNjEtLjE2N2MtMi4yNDMtMS4yNzEtNC4yNjEsMi4xODQtMi4wMTksMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIxMy44MTYsMTE1LjExOGMuNDg5LjI4NS45NjkuNTg1LDEuNDMzLjkwOHEuMTgxLjEyNi4zNjEuMjU4Yy4wNDkuMDM2LjM4MS4yOTMuMTQ0LjEwNnMuMDg1LjA3LjEzMy4xMDlxLjE2Mi4xMzIuMzIxLjI3YTEzLjc2NSwxMy43NjUsMCwwLDEsMS4wMi45NzJxLjI0Mi4yNTUuNDY5LjUyNWMuMDY3LjA3OS4xMzEuMTYxLjIuMjQxLjEyNS4xNS0uMjc5LS4zNzgtLjAxNS0uMDE0YTkuODQyLDkuODQyLDAsMCwxLC42NjUsMS4wNDdjLjEuMTgzLjE5LjM3MS4yOC41NTkuMTQyLjMtLjAyMi4wMTMtLjA0Ny0uMTE5YTIuNDA4LDIuNDA4LDAsMCwwLC4xMTYuMzA5LDcuNTM5LDcuNTM5LDAsMCwxLC4zMDgsMS4xNDZjLjAxNS4wODMuMDU4LjQxNC4wMTQuMDQ5cy0uMDA3LS4wMzUsMCwuMDQ5Yy4wMTkuMjExLjAyNy40MjIuMDI5LjYzM2EyLDIsMCwwLDAsNCwwYy0uMDM2LTQuNjkzLTMuNTk1LTguMjgtNy40MS0xMC41YTIsMiwwLDAsMC0yLjAxOSwzLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTgzLjA4MSwxMTEuNTQ5Yy0zLjgyNCwyLjIzMi03LjYyNCw1Ljc1NS03LjY2MSwxMC41MTNhMiwyLDAsMCwwLDQsMGMwLS4yLjAxLS40LjAyOC0uNi4wMDgtLjA4Ni4wNDUtLjQwNiwwLS4wMzZzMCwuMDUxLjAxMy0uMDM1YTcuMDU4LDcuMDU4LDAsMCwxLC4zLTEuMWMuMDM1LS4xLjA4NS0uMi4xMTQtLjMtLjE1OS41MzctLjEuMjM2LS4wMjguMDgzcy4xNjMtLjMzLjI1Mi0uNDkxYTEwLjczMywxMC43MzMsMCwwLDEsLjcyNS0xLjExNGMuMTQyLS4yLS4yODEuMzQ0LS4wNTIuMDcuMDc5LS4xLjE1Ny0uMTkuMjM4LS4yODRxLjIzLS4yNjYuNDc0LS41MTdjLjM0NC0uMzU1LjcwOC0uNjkxLDEuMDg1LTEuMDFxLjEzNS0uMTE0LjI3My0uMjI1Yy4wNzgtLjA2NC40MDktLjM4OS4wNTEtLjA0NGE1LjMxMiw1LjMxMiwwLDAsMSwuNjY3LS40ODJjLjUtLjM0NywxLjAxNy0uNjY5LDEuNTQyLS45NzVhMiwyLDAsMSwwLTIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJiXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNzcuOTc5LDEyNy4yNjRhMjUuODMsMjUuODMsMCwwLDEtLjU2LTUuMDljMCwuMDM1LDAsLjA2OSwwLC4xLDAsMy4xMjMsMi4yNDIsNi4yMjUsNi42NzUsOC43ODRhMzEuNzI1LDMxLjcyNSwwLDAsMCwzMC43MzMtLjEwOWM0LjE4Ny0yLjQxOCw2LjQxOC01LjU3Nyw2LjQxOC04Ljc4MiwwLS4wNDIsMC0uMDg0LDAtLjEyNy0uMSwxMi45MzMtOC43MzIsMjEuOTYtMjEuOTEyLDIxLjk2LTEwLjEzOCwwLTE3Ljk5NS01LjcwNy0yMC44LTE0LjYzOFExNzguMjEsMTI4LjM0MiwxNzcuOTc5LDEyNy4yNjRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIxOS4yNDQsMTIxLjgxOGMtLjA0Niw3LjgxOS0zLjcsMTUuMzE1LTExLjE0MywxOC41MTEtNy41NDIsMy4yMzktMTcuMzQ0LDEuOTU0LTIzLjE4NC0zLjk5MWEyMC41ODgsMjAuNTg4LDAsMCwxLTUuNS0xNC4zMmMtLjAzOS0yLjU3MS00LjAzOS0yLjU3OS00LDBhMjUuMjI1LDI1LjIyNSwwLDAsMCw1LjM5MSwxNS43MTMsMjIuNTEyLDIyLjUxMiwwLDAsMCwxMiw3LjQ4OGM5LjQxLDIuMzQ0LDIwLjAxLS40NTEsMjUuODg1LTguNDE1YTI1LjQyMiwyNS40MjIsMCwwLDAsNC41NDYtMTQuOTg2Yy4wMTUtMi41NzQtMy45ODUtMi41NzctNCwwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNzUuNDE4LDEyMi4yNzhjLjE3OCw4LjE0OSwxMC4wMTYsMTIuNTY5LDE2LjgyNCwxMy45NzFhMzMuNzI0LDMzLjcyNCwwLDAsMCwyMy45OC0zLjhjMy43LTIuMjQ3LDYuOTIzLTUuNzQsNy4wMjItMTAuMjguMDU2LTIuNTc1LTMuOTQ0LTIuNTc0LTQsMC0uMDYzLDIuOS0yLjM2Niw1LjEyOS00LjY2NSw2LjU5M2EyNy41NDIsMjcuNTQyLDAsMCwxLTkuNDYxLDMuNjYzLDI5LjIyMSwyOS4yMjEsMCwwLDEtMTkuODQ0LTIuOTk0Yy0yLjYyNC0xLjQ5LTUuNzgzLTMuODI3LTUuODU2LTcuMTU1LS4wNTUtMi41Ny00LjA1Ni0yLjU3OS00LDBaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L3N2Zz5cXHJcXG4gICAgICAgICAgICA8L2gxPlxcclxcblxcclxcbiAgICAgICAgICAgIDxkaXYgZGF0YS1hcHA9XFxcInNlYXJjaC1ib29rLWluLWxpc3RcXFwiIGNsYXNzPVxcXCJsaXN0LXNlYXJjaCBmbGV4IG1yZ24tYm90dG9tLTQwMCBwb3MtcmVsXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJsaXN0LXNlYXJjaF9faW5wdXQgZmxleFxcXCIgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlNlYXJjaCBpbiB5b3VyIGxpc3QuLi5cXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNlYXJjaF9faWNvbi1ncm91cCBmbGV4IGFpLWNlbnRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgaGVpZ2h0PVxcXCI0OFxcXCIgdmlld0JveD1cXFwiMCAtOTYwIDk2MCA5NjBcXFwiIHdpZHRoPVxcXCI0OFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTc5Ni0xMjEgNTMzLTM4NHEtMzAgMjYtNjkuOTU5IDQwLjVUMzc4LTMyOXEtMTA4LjE2MiAwLTE4My4wODEtNzVRMTIwLTQ3OSAxMjAtNTg1dDc1LTE4MXE3NS03NSAxODEuNS03NXQxODEgNzVRNjMyLTY5MSA2MzItNTg0Ljg1IDYzMi01NDIgNjE4LTUwMnEtMTQgNDAtNDIgNzVsMjY0IDI2Mi00NCA0NFpNMzc3LTM4OXE4MS4yNSAwIDEzOC4xMjUtNTcuNVQ1NzItNTg1cTAtODEtNTYuODc1LTEzOC41VDM3Ny03ODFxLTgyLjA4MyAwLTEzOS41NDIgNTcuNVExODAtNjY2IDE4MC01ODV0NTcuNDU4IDEzOC41UTI5NC45MTctMzg5IDM3Ny0zODlaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYXBwPVxcXCJzZWFyY2gtaW4tbGlzdC1sb2FkZXJcXFwiIGNsYXNzPVxcXCJsaXN0LXNlYXJjaF9faWNvbi1ncm91cF9fbG9hZGVyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbHRlci1jb250YWluZXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImZpbHRlci1idXR0b24gcG9zLXJlbFxcXCIgZGF0YS1hcHA9XFxcImZpbHRlci1idXR0b25cXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiNDhcXFwiIHZpZXdCb3g9XFxcIjAgLTk2MCA5NjAgOTYwXFxcIiB3aWR0aD1cXFwiNDhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNNDQwLTE2MHEtMTcgMC0yOC41LTExLjVUNDAwLTIwMHYtMjQwTDE2MS03NDVxLTE0LTE3LTQtMzZ0MzEtMTloNTg0cTIxIDAgMzEgMTl0LTQgMzZMNTYwLTQ0MHYyNDBxMCAxNy0xMS41IDI4LjVUNTIwLTE2MGgtODBabTQwLTI3NiAyNDAtMzA0SDI0MGwyNDAgMzA0Wm0wIDBaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgZGF0YS1hcHA9XFxcImZpbHRlci1vcHRpb25zXFxcIiBjbGFzcz1cXFwiZmlsdGVyLW9wdGlvbnMgcG9zLWFicyBmbGV4IGZsZXgtY29sdW1uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGRhdGEtZmlsdGVyPVxcXCJSZWFkXFxcIiBjbGFzcz1cXFwiZmxleCBhaS1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmxleCBhaS1jZW50ZXIgamMtc2JcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInJlYWRcXFwiIG5hbWU9XFxcInJlYWRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XFxcIjE2XFxcIiBoZWlnaHQ9XFxcIjE1XFxcIiB2aWV3Qm94PVxcXCIwIDAgMTYgMTVcXFwiIGZpbGw9XFxcIm5vbmVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVxcXCIxNVxcXCIgaGVpZ2h0PVxcXCIxNVxcXCIgZmlsbD1cXFwiIzZCNzA1Q1xcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0wLjUgNC41TDQuNSAwLjVMMC41IDguNUwxMC41IDAuNUwwLjUgMTRMMTQgMC41TDUuNSAxNEwxNCA2TDEwLjUgMTRMMTUgMTAuNVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cXFwiI0ZGRDk3MFxcXCIgc3Ryb2tlLWRhc2hvZmZzZXQ9XFxcIjEwNlxcXCIgc3Ryb2tlLWRhc2hhcnJheT1cXFwiMTA2XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtZmlsdGVyLW5hbWU+UmVhZDwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZGF0YS1maWx0ZXI9XFxcIkN1cnJlbnRseSBSZWFkaW5nXFxcIiBjbGFzcz1cXFwiZmxleCBhaS1jZW50ZXJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmxleCBhaS1jZW50ZXIgamMtc2JcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcImN1cmVudGx5LXJlYWRpbmdcXFwiIG5hbWU9XFxcImN1cmVudGx5LXJlYWRpbmdcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XFxcIjE2XFxcIiBoZWlnaHQ9XFxcIjE1XFxcIiB2aWV3Qm94PVxcXCIwIDAgMTYgMTVcXFwiIGZpbGw9XFxcIm5vbmVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVxcXCIxNVxcXCIgaGVpZ2h0PVxcXCIxNVxcXCIgZmlsbD1cXFwiIzZCNzA1Q1xcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0wLjUgNC41TDQuNSAwLjVMMC41IDguNUwxMC41IDAuNUwwLjUgMTRMMTQgMC41TDUuNSAxNEwxNCA2TDEwLjUgMTRMMTUgMTAuNVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cXFwiI0ZGRDk3MFxcXCIgc3Ryb2tlLWRhc2hvZmZzZXQ9XFxcIjEwNlxcXCIgc3Ryb2tlLWRhc2hhcnJheT1cXFwiMTA2XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtZmlsdGVyLW5hbWU+Q3VycmVudGx5IFJlYWRpbmc8L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGRhdGEtZmlsdGVyPVxcXCJXYW50IHRvIFJlYWRcXFwiIGNsYXNzPVxcXCJmbGV4IGFpLWNlbnRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmbGV4IGFpLWNlbnRlciBqYy1zYlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBpZD1cXFwid2FudC10by1yZWFkXFxcIiBuYW1lPVxcXCJ3YW50LXRvLXJlYWRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XFxcIjE2XFxcIiBoZWlnaHQ9XFxcIjE1XFxcIiB2aWV3Qm94PVxcXCIwIDAgMTYgMTVcXFwiIGZpbGw9XFxcIm5vbmVcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVxcXCIxNVxcXCIgaGVpZ2h0PVxcXCIxNVxcXCIgZmlsbD1cXFwiIzZCNzA1Q1xcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0wLjUgNC41TDQuNSAwLjVMMC41IDguNUwxMC41IDAuNUwwLjUgMTRMMTQgMC41TDUuNSAxNEwxNCA2TDEwLjUgMTRMMTUgMTAuNVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cXFwiI0ZGRDk3MFxcXCIgc3Ryb2tlLWRhc2hvZmZzZXQ9XFxcIjEwNlxcXCIgc3Ryb2tlLWRhc2hhcnJheT1cXFwiMTA2XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtZmlsdGVyLW5hbWU+V2FudCB0byBSZWFkPC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmbGV4IGZpbHRlci1jYXJkc1xcXCI+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8L2hlYWRlcj5cXHJcXG5cXHJcXG4gICAgICAgIDxtYWluIGNsYXNzPVxcXCJncmlkXFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIGFyaWEtbGFiZWw9XFxcIkFkZCBib29rIHRvIGxpc3RcXFwiIGNsYXNzPVxcXCJhZGQtYm9vay1idXR0b24gZmxleCBqYy1jZW50ZXIgYWktY2VudGVyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHN2ZyBkYXRhLWdsb2JhbC1hY3Rpb249XFxcImFkZFxcXCIgY2xhc3M9XFxcImZsZXggYWktY2VudGVyIGpzLWNlbnRlciBtcmduLWJvdHRvbS04MDAgY3Vyc29yLXBvaW50ZXJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiNDhcXFwiIHZpZXdCb3g9XFxcIjAgLTk2MCA5NjAgOTYwXFxcIiB3aWR0aD1cXFwiNDhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNNDUzLTI4MGg2MHYtMTY2aDE2N3YtNjBINTEzdi0xNzRoLTYwdjE3NEgyODB2NjBoMTczdjE2NlptMjcuMjY2IDIwMHEtODIuNzM0IDAtMTU1LjUtMzEuNXQtMTI3LjI2Ni04NnEtNTQuNS01NC41LTg2LTEyNy4zNDFRODAtMzk3LjY4MSA4MC00ODAuNXEwLTgyLjgxOSAzMS41LTE1NS42NTlRMTQzLTcwOSAxOTcuNS03NjN0MTI3LjM0MS04NS41UTM5Ny42ODEtODgwIDQ4MC41LTg4MHE4Mi44MTkgMCAxNTUuNjU5IDMxLjVRNzA5LTgxNyA3NjMtNzYzdDg1LjUgMTI3UTg4MC01NjMgODgwLTQ4MC4yNjZxMCA4Mi43MzQtMzEuNSAxNTUuNVQ3NjMtMTk3LjY4NHEtNTQgNTQuMzE2LTEyNyA4NlE1NjMtODAgNDgwLjI2Ni04MFptLjIzNC02MFE2MjItMTQwIDcyMS0yMzkuNXQ5OS0yNDFRODIwLTYyMiA3MjEuMTg4LTcyMSA2MjIuMzc1LTgyMCA0ODAtODIwcS0xNDEgMC0yNDAuNSA5OC44MTJRMTQwLTYyMi4zNzUgMTQwLTQ4MHEwIDE0MSA5OS41IDI0MC41dDI0MSA5OS41Wm0tLjUtMzQwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9zdmc+XFxyXFxuICAgICAgICAgICAgPC9idXR0b24+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJib29rc1xcXCI+XFxyXFxuICAgICAgICAgICAgPC91bD5cXHJcXG4gICAgICAgIDwvbWFpbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuPC9ib2R5PlxcclxcbjwvaHRtbD5cIjtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IGNvZGU7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiY29uc3QgcmFuZG9tVVVJRCA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5yYW5kb21VVUlEICYmIGNyeXB0by5yYW5kb21VVUlELmJpbmQoY3J5cHRvKTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmFuZG9tVVVJRFxufTsiLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG5sZXQgZ2V0UmFuZG9tVmFsdWVzO1xuY29uc3Qgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pO1xuXG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbn0iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHJldHVybiAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgY29uc3QgdXVpZCA9IHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IG5hdGl2ZSBmcm9tICcuL25hdGl2ZS5qcyc7XG5pbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgaWYgKG5hdGl2ZS5yYW5kb21VVUlEICYmICFidWYgJiYgIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmF0aXZlLnJhbmRvbVVVSUQoKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHVuc2FmZVN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHsgdyBhcyB3cmFwLCByIGFzIHJlcGxhY2VUcmFwcyB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuZXhwb3J0IHsgdSBhcyB1bndyYXAsIHcgYXMgd3JhcCB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuXG4vKipcbiAqIE9wZW4gYSBkYXRhYmFzZS5cbiAqXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBkYXRhYmFzZS5cbiAqIEBwYXJhbSB2ZXJzaW9uIFNjaGVtYSB2ZXJzaW9uLlxuICogQHBhcmFtIGNhbGxiYWNrcyBBZGRpdGlvbmFsIGNhbGxiYWNrcy5cbiAqL1xuZnVuY3Rpb24gb3BlbkRCKG5hbWUsIHZlcnNpb24sIHsgYmxvY2tlZCwgdXBncmFkZSwgYmxvY2tpbmcsIHRlcm1pbmF0ZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKG5hbWUsIHZlcnNpb24pO1xuICAgIGNvbnN0IG9wZW5Qcm9taXNlID0gd3JhcChyZXF1ZXN0KTtcbiAgICBpZiAodXBncmFkZSkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZ3JhZGVuZWVkZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHVwZ3JhZGUod3JhcChyZXF1ZXN0LnJlc3VsdCksIGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIHdyYXAocmVxdWVzdC50cmFuc2FjdGlvbiksIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZykge1xuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcigndmVyc2lvbmNoYW5nZScsIChldmVudCkgPT4gYmxvY2tpbmcoZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIHJldHVybiBvcGVuUHJvbWlzZTtcbn1cbi8qKlxuICogRGVsZXRlIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZURCKG5hbWUsIHsgYmxvY2tlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKG5hbWUpO1xuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIgfTtcbiIsImNvbnN0IGluc3RhbmNlT2ZBbnkgPSAob2JqZWN0LCBjb25zdHJ1Y3RvcnMpID0+IGNvbnN0cnVjdG9ycy5zb21lKChjKSA9PiBvYmplY3QgaW5zdGFuY2VvZiBjKTtcblxubGV0IGlkYlByb3h5YWJsZVR5cGVzO1xubGV0IGN1cnNvckFkdmFuY2VNZXRob2RzO1xuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRJZGJQcm94eWFibGVUeXBlcygpIHtcbiAgICByZXR1cm4gKGlkYlByb3h5YWJsZVR5cGVzIHx8XG4gICAgICAgIChpZGJQcm94eWFibGVUeXBlcyA9IFtcbiAgICAgICAgICAgIElEQkRhdGFiYXNlLFxuICAgICAgICAgICAgSURCT2JqZWN0U3RvcmUsXG4gICAgICAgICAgICBJREJJbmRleCxcbiAgICAgICAgICAgIElEQkN1cnNvcixcbiAgICAgICAgICAgIElEQlRyYW5zYWN0aW9uLFxuICAgICAgICBdKSk7XG59XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkge1xuICAgIHJldHVybiAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgfHxcbiAgICAgICAgKGN1cnNvckFkdmFuY2VNZXRob2RzID0gW1xuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5hZHZhbmNlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWVQcmltYXJ5S2V5LFxuICAgICAgICBdKSk7XG59XG5jb25zdCBjdXJzb3JSZXF1ZXN0TWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uRG9uZU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh3cmFwKHJlcXVlc3QucmVzdWx0KSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHByb21pc2VcbiAgICAgICAgLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIFNpbmNlIGN1cnNvcmluZyByZXVzZXMgdGhlIElEQlJlcXVlc3QgKCpzaWdoKiksIHdlIGNhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWxcbiAgICAgICAgLy8gKHNlZSB3cmFwRnVuY3Rpb24pLlxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJDdXJzb3IpIHtcbiAgICAgICAgICAgIGN1cnNvclJlcXVlc3RNYXAuc2V0KHZhbHVlLCByZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXRjaGluZyB0byBhdm9pZCBcIlVuY2F1Z2h0IFByb21pc2UgZXhjZXB0aW9uc1wiXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgLy8gVGhpcyBtYXBwaW5nIGV4aXN0cyBpbiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYnV0IGRvZXNuJ3QgZG9lc24ndCBleGlzdCBpbiB0cmFuc2Zvcm1DYWNoZS4gVGhpc1xuICAgIC8vIGlzIGJlY2F1c2Ugd2UgY3JlYXRlIG1hbnkgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0LlxuICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQocHJvbWlzZSwgcmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odHgpIHtcbiAgICAvLyBFYXJseSBiYWlsIGlmIHdlJ3ZlIGFscmVhZHkgY3JlYXRlZCBhIGRvbmUgcHJvbWlzZSBmb3IgdGhpcyB0cmFuc2FjdGlvbi5cbiAgICBpZiAodHJhbnNhY3Rpb25Eb25lTWFwLmhhcyh0eCkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBkb25lID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh0eC5lcnJvciB8fCBuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydEVycm9yJywgJ0Fib3J0RXJyb3InKSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgIH0pO1xuICAgIC8vIENhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWwuXG4gICAgdHJhbnNhY3Rpb25Eb25lTWFwLnNldCh0eCwgZG9uZSk7XG59XG5sZXQgaWRiUHJveHlUcmFwcyA9IHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIHRyYW5zYWN0aW9uLmRvbmUuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2RvbmUnKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2FjdGlvbkRvbmVNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICAvLyBQb2x5ZmlsbCBmb3Igb2JqZWN0U3RvcmVOYW1lcyBiZWNhdXNlIG9mIEVkZ2UuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ29iamVjdFN0b3JlTmFtZXMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5vYmplY3RTdG9yZU5hbWVzIHx8IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1ha2UgdHguc3RvcmUgcmV0dXJuIHRoZSBvbmx5IHN0b3JlIGluIHRoZSB0cmFuc2FjdGlvbiwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGFyZSBtYW55LlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdzdG9yZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1sxXVxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6IHJlY2VpdmVyLm9iamVjdFN0b3JlKHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEVsc2UgdHJhbnNmb3JtIHdoYXRldmVyIHdlIGdldCBiYWNrLlxuICAgICAgICByZXR1cm4gd3JhcCh0YXJnZXRbcHJvcF0pO1xuICAgIH0sXG4gICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaGFzKHRhcmdldCwgcHJvcCkge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24gJiZcbiAgICAgICAgICAgIChwcm9wID09PSAnZG9uZScgfHwgcHJvcCA9PT0gJ3N0b3JlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldDtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIHJlcGxhY2VUcmFwcyhjYWxsYmFjaykge1xuICAgIGlkYlByb3h5VHJhcHMgPSBjYWxsYmFjayhpZGJQcm94eVRyYXBzKTtcbn1cbmZ1bmN0aW9uIHdyYXBGdW5jdGlvbihmdW5jKSB7XG4gICAgLy8gRHVlIHRvIGV4cGVjdGVkIG9iamVjdCBlcXVhbGl0eSAod2hpY2ggaXMgZW5mb3JjZWQgYnkgdGhlIGNhY2hpbmcgaW4gYHdyYXBgKSwgd2VcbiAgICAvLyBvbmx5IGNyZWF0ZSBvbmUgbmV3IGZ1bmMgcGVyIGZ1bmMuXG4gICAgLy8gRWRnZSBkb2Vzbid0IHN1cHBvcnQgb2JqZWN0U3RvcmVOYW1lcyAoYm9vbyksIHNvIHdlIHBvbHlmaWxsIGl0IGhlcmUuXG4gICAgaWYgKGZ1bmMgPT09IElEQkRhdGFiYXNlLnByb3RvdHlwZS50cmFuc2FjdGlvbiAmJlxuICAgICAgICAhKCdvYmplY3RTdG9yZU5hbWVzJyBpbiBJREJUcmFuc2FjdGlvbi5wcm90b3R5cGUpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RvcmVOYW1lcywgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBmdW5jLmNhbGwodW53cmFwKHRoaXMpLCBzdG9yZU5hbWVzLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5zZXQodHgsIHN0b3JlTmFtZXMuc29ydCA/IHN0b3JlTmFtZXMuc29ydCgpIDogW3N0b3JlTmFtZXNdKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKHR4KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gQ3Vyc29yIG1ldGhvZHMgYXJlIHNwZWNpYWwsIGFzIHRoZSBiZWhhdmlvdXIgaXMgYSBsaXR0bGUgbW9yZSBkaWZmZXJlbnQgdG8gc3RhbmRhcmQgSURCLiBJblxuICAgIC8vIElEQiwgeW91IGFkdmFuY2UgdGhlIGN1cnNvciBhbmQgd2FpdCBmb3IgYSBuZXcgJ3N1Y2Nlc3MnIG9uIHRoZSBJREJSZXF1ZXN0IHRoYXQgZ2F2ZSB5b3UgdGhlXG4gICAgLy8gY3Vyc29yLiBJdCdzIGtpbmRhIGxpa2UgYSBwcm9taXNlIHRoYXQgY2FuIHJlc29sdmUgd2l0aCBtYW55IHZhbHVlcy4gVGhhdCBkb2Vzbid0IG1ha2Ugc2Vuc2VcbiAgICAvLyB3aXRoIHJlYWwgcHJvbWlzZXMsIHNvIGVhY2ggYWR2YW5jZSBtZXRob2RzIHJldHVybnMgYSBuZXcgcHJvbWlzZSBmb3IgdGhlIGN1cnNvciBvYmplY3QsIG9yXG4gICAgLy8gdW5kZWZpbmVkIGlmIHRoZSBlbmQgb2YgdGhlIGN1cnNvciBoYXMgYmVlbiByZWFjaGVkLlxuICAgIGlmIChnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpLmluY2x1ZGVzKGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgICAgIGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGN1cnNvclJlcXVlc3RNYXAuZ2V0KHRoaXMpKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHdyYXAoZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB3cmFwRnVuY3Rpb24odmFsdWUpO1xuICAgIC8vIFRoaXMgZG9lc24ndCByZXR1cm4sIGl0IGp1c3QgY3JlYXRlcyBhICdkb25lJyBwcm9taXNlIGZvciB0aGUgdHJhbnNhY3Rpb24sXG4gICAgLy8gd2hpY2ggaXMgbGF0ZXIgcmV0dXJuZWQgZm9yIHRyYW5zYWN0aW9uLmRvbmUgKHNlZSBpZGJPYmplY3RIYW5kbGVyKS5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbilcbiAgICAgICAgY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHZhbHVlKTtcbiAgICBpZiAoaW5zdGFuY2VPZkFueSh2YWx1ZSwgZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSkpXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodmFsdWUsIGlkYlByb3h5VHJhcHMpO1xuICAgIC8vIFJldHVybiB0aGUgc2FtZSB2YWx1ZSBiYWNrIGlmIHdlJ3JlIG5vdCBnb2luZyB0byB0cmFuc2Zvcm0gaXQuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gd3JhcCh2YWx1ZSkge1xuICAgIC8vIFdlIHNvbWV0aW1lcyBnZW5lcmF0ZSBtdWx0aXBsZSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QgKGVnIHdoZW4gY3Vyc29yaW5nKSwgYmVjYXVzZVxuICAgIC8vIElEQiBpcyB3ZWlyZCBhbmQgYSBzaW5nbGUgSURCUmVxdWVzdCBjYW4geWllbGQgbWFueSByZXNwb25zZXMsIHNvIHRoZXNlIGNhbid0IGJlIGNhY2hlZC5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJSZXF1ZXN0KVxuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdCh2YWx1ZSk7XG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSB0cmFuc2Zvcm1lZCB0aGlzIHZhbHVlIGJlZm9yZSwgcmV1c2UgdGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgIC8vIFRoaXMgaXMgZmFzdGVyLCBidXQgaXQgYWxzbyBwcm92aWRlcyBvYmplY3QgZXF1YWxpdHkuXG4gICAgaWYgKHRyYW5zZm9ybUNhY2hlLmhhcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSk7XG4gICAgLy8gTm90IGFsbCB0eXBlcyBhcmUgdHJhbnNmb3JtZWQuXG4gICAgLy8gVGhlc2UgbWF5IGJlIHByaW1pdGl2ZSB0eXBlcywgc28gdGhleSBjYW4ndCBiZSBXZWFrTWFwIGtleXMuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICB0cmFuc2Zvcm1DYWNoZS5zZXQodmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChuZXdWYWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWU7XG59XG5jb25zdCB1bndyYXAgPSAodmFsdWUpID0+IHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuXG5leHBvcnQgeyByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYXMgYSwgaW5zdGFuY2VPZkFueSBhcyBpLCByZXBsYWNlVHJhcHMgYXMgciwgdW53cmFwIGFzIHUsIHdyYXAgYXMgdyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy5jc3NcIjtcclxuaW1wb3J0IGFwcEZhY3RvcnkgZnJvbSBcIi4vY29udHJvbGxlci5qc1wiO1xyXG5pbXBvcnQgaHRtbCBmcm9tIFwiLi9pbmRleC5odG1sXCI7XHJcblxyXG5jb25zdCBhcHBDb250cm9sbGVyID0gYXBwRmFjdG9yeSgpO1xyXG4iXSwibmFtZXMiOlsiYm9va0ZhY3RvcnkiLCJ0aXRsZSIsImF1dGhvciIsInN0YXR1cyIsInJhdGluZyIsIm9wZW5EQiIsImRlbGV0ZURCIiwid3JhcCIsInVud3JhcCIsImVudW1GYWN0b3J5IiwidjQiLCJ1dWlkdjQiLCJib29rTW9kZWxGYWN0b3J5IiwiZGIiLCJib29rcyIsInNlYXJjaEZpbHRlciIsInJlYWRpbmdTdGF0dXNGaWx0ZXIiLCJib29rU3RhdHVzIiwiYm9va01vZGVsIiwiRXZlbnRUYXJnZXQiLCJhZGQiLCJfYWRkIiwiZWRpdEJvb2siLCJfZWRpdEJvb2siLCJnZXRCb29rcyIsIl9nZXRCb29rcyIsInVwZGF0ZUJvb2tSYXRpbmciLCJfdXBkYXRlQm9va1JhdGluZyIsInVwZGF0ZVJlYWRpbmdTdGF0dXMiLCJfdXBkYXRlUmVhZGluZ1N0YXR1cyIsImdldEJvb2tSYXRpbmciLCJfZ2V0Qm9va1JhdGluZyIsImRlbGV0ZUJvb2siLCJfZGVsZXRlQm9vayIsInVwZGF0ZVNlYXJjaCIsIl91cGRhdGVTZWFyY2giLCJhZGRSZWFkaW5nU3RhdHVzRmlsdGVyIiwiX2FkZFJlYWRpbmdTdGF0dXNGaWx0ZXIiLCJkZWxldGVSZWFkaW5nU3RhdHVzRmlsdGVyIiwiX2RlbGV0ZVJlYWRpbmdTdGF0dXNGaWx0ZXIiLCJpbml0TW9kZWwiLCJnZXRBbGxCb29rcyIsImdldERhdGFiYXNlIiwidXBncmFkZSIsIm9iamVjdFN0b3JlTmFtZXMiLCJjb250YWlucyIsImNyZWF0ZU9iamVjdFN0b3JlIiwia2V5UGF0aCIsInRyYW5zYWN0aW9uIiwic3RvcmUiLCJvYmplY3RTdG9yZSIsImdldEFsbCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImFkZEJvb2tFdmVudCIsImJvb2tUb0FkZCIsImRldGFpbCIsInV1aWQiLCJwdXNoIiwidXBkYXRlIiwiZWRpdEJvb2tFdmVudCIsImJvb2tUb0VkaXQiLCJtYXAiLCJib29rIiwiYm9va1VVSUQiLCJuZXdSYXRpbmciLCJmaW5kIiwiZmlsdGVyIiwiZGVsZXRlIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwibmV3U3RhdHVzIiwic2VhcmNoVGVybSIsInRyaW0iLCJyZWFkaW5nU3RhdHVzRmlsdGVyVGVybSIsImZvckVhY2giLCJwdXQiLCJib29rc1RvUmV0dXJuIiwicGF0dGVybiIsIlJlZ0V4cCIsInRlc3QiLCJsZW5ndGgiLCJpbmNsdWRlcyIsInJhdGluZ1N0YXJzQ29tcG9uZW50RmFjdG9yeSIsInJlYWRpbmdTdGF0dXNGYWN0b3J5IiwiYWRkQm9va01vZGFsQ29tcG9uZW50RmFjdG9yeSIsImZvcm1IZWFkZXIiLCJidXR0b25UZXh0IiwibW9kZSIsImZvcm1XcmFwcGVyIiwiY3VycmVudFJhdGluZyIsImJvb2tNb2RhbENvbXBvbmVudCIsImNyZWF0ZUJvb2tNb2RhbERPTU5vZGUiLCJyZWFkaW5nU3RhdHVzQ29tcG9uZW50IiwicmF0aW5nU3RhcnNDb21wb25lbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiY3JlYXRlRm9ybVdyYXBwZXJOb2RlIiwiaW5pdEV2ZW50TGlzdGVuZXJzIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImluc2VydEFkamFjZW50SFRNTCIsInJldHVybkJvb2tNb2RhbEhUTUwiLCJjb2xvcml6ZVJhdGluZ1N0YXJzIiwicXVlcnlTZWxlY3RvciIsImluaXRDb3JyZWN0QnV0dG9uTGlzdGVuZXJBY2NvcmRpbmdUb01vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlQm9va01vZGFsIiwicXVlcnlTZWxlY3RvckFsbCIsInN0YXIiLCJjaGFuZ2VSYXRpbmciLCJldmVudCIsIm9uRHJvcERvd25Gb2N1cyIsImFkZEJvb2siLCJjcmVhdGVCb29rT2JqZWN0RnJvbVVzZXJJbnB1dCIsInZhbHVlIiwidGV4dENvbnRlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsInJlbW92ZSIsInN0b3BQcm9wYWdhdGlvbiIsInRhcmdldCIsImRhdGFzZXQiLCJzdGFyTnVtYmVyIiwicmV0dXJuUmVhZGluZ1N0YXR1c0hUTUwiLCJyZXR1cm5SYXRpbmdTdGFyc0hUTUwiLCJyZWFkaW5nU3RhdHVzRHJvcGRvd25GYWN0b3J5IiwiYm9va0NhcmRGYWN0b3J5IiwiYm9va0NhcmRDb21wb25lbnQiLCJjcmVhdGVCb29rQ2FyZCIsIl9jcmVhdGVCb29rQ2FyZCIsIl9vbkRyb3BEb3duRm9jdXMiLCJvbkRyb3BEb3duQmx1ciIsIl9vbkRyb3BEb3duQmx1ciIsInJlYWRpbmdTdGF0dXNEcm9wZG93biIsImJvb2tPYmplY3QiLCJib29rQ2FyZCIsInNldEF0dHJpYnV0ZSIsInJldHVybkJvb2tDYXJkSFRNTCIsImNsb3Nlc3QiLCJib29rTGlzdEl0ZW0iLCJzdGFyRmlsbCIsInN0YXJTdHJva2UiLCJudW1iZXJPZlN0YXJzIiwicmF0aW5nU3RyaW5nIiwiaSIsIm9iamVjdFRoYXRzUmF0ZWQiLCJkZWNvbG9yQWxsU3RhcnMiLCJtYXhDb2xvcml6ZWRTdGFyIiwibmV4dFNpYmxpbmciLCJuZXh0RWxlbWVudFNpYmxpbmciLCJyZWFkaW5nU3RhdHVzQ29tcG9uZW50RmFjdG9yeSIsIl9yZXR1cm5SZWFkaW5nU3RhdHVzSFRNTCIsIl9pbml0RXZlbnRMaXN0ZW5lcnMiLCJjb250YWluZXJPYmplY3QiLCJvblN0YXR1c0Nob2ljZSIsInBhcmVudE5vZGUiLCJnZXRBdHRyaWJ1dGUiLCJtYXRjaGVzIiwicmVhZGluZ1N0YXR1c1RleHRDb250ZW50IiwiYm9va0NhcmRDb21wb25lbnRGYWN0b3J5IiwiYXBwRmFjdG9yeSIsIkFwcCIsIiQiLCJyYXRpbmdTdGFycyIsImJvb2tMaXN0Iiwid3JhcHBlciIsInNlYXJjaEJhciIsImZpbHRlckNvbnRhaW5lciIsImZpbHRlckJ1dHRvbiIsImZpbHRlclNlY3Rpb24iLCJmaWx0ZXJDYXJkcyIsImluaXRBcHAiLCJmdWxsUmVuZGVyVmlldyIsInJlcGxhY2VDaGlsZHJlbiIsImFkZEJvb2tNb2RhbENvbXBvbmVudCIsImluaXRHbG9iYWxFdmVudHMiLCJpbml0Qm9va1N0b3JhZ2VFdmVudHMiLCJpbml0Qm9va0NhcmRFdmVudHMiLCJjcmVhdGVCb29rTW9kYWxWaWV3IiwiZGVib3VuY2VkU2VhcmNoSW5MaXN0IiwiZGVib3VuY2UiLCJjYiIsImRlbGF5IiwidGltZW91dCIsIl9sZW4iLCJhcmd1bWVudHMiLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwiY2xlYXJUaW1lb3V0Iiwic3R5bGUiLCJkaXNwbGF5Iiwib3BlbkZpbHRlclNlY3Rpb24iLCJjbG9zZUZpbHRlclNlY3Rpb25CbHVyIiwib25GaWx0ZXJDbGljayIsImJpbmQiLCJmaWx0ZXJUZXJtIiwiY2hlY2tlZCIsImFkZEZpbHRlckNhcmQiLCJyZW1vdmVGaWx0ZXJDYXJkIiwiYXBwZW5kIiwicmV0dXJuRmlsdGVyQ2FyZE5vZGUiLCJmaWx0ZXJDYXJkIiwiQmJ1dHRvbiIsImZpbHRlck9wdGlvbiIsImFkZEJvb2tDYXJkRXZlbnQiLCJib29rSUQiLCJib29rVXVpZCIsImV2ZW50TmFtZSIsInNlbGVjdG9yIiwiaGFuZGxlciIsIm5vZGVUb0FwcGVuZFRvIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsImNyZWF0ZUVudW1QT0pPIiwiZW51bVZhbHVlcyIsImVudW1QT0pPIiwiZW51bVZhbHVlIiwia2V5IiwiY2FtZWxDYXNlIiwiT2JqZWN0IiwiZnJlZXplIiwic3RyaW5nIiwic3BsaXQiLCJ3b3JkIiwiaW5kZXgiLCJ3b3JkTG93ZXJDYXNlIiwidG9Mb3dlckNhc2UiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiam9pbiIsImh0bWwiLCJhcHBDb250cm9sbGVyIl0sInNvdXJjZVJvb3QiOiIifQ==