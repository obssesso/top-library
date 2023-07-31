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
  const bookStatus = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__["default"])(["Read", "Want to Read", "Currently Reading"]);

  /* Why does this give "invalid invocator error on .addEventListener, whats the difference to constructor function?" */
  /*   let bookModel = Object.create(EventTarget.prototype); */

  const bookModel = new EventTarget();
  bookModel.add = _add;
  bookModel.editBook = _editBook;
  bookModel.getBooks = _getBooks;
  bookModel.updateBookRating = _updateBookRating;
  bookModel.getBookRating = _getBookRating;
  bookModel.deleteBook = _deleteBook;
  await initModel();
  return bookModel;
  async function initModel() {
    books = [];
    try {
      db = await getDatabase();
      const transaction = db.transaction(["books"], "readonly");
      const store = transaction.objectStore("books");
      books = await store.getAll();
    } catch (error) {
      console.log(error);
    }
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
      if (book.uuid = bookToEdit.uuid) return bookToEdit;
      return book;
    });
    try {
      update();
    } catch (error) {
      console.log("schaisinn");
    }
  }
  function _updateBookRating(bookID, newRating) {
    books = books.map(book => {
      if (book.id != bookID) return book;
      if (book.rating == newRating) {
        book.rating = "";
      } else {
        book.rating = newRating;
      }
      return book;
    });
    update();
  }
  function _getBookRating(bookID) {
    return books.find(book => book.id == bookID).rating;
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
  async function update() {
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    try {
      await books.forEach(book => store.put(book));
      /*       books = await store.getAll(); // This sucks and is done, because of autoIncrement ID. */
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
    return books;
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



function addBookModalComponentFactory(book, formHeader, buttonText, mode) {
  let formWrapper;
  let currentRating;
  const bookModalComponent = new EventTarget();
  bookModalComponent.createBookModalDOMNode = createBookModalDOMNode;
  const ratingStarsComponent = (0,_ratingStars_ratingStars__WEBPACK_IMPORTED_MODULE_1__["default"])(getComputedStyle(document.documentElement).getPropertyValue("--clr-secondary-accent"), getComputedStyle(document.documentElement).getPropertyValue("--clr-white"));
  return bookModalComponent;
  function createBookModalDOMNode() {
    createFormWrapperNode();
    initEventListeners();
    return formWrapper;
  }
  function createFormWrapperNode() {
    formWrapper = document.createElement("div");
    formWrapper.classList.add("form-wrapper", "pos-abs", "inset0", "grid", "pi-center");
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
    function initCorrectButtonListenerAccordingToMode() {
      if (mode == "edit") {
        formWrapper.querySelector('[data-add-book="edit"]').addEventListener("click", editBook);
      } else {
        formWrapper.querySelector('[data-add-book="add"]').addEventListener("click", addBook);
      }
    }
  }
  function addBook() {
    /*     const bookToAdd = {
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
        bookToAdd.rating = currentRating;
      }
    }); */
    /* 
    bookToAdd = bookFactory(
      formWrapper.querySelector('"[data-book=title]"').value,
      formWrapper.querySelector('"[data-book=author]"').value,
      formWrapper.querySelector('"[data-book=status]"').value,
      currentRating
    ); */

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
    return (0,_bookFactory_js__WEBPACK_IMPORTED_MODULE_2__["default"])(formWrapper.querySelector('[data-book="title"]').value, formWrapper.querySelector('[data-book="author"]').value, formWrapper.querySelector('[data-book="status"]').value, currentRating);
  }
  function removeBookModal(event) {
    formWrapper.classList.add("wrapper-closing-animation");
    formWrapper.querySelector("form").classList.add("popup-closing-animation");
    formWrapper.querySelector('[data-add-book="close"]').removeEventListener("click", removeBookModal);
    setTimeout(() => {
      formWrapper.style.display = "none";
    }, 400);
  }
  function changeRating(event) {
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
                    <input data-book="status" type="text" value="${book.status}">
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


function bookCardFactory() {
  const bookCardComponent = new EventTarget();
  bookCardComponent.createBookCard = createBookCard;
  const ratingStarsComponent = (0,_ratingStars_ratingStars_js__WEBPACK_IMPORTED_MODULE_1__["default"])(getComputedStyle(document.documentElement).getPropertyValue("--clr-secondary-accent"), getComputedStyle(document.documentElement).getPropertyValue("--clr-main-accent")
  /*     "white" */);

  return bookCardComponent;
  function createBookCard(bookObject) {
    const bookCard = document.createElement("li");
    bookCard.classList.add("book", "flex", "ai-start", "pb-bottom-700", "mrgn-bottom-700");
    bookCard.setAttribute("data-book-uuid", bookObject.uuid);
    bookCard.insertAdjacentHTML("afterbegin", returnBookCardHTML());
    bookCard.querySelector('[data-book="title"]').textContent = bookObject.title;
    bookCard.querySelector('[data-book="author"]').textContent = bookObject.author;
    bookCard.querySelector('[data-book="status"]').textContent = bookObject.status;
    ratingStarsComponent.colorizeRatingStars(bookObject.rating, bookCard);
    return bookCard;
  }

  /*   function initRatingStarEvents() {
    document.querySelectorAll("[data-star-number]").forEach((ratingStar) => {
      ratingStar.addEventListener(
        "click",
        onRatingStarInteraction.bind(ratingStar, "blue")
      );
      ratingStar.addEventListener(
        "dblclick",
        onRatingStarInteraction.bind(ratingStar, "none")
      ); */
  /*       ratingStar.addEventListener("mouseover", (event) =>
        onRatingStarInteraction(event, "yellow")
      ); */
  /*     });
  } */

  function onRatingStarInteraction(color) {
    this.parentElement.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) child.setAttribute("fill", "none");
    });

    //possibilty to reset star rating, when clicking on star thats currentRating again.
    if (this.getAttribute("data-star-number") == currentRating) return;
    currentRating = this.getAttribute("data-star-number");
    this.setAttribute("fill", color);
    let sibling = this.nextElementSibling;
    while (sibling) {
      sibling.setAttribute("fill", color);
      sibling = sibling.nextElementSibling;
    }
  }
  function returnBookCardHTML() {
    return `<img data-book="image" src="" alt="">
                    <div class="width-100">
                        <header class="flex ai-center jc-sb">
                            <h2 data-book="title" class="fs-book-title"></h2>
                            <div class="flex book__icon-group" >
                              <svg data-book="edit" xmlns="http://www.w3.org/2000/svg" height="22"
                                  viewBox="0 -960 960 960" width="22">
                                  <path
                                      d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z" />
                              </svg>
                              <svg data-book="delete" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round" />
                                  <path d="M14 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round" />
                                  <path d="M4 7H20" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round" />
                                  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000"
                                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000"
                                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                        </header>
                        <h3 data-book="author" class="fs-book-author mrgn-bottom-500"></h3>
                        <button class="book-status mrgn-bottom-500 bg-color-main flex ai-center jc-sb">
                            <span data-book="status"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="22px" height="22px"
                                viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </button>
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
  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
      bookList: document.querySelector(".books"),
      addBook: document.querySelector('[data-global-action="add"]'),
      wrapper: document.querySelector('[data-global="wrapper"]')
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
    let bookCardComponent = (0,_components_bookCard_bookCard_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
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
      }, "Add a new book to your list", "Add book", "add"));
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
        createBookModalView({
          uuid: book.getAttribute("data-book-uuid"),
          title: book.querySelector('[data-book="title"]').textContent,
          author: book.querySelector('[data-book="author"]').textContent,
          status: book.querySelector('[data-book="status"]').textContent,
          rating: bookModel.getBookRating(book.dataset.bookId)
        }, "Edit this book", "Confirm Edit", "edit");
      });
      function addBookCardEvent(eventName, selector, handler) {
        App.$.bookList.addEventListener(eventName, event => {
          if (event.target.matches(selector)) {
            handler(event.target.closest(".book"), event);
          }
        });
      }
    }
    function createBookModalView(book, formHeader, buttonText, mode) {
      addBookModalComponent = (0,_components_addBookModal_addBookModal_js__WEBPACK_IMPORTED_MODULE_1__["default"])(book, formHeader, buttonText, mode);

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
var code = "<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Library</title>\r\n</head>\r\n<style>\r\n    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');\r\n</style>\r\n<style>\r\n    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');\r\n</style>\r\n<body class=\"bg-color ff-main\">\r\n\r\n\r\n    <div data-global=\"wrapper\" class=\"wrapper pos-rel\">\r\n        <!--         <div class=\"pos-abs inset0 grid pi-center form-wrapper\">\r\n            <form class=\"pos-rel\" action=\"\">\r\n                <button class=\"close-modal pos-abs clr-white\" style=\"right: 0; top:0;\">X</button>\r\n                <h2 class=\"clr-white mrgn-bottom-700\">Add a new book to your list</h2>\r\n                <label>\r\n                    <p>Book Title</p>\r\n                    <input type=\"text\">\r\n                </label>\r\n                <label>\r\n                    <p>Author</p>\r\n                    <input type=\"text\">\r\n                </label>\r\n                <label>\r\n                    <p>Status</p>\r\n                    <input type=\"text\">\r\n                </label>\r\n                <label>\r\n                    <p>Rating</p>\r\n                    <input type=\"text\">\r\n                </label>\r\n                <p style=\"justify-self: end; padding-top: 1rem;\"><button>Add to list</button></p>\r\n            </form>\r\n        </div>\r\n\r\n -->\r\n        <header class=\"grid pi-center mrgn-bottom-800\">\r\n            <!--             <h1 class=\"ff-accent ta-center fs-h1 pb-bottom-500\">My Book List</h1> -->\r\n            <h1 class=\"svg-h1 pb-bottom-500\">\r\n                <svg width=\"100px\" height=\"100px\" viewBox=\"0 -0.46 321.395 321.395\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                    <defs>\r\n                        <style>\r\n                            .a {\r\n                                fill: #ffffff;\r\n                            }\r\n\r\n                            .b {\r\n                                fill: #6B705C;\r\n                            }\r\n\r\n                            .c {\r\n                                fill: #211715;\r\n                            }\r\n\r\n                            .d {\r\n                                fill: #ffda71;\r\n                            }\r\n                        </style>\r\n                    </defs>\r\n                    <path class=\"a\"\r\n                        d=\"M304.418,238.9c-.017-11.951-.077-36.41-.077-45.1,0,0,0-.121.006-.356-53.9-31.01-135.061-77.919-171.922-99.254-31.213,18.059-94.031,54.357-130.373,75.234,0,10.138.074,40.174.068,49.085,33.15,19.2,119.957,69.372,173.325,100.058,37.885-21.778,99.829-57.575,128.978-74.447v-.459C304.423,242.493,304.421,240.865,304.418,238.9Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M131.706,94.6C100.37,112.73,38.567,148.441,2.445,169.193c27.372,15.853,126.347,73.071,172.227,99.385,33.5-19.2,106.859-61.578,129.669-74.783,0,0,0-.121.006-.356-53.9-31.01-135.061-77.919-171.922-99.254Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M306.418,238.9q-.017-12.1-.046-24.2c-.014-7.08-.18-14.18-.025-21.259a2,2,0,0,0-.99-1.727q-35.7-20.539-71.365-41.138-35.376-20.419-70.736-40.866-14.913-8.622-29.822-17.25a2.022,2.022,0,0,0-2.019,0q-23.761,13.748-47.534,27.477-27.843,16.083-55.7,32.141-13.564,7.815-27.137,15.616a2.011,2.011,0,0,0-.99,1.727q0,17.325.052,34.651.008,4.278.013,8.555a38.656,38.656,0,0,0,.039,6.145c.23,1.362,1.723,1.905,2.8,2.531L5.7,222.886l6.032,3.491Q26.9,235.157,42.08,243.929q18.662,10.79,37.328,21.569,19.842,11.46,39.687,22.909,19.078,11.006,38.164,22c5.65,3.254,11.22,6.807,17.015,9.792,1.709.88,3.314-.559,4.778-1.4l4.2-2.413q4.42-2.544,8.84-5.089,19.689-11.337,39.363-22.7,19.755-11.4,39.5-22.815,16.167-9.344,32.33-18.7c1.141-.661,2.865-1.267,3.1-2.705a34.234,34.234,0,0,0,.031-5.482c0-2.574-4-2.579-4,0q0,2.607,0,5.216l.99-1.727q-22.851,13.227-45.715,26.433-27.7,16-55.409,31.978-13.923,8.025-27.854,16.036h2.019q-36.443-20.954-72.843-41.982Q67.646,254.093,31.7,233.3,17.411,225.044,3.13,216.777l.99,1.727c.008-13.314-.041-26.628-.06-39.942q-.007-4.572-.008-9.143l-.991,1.727q25.616-14.715,51.2-29.489Q81.6,125.88,108.934,110.08q12.252-7.083,24.5-14.168h-2.019q29.592,17.127,59.2,34.23,37.073,21.42,74.163,42.811,19.275,11.115,38.561,22.213l-.991-1.727c-.155,7.079.011,14.179.025,21.259q.024,12.1.046,24.2C302.422,241.472,306.422,241.477,306.418,238.9Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M173.07,268.444q0,20.736.072,41.472.007,4.194.01,8.389c0,2.574,4,2.578,4,0,0-13.5-.05-27-.072-40.5q-.008-4.683-.01-9.366c0-2.574-4-2.578-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M3.431,172.066q12.11,7.017,24.226,14.023,17.038,9.855,34.083,19.7,19.348,11.179,38.7,22.349,19.039,10.988,38.085,21.96,16.109,9.279,32.23,18.536l3.306,1.9c2.236,1.283,4.254-2.172,2.018-3.454q-15.582-8.934-31.146-17.9-18.829-10.842-37.647-21.7-19.458-11.228-38.91-22.465Q50.91,194.914,33.444,184.815q-12.863-7.44-25.721-14.886L5.45,168.612c-2.232-1.293-4.248,2.163-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.093,283.567q-13.441-7.707-26.865-15.444-16.377-9.43-32.745-18.877Q98.6,239.505,81.724,229.755q-15.236-8.8-30.468-17.609-11.166-6.457-22.331-12.92-.992-.576-1.985-1.15c-2.232-1.293-4.248,2.162-2.019,3.454Q35.43,207.617,45.944,213.7q14.86,8.6,29.723,17.181,16.79,9.7,33.584,19.393,16.566,9.559,33.138,19.108,13.9,8.01,27.822,16l2.863,1.642c2.237,1.282,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M164.115,293.447q-13.019-7.465-26-15c-2.232-1.293-4.248,2.162-2.019,3.453q12.987,7.522,26,15c2.237,1.283,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M249.423,281.526c-4.618,2.652-19.594,11.3-26.406,15.225-6.573-3.775-18.231-10.493-26.936-15.517,8.226-4.732,17.274-9.942,26.426-15.225C231.441,271.167,243.172,277.938,249.423,281.526Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M196.081,283.234h.01l-1.009-.273q12.546,7.255,25.113,14.476a8.03,8.03,0,0,0,2.556,1.278c1,.135,1.928-.612,2.756-1.09l4.73-2.726,10.752-6.2q4.72-2.724,9.443-5.442a2.019,2.019,0,0,0,0-3.454q-13.471-7.734-26.915-15.517c-2.234-1.29-4.25,2.166-2.019,3.454q13.452,7.767,26.915,15.517V279.8q-13.215,7.59-26.4,15.225h2.018q-6.6-3.792-13.2-7.6-3.7-2.13-7.4-4.264l-3.672-2.121c-1.027-.593-2.463-1.809-3.677-1.809-2.574,0-2.578,4,0,4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M286.81,226.561q-18.458,10.689-36.931,21.348-24.841,14.343-49.7,28.659-12.856,7.4-25.721,14.785c-2.234,1.279-.221,4.736,2.019,3.454q23.758-13.6,47.456-27.312,23.481-13.537,46.948-27.1,8.974-5.187,17.947-10.381c2.227-1.29.215-4.748-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.9,270.179q26.069-14.941,52.086-29.973,28.068-16.185,56.119-32.4,10.623-6.139,21.243-12.285c2.227-1.289.215-4.747-2.019-3.454Q281.169,204.9,258.989,217.7q-29.14,16.827-58.3,33.622-13.4,7.713-26.807,15.406c-2.233,1.28-.221,4.737,2.019,3.454Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M262.249,165.587c-.013-8.922-.058-27.181-.058-33.672,0,0,0-.09.005-.266-40.238-23.15-100.831-58.17-128.349-74.1-23.3,13.482-70.2,40.58-97.331,56.166,0,7.568.056,29.992.051,36.644,24.749,14.33,89.555,51.791,129.4,74.7,28.284-16.259,74.528-42.984,96.289-55.579v-.343C262.252,168.27,262.251,167.055,262.249,165.587Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M132.1,58.561c-23.831,13.786-69.115,39.95-95.585,55.156,0,7.568.056,29.992.051,36.644,10.763,6.233,29.1,16.839,49.67,28.722-.015-9.132-.054-29.307-.058-36.983,41.833-24.166,77.077-44.545,96.955-56.052-19.693-11.377-37.516-21.684-49.287-28.5Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M264.249,165.587c-.017-11.3-.3-22.637-.053-33.938a2,2,0,0,0-.991-1.727q-26.644-15.33-53.265-30.7-26.406-15.242-52.8-30.5Q146,62.271,134.856,55.824a2.022,2.022,0,0,0-2.019,0Q115.073,66.1,97.3,76.367,76.566,88.343,55.822,100.3q-10.155,5.851-20.315,11.691a2.012,2.012,0,0,0-.991,1.727q0,13.087.04,26.174.006,3.168.009,6.336c0,1.423-.307,3.282.074,4.666.407,1.478,3.19,2.51,4.45,3.24l4.6,2.664q25.283,14.63,50.579,29.237,29.014,16.757,58.045,33.482l6.622,3.812,3.049,1.754a24.646,24.646,0,0,0,3.205,1.806c1.32.511,2.554-.546,3.655-1.179l3.327-1.913,6.727-3.873q14.649-8.436,29.29-16.889,26.814-15.475,53.612-30.982c1.092-.632,2.346-1.125,2.448-2.57.091-1.285,0-2.608,0-3.9,0-2.573-4-2.578-4,0q0,1.947,0,3.9l.991-1.727q-17.022,9.852-34.054,19.689-20.719,11.972-41.45,23.923-10.391,5.988-20.785,11.967h2.019q-27.173-15.625-54.314-31.3Q85.84,176.551,59.035,161.05,48.3,154.845,37.577,148.634l.99,1.727c.006-9.911-.03-19.822-.045-29.734q0-3.454-.006-6.91l-.99,1.727q19.149-11,38.273-22.046Q96.161,81.65,116.512,69.885q9.174-5.3,18.344-10.607h-2.019q22.086,12.783,44.184,25.548,27.671,15.989,55.355,31.954,14.4,8.3,28.81,16.6l-.99-1.727c-.248,11.3.036,22.635.053,33.938C260.253,168.161,264.253,168.166,264.249,165.587Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M163.684,187.644c0,8.464.06,16.927.061,25.391,0,2.573,4,2.578,4,0,0-8.464-.06-16.927-.061-25.391,0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M167.078,186.408q-22.767-13.054-45.486-26.189Q97.081,146.077,72.583,131.91q-9.279-5.365-18.555-10.737c-2.231-1.292-4.248,2.163-2.019,3.454q19.355,11.211,38.723,22.394,25.449,14.7,50.913,29.378,11.7,6.741,23.414,13.463c2.237,1.283,4.254-2.172,2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M166.56,189.377q16.453-9.429,32.875-18.917,17.652-10.181,35.295-20.377,6.756-3.9,13.509-7.813c2.228-1.289.216-4.747-2.018-3.453q-13.989,8.1-27.988,16.176-18.321,10.579-36.655,21.14-8.516,4.9-17.037,9.79c-2.233,1.28-.22,4.738,2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M87.3,143.76q21.956-12.682,43.907-25.371,17.827-10.3,35.652-20.615,7.624-4.41,15.247-8.823c2.227-1.289.216-4.747-2.019-3.454q-14.742,8.535-29.49,17.061-19.836,11.47-39.675,22.934Q98.1,132.9,85.285,140.306c-2.229,1.288-.217,4.745,2.018,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M84.174,142.082c.013,11.343.061,22.686.062,34.029,0,2.574,4,2.578,4,0,0-11.343-.049-22.686-.062-34.029,0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M147.3,142.758a15.793,15.793,0,0,1-1.6,6.165c-1.986,3.9-5.818,6.569-9.853,8.269s-4.613,1.258-8.788,2.576c-3.255,1.027-6.663,2.506-8.058,5.8a19.245,19.245,0,0,0-1.031,5.231c-.3,6.748-.246,13.767-.33,20.711a2.279,2.279,0,0,1-1.57,2.19,32.139,32.139,0,0,1-14.655.781,2.925,2.925,0,0,1-1.3-.873,3.959,3.959,0,0,1-1.1-1.831c-.376-3.152-.557-6.188-.664-9.228-3.493.776-7.485,2.116-11.2,1.209-2.583-.63-5-2.6-5.4-5.229l-.328-2.171c-.577-10.62-1.153-9.283-1.73-19.9-.194-3.573-.35-7.341,1.282-10.526a17.826,17.826,0,0,1,5.664-5.909,69.03,69.03,0,0,1,14.464-8.107S140.619,141.394,147.3,142.758Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M139.221,146.317c2.3-1.288,5.263-2.738,8.123-4.452,4.746-2.84,9.258-6.429,10.191-11.246a20.126,20.126,0,0,0-.03-6.288c-.913-7.372-2.657-16.782-7.251-22.847-2.8-3.711-7.22-8.5-11.53-10.708,0,0-7.477-3.62-14.741-4.094-11.662-.76-17.63,4.211-17.63,4.211a35.256,35.256,0,0,0-13.2,20.8l-2.036,11.716-.735,4.229Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M92.472,204.028a7.359,7.359,0,0,1,1.429-6.02,18.158,18.158,0,0,1,5.436-4.375c2.1,1.644,10.632,1.962,16.738.07a2.155,2.155,0,0,0,.583-.281c.075.712.123,1.153.123,1.153.635,5.8-2.878,8.132-5.108,9.459a33.619,33.619,0,0,1-8.5,3.578,13.9,13.9,0,0,1-5.547.544A6.453,6.453,0,0,1,93,205.306,4.975,4.975,0,0,1,92.472,204.028Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M74.609,191.461a8.013,8.013,0,0,1,1.143-2.133,19.283,19.283,0,0,1,5.892-4.614,9.923,9.923,0,0,1,3.808-1.581,8.118,8.118,0,0,0,1.708.628c3.715.907,7.706-.432,11.2-1.208.075,2.19.191,4.379.39,6.61l-1.569.259c.117,2.5-2.1,4.451-4.251,5.73a32.523,32.523,0,0,1-8.219,3.459,13.348,13.348,0,0,1-5.363.52,6.2,6.2,0,0,1-4.469-2.752A5.834,5.834,0,0,1,74.609,191.461Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M114.781,194.575a7.173,7.173,0,0,1-2.6,6.744,27.787,27.787,0,0,1-9.546,4.365c-2.774.734-8.287,1.217-8.341-3.036-.048-3.8,3.874-6,6.706-7.677,2.215-1.308.2-4.767-2.019-3.453-3.347,1.978-6.708,4.194-8.125,8a7.646,7.646,0,0,0,3.415,9.613c3.843,2.013,8.374.934,12.235-.467a28.608,28.608,0,0,0,8.717-4.684,10.7,10.7,0,0,0,3.557-9.4,2.054,2.054,0,0,0-2-2,2.014,2.014,0,0,0-2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M84.654,181.242a16.03,16.03,0,0,0-4.947,2.3,23.828,23.828,0,0,0-4.18,3.047c-2.462,2.346-4.081,6.009-2.991,9.4,1.152,3.586,4.914,5.327,8.474,5.234,3.839-.1,7.774-1.632,11.153-3.361,3.325-1.7,7.049-4.282,7.021-8.44-.017-2.573-4.017-2.578-4,0,.02,2.939-4.316,4.71-6.5,5.691a29.355,29.355,0,0,1-4.9,1.674,8.873,8.873,0,0,1-5.219.092c-2.89-1.084-2.818-4.228-1.172-6.419a13.333,13.333,0,0,1,3.723-3.089,14.635,14.635,0,0,1,4.607-2.272c2.521-.513,1.454-4.37-1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M100.579,129.989a70.434,70.434,0,0,0-15.936,9.055A17.465,17.465,0,0,0,78.9,145.7a20.213,20.213,0,0,0-1.288,8.816c.145,4.315.56,8.6,1.078,12.882.468,3.871.445,7.814,1.14,11.65a8.57,8.57,0,0,0,5.238,6.095c3.36,1.444,7.061.907,10.516.126,2.51-.567,1.448-4.425-1.063-3.857-3.733.844-10.033,1.5-10.863-3.615-.547-3.376-.543-6.857-.955-10.287-.432-3.6-.786-7.185-.987-10.8a26.637,26.637,0,0,1,.258-7.65,11.423,11.423,0,0,1,4.123-6.085,59.884,59.884,0,0,1,15.547-9.123,2.067,2.067,0,0,0,1.4-2.461,2.012,2.012,0,0,0-2.46-1.4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M100.164,149.275c-3.427,2.382-4.287,6.117-4.349,10.043-.063,3.982.149,7.963.273,11.942.163,5.22.14,10.447.49,15.659.162,2.415-.015,5.366,1.518,7.367,1.471,1.92,3.274,2.323,5.555,2.563a32.691,32.691,0,0,0,6.583-.023,25.468,25.468,0,0,0,6.682-1.313c2.61-1.017,2.724-3.519,2.748-5.939.026-2.75.036-5.5.063-8.248.026-2.719.067-5.439.157-8.157a21.132,21.132,0,0,1,.869-6.581c1.335-3.616,6.074-4.806,9.41-5.611,4.326-1.044,8.49-2.4,12.092-5.128a17.661,17.661,0,0,0,7.089-13.984c.1-2.575-3.9-2.57-4,0a13.521,13.521,0,0,1-5.209,10.6,24.277,24.277,0,0,1-9.661,4.338c-3.565.792-7.351,1.8-10.27,4.1-3.241,2.55-4.041,6.447-4.248,10.373-.263,4.957-.232,9.935-.266,14.9q-.012,1.821-.029,3.641a6.473,6.473,0,0,1-.019,1.7c-.113.321-.066.2-.277.316a10.29,10.29,0,0,1-2.864.679,29.023,29.023,0,0,1-3.068.386,32,32,0,0,1-5.782-.046,4.833,4.833,0,0,1-1.833-.38c-.931-.554-.906-1.627-1-2.559-.458-4.709-.531-9.44-.625-14.167-.09-4.49-.319-8.977-.379-13.468-.022-1.691-.05-3.4.08-5.083.011-.14.022-.28.036-.42.041-.4-.026.122.011-.066a9.215,9.215,0,0,1,.433-1.563,5.21,5.21,0,0,1,1.805-2.414c2.1-1.46.1-4.929-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M105.344,89.166a37.579,37.579,0,0,0-14.117,21.991c-.535,2.511,3.32,3.584,3.857,1.063a33.437,33.437,0,0,1,12.279-19.6,2.065,2.065,0,0,0,.717-2.736,2.013,2.013,0,0,0-2.736-.718Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M93.073,131.912c-2.224-1.387-3.149-3.73-3.512-6.217-.407-2.788.07-6.337,4.127-7.351a5.776,5.776,0,0,1,4.225.789,7.917,7.917,0,0,1,3.891,7.682c-.274,3.306-3.391,6.336-6.673,5.857A5.3,5.3,0,0,1,93.073,131.912Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M94.082,130.185a4.789,4.789,0,0,1-1.2-1.091c.179.224-.08-.121-.118-.176q-.142-.216-.27-.439c-.068-.12-.133-.241-.195-.364,0,0-.247-.563-.135-.281a10.884,10.884,0,0,1-.527-1.825c-.036-.175-.068-.35-.1-.527-.023-.136-.076-.619-.018-.083-.027-.253-.053-.5-.066-.759a11.088,11.088,0,0,1,.031-1.4c.028-.374,0,0-.01.067.026-.127.046-.256.075-.383.062-.281.152-.548.241-.821-.145.45.086-.167.161-.3s.481-.637.185-.309a7.33,7.33,0,0,1,.518-.525c.232-.209-.39.224.072-.053.155-.092.3-.193.464-.278.111-.06.224-.118.339-.167-.287.124.028,0,.076-.019a8.126,8.126,0,0,1,.907-.24c-.447.076.185.012.35.015s.33.012.494.03c.141.014.135.014-.017,0,.106.018.211.041.314.067a4.093,4.093,0,0,1,1.6.774c.023.016.3.226.1.065.108.083.212.173.315.262a8.939,8.939,0,0,1,.78.765,5.348,5.348,0,0,1,1.266,2.531c-.007-.033.112.588.068.309s.034.362.031.326a8.924,8.924,0,0,1,.019.925c0,.178-.014.355-.029.532.007-.087.073-.34-.01.072a8.048,8.048,0,0,1-.268.979c-.2.6.086-.15-.078.179-.09.184-.187.363-.292.539a2.539,2.539,0,0,1-.474.661,6.713,6.713,0,0,1-.729.7c.216-.177-.041.027-.077.05-.168.108-.334.218-.51.314a3.428,3.428,0,0,1-1.436.41,3.112,3.112,0,0,1-1.848-.536,2,2,0,0,0-2.019,3.454c3.7,2.2,8,.706,10.326-2.693a9.511,9.511,0,0,0-.039-10.192c-1.981-3.046-5.7-5.311-9.4-4.283a7.482,7.482,0,0,0-5.485,7.081c-.247,3.835,1.314,7.961,4.6,10.087a2,2,0,1,0,2.019-3.454Z\" />\r\n                    <path class=\"c\" d=\"M105.936,105.522v22.294c0,2.574,4,2.578,4,0V105.522c0-2.573-4-2.578-4,0Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M107.241,131.608c-6.151,1.042-12.429,3.442-21.5,4.947,5.591,2.695,16.106,7.872,26.161,12.9,8.737-3.557,11.224-4.177,16.692-6.274C119.446,138.462,107.259,131.6,107.241,131.608Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M106.71,129.679c-7.252,1.256-14.23,3.722-21.5,4.948-1.664.28-1.971,2.935-.477,3.655,5.911,2.852,11.8,5.759,17.674,8.676q2.647,1.313,5.291,2.631c.924.461,1.843.932,2.771,1.384a3.16,3.16,0,0,0,3.079-.037q4.138-1.668,8.332-3.189c2.418-.87,4.845-1.716,7.246-2.634,1.479-.566,2.138-2.8.478-3.656-4.738-2.449-9.427-4.991-14.1-7.56-2.408-1.324-4.776-2.823-7.252-4.016-2.309-1.113-4.34,2.335-2.019,3.454,2.476,1.193,4.844,2.692,7.253,4.016,4.673,2.569,9.362,5.111,14.1,7.56l.478-3.655c-5.555,2.124-11.178,4.033-16.691,6.274l1.541.2c-8.7-4.35-17.4-8.678-26.161-12.9l-.478,3.656c7.27-1.226,14.247-3.691,21.5-4.948a2.016,2.016,0,0,0,1.4-2.46A2.046,2.046,0,0,0,106.71,129.679Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M123.346,140.87c.59-4.779,5.592-8.765,12.015-6,.97,2.982,2.655,7.49,3.691,11.258-1.412,1.142-2.633,2.134-2.633,2.134-2.066,2.494-6.63,2.045-9.112.535A8.247,8.247,0,0,1,123.346,140.87Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M134.669,132.487a10.875,10.875,0,0,0-8.109.606,9.931,9.931,0,0,0-4.665,5.356c-1.98,5.2,1.152,11.056,6.246,12.922,3.117,1.141,7.38.975,9.692-1.7a2.05,2.05,0,0,0,0-2.829,2.018,2.018,0,0,0-2.828,0c-.1.111-.2.212-.3.321-.066.074-.369.316-.058.08a5.244,5.244,0,0,1-.665.405c-.1.053-.449.166-.085.043-.113.038-.223.078-.337.112a6.626,6.626,0,0,1-.88.2c.4-.063,0,0-.107,0-.155.006-.309.019-.464.021-.281.005-.56-.014-.84-.026-.1,0-.51-.051-.12,0-.123-.016-.246-.038-.368-.061a9.5,9.5,0,0,1-.984-.233c-.257-.075-.509-.164-.76-.256.386.142-.264-.128-.372-.186a6.581,6.581,0,0,1-.663-.416c-.487-.338.161.14-.106-.082-.138-.114-.274-.23-.406-.35q-.288-.263-.555-.546c-.076-.082-.151-.165-.225-.25,0,0-.343-.419-.156-.179s-.129-.184-.131-.187c-.06-.087-.119-.175-.175-.264a7.953,7.953,0,0,1-.419-.741c-.056-.112-.109-.227-.161-.342.027.061.144.4.032.063-.076-.233-.16-.461-.224-.7-.05-.187-.09-.375-.129-.564-.007-.036-.075-.5-.031-.157.043.331-.01-.163-.014-.228a10.558,10.558,0,0,1,.027-1.331c-.026.449-.011.068.033-.155a8.044,8.044,0,0,1,.2-.805c.055-.176.124-.346.182-.521.14-.425-.164.268-.012.033.06-.094.1-.211.151-.311q.142-.276.306-.541c.071-.115.549-.764.2-.332a8.389,8.389,0,0,1,.849-.919c.076-.069.556-.463.334-.294-.261.2.115-.077.139-.093.119-.077.236-.157.358-.23.2-.124.414-.239.628-.343.025-.012.46-.2.158-.077-.285.118.182-.063.24-.082a7.626,7.626,0,0,1,.788-.226c.176-.041.871-.13.375-.084a12.728,12.728,0,0,1,1.779-.018c.086,0,.392.047-.023-.011.174.024.347.055.519.089.359.071.712.165,1.063.27a2,2,0,1,0,1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M140.793,118.459c-.076-.534-.03-.233,0,.079.022.262.043.523.062.785.053.749.093,1.5.128,2.249.075,1.641.13,3.289.091,4.932-.007.321-.017.643-.039.964-.012.187-.024.9-.022.364,0,.529-.181,0,.074-.043-.281.052-.819.627-1.112.863-2.011,1.624-3.965,3.316-5.98,4.934a1.945,1.945,0,0,0-.514,1.946c1.249,3.789,2.662,7.525,3.716,11.376a2.023,2.023,0,0,0,2.938,1.2c8.293-4.639,19.882-9.366,19.636-20.62a65.372,65.372,0,0,0-2.318-14.635,35.353,35.353,0,0,0-5.68-12.653c-3.28-4.3-7.191-8.592-12.034-11.146-2.276-1.2-4.3,2.251-2.019,3.454,3.864,2.038,7.016,5.321,9.762,8.665a30.465,30.465,0,0,1,5.578,10.824,74.983,74.983,0,0,1,2.479,12.581c.286,2.381.512,4.948-.422,7.222a13.139,13.139,0,0,1-3.494,4.572c-3.931,3.564-8.923,5.718-13.507,8.282l2.938,1.2c-1.054-3.852-2.467-7.588-3.716-11.377l-.515,1.946c2.155-1.73,4.238-3.549,6.4-5.27,1.5-1.191,1.765-2.354,1.838-4.189a53.6,53.6,0,0,0-.406-9.56,2.013,2.013,0,0,0-2.46-1.4,2.054,2.054,0,0,0-1.4,2.461Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M107.092,71.362A23.034,23.034,0,0,0,112.577,87.4,19.877,19.877,0,0,0,140.5,89.425a11.488,11.488,0,0,0,7.635-2.39,7.284,7.284,0,0,0,2.771-6.5,5.294,5.294,0,0,0-3.085-3.895,18.98,18.98,0,0,0-6.568-22.174c-8.9-6.321-21.474-5.451-28.785,2.866A22.461,22.461,0,0,0,107.092,71.362Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M109.989,60.831a22.736,22.736,0,0,0-2.6,7.5,38.071,38.071,0,0,0,15.638-1.885,1.087,1.087,0,0,1,.861.074c.631.355-.131,1.733-.487,2.363,2.24.631,7.725-.4,10.149-1.732,1.348,3.276,2.723,4.983,5.365,6.22L146.01,76.2a5.059,5.059,0,0,1,1.813.445,18.994,18.994,0,0,0-6.574-22.177c-8.9-6.321-21.474-5.451-28.785,2.866A20.56,20.56,0,0,0,109.989,60.831Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M150.058,76.325a21.143,21.143,0,0,0-7.006-22.991,24.253,24.253,0,0,0-23.614-3.308c-8.2,3.365-13.342,11.021-14.234,19.729a24.632,24.632,0,0,0,10.012,22.638c8.186,5.716,20.023,4.71,27.263-2.075,1.883-1.764-.95-4.588-2.828-2.828a18.21,18.21,0,0,1-20.042,2.862c-6.732-3.362-10.491-10.586-10.532-17.961-.039-7.089,3.334-13.988,9.583-17.57a20.1,20.1,0,0,1,19.62.129A17.181,17.181,0,0,1,146.2,75.261c-.792,2.456,3.069,3.508,3.857,1.064Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M146.01,78.2c.471.033-.219-.087.2.022.178.047.358.084.534.141.1.033.51.228.207.073.165.084.329.17.486.267.072.045.464.329.2.117a5.192,5.192,0,0,1,.412.373,4.848,4.848,0,0,1,.372.413c-.234-.3.072.134.113.2a4.82,4.82,0,0,1,.261.492c-.16-.356.034.139.057.22a4.123,4.123,0,0,1,.123.55c-.057-.395-.006.159,0,.242,0,.2-.009.39-.02.585-.024.447.068-.152-.042.247-.089.326-.263.956-.321,1.091a6.862,6.862,0,0,1-1.064,1.637,5.874,5.874,0,0,1-1.734,1.338,7.976,7.976,0,0,1-2.148.885,11.555,11.555,0,0,1-1.275.283q-.213.033,0,0c-.106.012-.212.023-.318.031-.245.021-.489.032-.735.038a2,2,0,0,0,0,4c4.771-.117,9.592-2.7,11.213-7.38a7.458,7.458,0,0,0-.689-6.514A7.567,7.567,0,0,0,146.01,74.2a2.01,2.01,0,0,0-2,2,2.049,2.049,0,0,0,2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M119.708,78.637a3.162,3.162,0,0,1-1.29,2.382,2.459,2.459,0,0,1-1.811.343,2.76,2.76,0,0,1-1.993-1.5,3.228,3.228,0,0,1,.8-3.714,2.555,2.555,0,0,1,3.474.191A2.845,2.845,0,0,1,119.708,78.637Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M131.867,81.121a3.172,3.172,0,0,1-1.29,2.382,2.464,2.464,0,0,1-1.812.342,2.756,2.756,0,0,1-1.992-1.5,3.228,3.228,0,0,1,.8-3.714,2.554,2.554,0,0,1,3.473.191A2.85,2.85,0,0,1,131.867,81.121Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M131.625,67.684a17.412,17.412,0,0,0,2.686,4.728,10.642,10.642,0,0,0,3.6,2.688,2.156,2.156,0,0,0,1.541.2,2,2,0,0,0,.478-3.655,10.46,10.46,0,0,1-1.915-1.148l.4.313a8.786,8.786,0,0,1-1.543-1.558l.312.4a15.01,15.01,0,0,1-1.787-3.229l.2.478c-.04-.095-.08-.19-.119-.285a2.2,2.2,0,0,0-.919-1.195,2,2,0,0,0-2.737.717,1.929,1.929,0,0,0-.2,1.541Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M132.544,65.426c-2.283,1.2-6.187,2.135-8.608,1.53l1.195,2.938c.77-1.376,1.61-3.289.324-4.65-1.486-1.572-3.6-.465-5.3,0a37.754,37.754,0,0,1-12.112,1.136c-2.572-.142-2.564,3.858,0,4a43.455,43.455,0,0,0,8.119-.279c1.268-.168,2.527-.384,3.773-.675q.969-.227,1.923-.505.535-.156,1.064-.329c.142-.045.284-.092.425-.141q.42-.145.01,0l-.882-.514.149.135-.514-.883c-.2-.478.174-.436-.053-.035-.134.236-.249.484-.382.721a2.022,2.022,0,0,0,1.195,2.938,14.522,14.522,0,0,0,5.9-.1,19.353,19.353,0,0,0,5.794-1.833c2.278-1.2.259-4.655-2.019-3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M142.875,125.491A118.442,118.442,0,0,0,156.9,126.9a2,2,0,0,0,0-4,110.619,110.619,0,0,1-12.963-1.262,2.063,2.063,0,0,0-2.46,1.4,2.016,2.016,0,0,0,1.4,2.46Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M94.579,106.311l11.58,7.527a2.014,2.014,0,0,0,2.736-.717,2.045,2.045,0,0,0-.717-2.737L96.6,102.857a2.016,2.016,0,0,0-2.737.717,2.046,2.046,0,0,0,.718,2.737Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M204.272,29.351c.348,0,.686.023,1.023.05a15.282,15.282,0,0,1,26.589,1.3c.487-.044.982-.072,1.488-.072A14.59,14.59,0,0,1,248.25,45.42c0,8.921-6.211,15.064-14.879,15.064a15.035,15.035,0,0,1-9.871-3.339,11.646,11.646,0,0,1-7.662,2.668c-5.374,0-9.306-2.849-10.845-7.29-.24.013-.476.033-.721.033-7,0-11.566-4.821-11.566-11.71A11.332,11.332,0,0,1,204.272,29.351Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M285.161,89.948c.271,0,.534.018.8.039A11.9,11.9,0,0,1,306.665,91c.38-.034.765-.056,1.159-.056a11.363,11.363,0,0,1,11.588,11.517c0,6.948-4.838,11.732-11.589,11.732a11.71,11.71,0,0,1-7.687-2.6,9.071,9.071,0,0,1-5.968,2.078c-4.185,0-7.247-2.22-8.446-5.678-.187.01-.371.025-.562.025-5.449,0-9.007-3.754-9.007-9.12A8.825,8.825,0,0,1,285.161,89.948Z\" />\r\n                    <path class=\"d\"\r\n                        d=\"M19.568,2.428a18.8,18.8,0,0,1,22.737,14.61c2.41,11.238-3.756,20.655-14.675,23C16.291,42.465,7.211,36.241,4.817,25.075A18.781,18.781,0,0,1,19.568,2.428Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M20.1,4.357a16.974,16.974,0,0,1,18.511,8.372c3.325,6.09,3.063,14.46-1.615,19.794A18.9,18.9,0,0,1,17.449,37.7c-6.609-2.2-10.7-9.024-11.05-15.78A17.106,17.106,0,0,1,9.684,10.8,17.513,17.513,0,0,1,20.1,4.357C22.611,3.8,21.548-.061,19.037.5A21.028,21.028,0,0,0,2.469,18.967C1.639,27.346,6,36.608,13.673,40.429c7.783,3.877,17.884,2.286,24.409-3.35,6.608-5.707,8.334-15.481,5.291-23.487A21.169,21.169,0,0,0,34.194,2.667,21.584,21.584,0,0,0,19.037.5C16.517,1.017,17.583,4.874,20.1,4.357Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M38.5,64.87q-1.306-5.12-2.612-10.24a2,2,0,0,0-3.857,1.063q1.305,5.121,2.612,10.241A2,2,0,0,0,38.5,64.87Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M12.442,56.709q-1.226,13.047-2.431,26.1a2.015,2.015,0,0,0,2,2,2.043,2.043,0,0,0,2-2q1.215-13.049,2.431-26.1a2.015,2.015,0,0,0-2-2,2.043,2.043,0,0,0-2,2Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M70.865,10.592,59.679,12.667a2.01,2.01,0,0,0-1.4,2.46,2.052,2.052,0,0,0,2.46,1.4l11.186-2.075a2.011,2.011,0,0,0,1.4-2.461,2.053,2.053,0,0,0-2.46-1.4Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M83.5,38.612q-11.9-3.678-23.8-7.364c-2.465-.762-3.519,3.1-1.063,3.857q11.9,3.675,23.8,7.364c2.465.762,3.519-3.1,1.063-3.857Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M63.569,60.033q-6.422-6.656-12.838-13.314A2,2,0,0,0,47.9,49.547Q54.32,56.206,60.74,62.862a2,2,0,0,0,2.829-2.829Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M204.272,31.351c.343.007.681.025,1.023.05a1.99,1.99,0,0,0,1.727-.991,13.2,13.2,0,0,1,12.372-6.1,12.942,12.942,0,0,1,10.763,7.4,1.943,1.943,0,0,0,1.727.99,13.461,13.461,0,0,1,9.658,2.681,12.831,12.831,0,0,1,4.611,8.279C247,50.193,243.326,56.52,236.8,58.1a13.977,13.977,0,0,1-11.882-2.367,2.076,2.076,0,0,0-2.828,0c-4.811,3.948-13,2.237-15.165-3.739a2.053,2.053,0,0,0-1.928-1.469,9.958,9.958,0,0,1-7.182-2.146,9.5,9.5,0,0,1-3.08-6.667,9.537,9.537,0,0,1,9.541-10.359c2.572-.035,2.579-4.035,0-4a13.533,13.533,0,0,0-12.965,9.432c-1.673,5.4.071,11.8,4.649,15.2a13.9,13.9,0,0,0,9.037,2.538l-1.929-1.468a12.827,12.827,0,0,0,8.5,8.171,14.605,14.605,0,0,0,13.352-2.667h-2.828c6.94,5.683,18.437,5.289,24.291-1.849a17.746,17.746,0,0,0-.853-23.088,17.074,17.074,0,0,0-13.64-4.918l1.727.991a16.959,16.959,0,0,0-14.217-9.386,17.181,17.181,0,0,0-15.826,8.082l1.727-.99c-.342-.025-.68-.043-1.023-.05C201.7,27.3,201.7,31.3,204.272,31.351Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M285.161,91.948c.266,0,.531.015.8.039A1.993,1.993,0,0,0,287.684,91a9.827,9.827,0,0,1,9.13-4.54,9.66,9.66,0,0,1,8.124,5.556,1.945,1.945,0,0,0,1.727.99,9.837,9.837,0,0,1,8.734,3.49,10.235,10.235,0,0,1,1.64,8.928,8.887,8.887,0,0,1-5.449,6.126,10.593,10.593,0,0,1-10.04-1.365,2.079,2.079,0,0,0-2.829,0c-3.5,2.847-9.482,1.61-11.071-2.717A2.053,2.053,0,0,0,285.722,106c-4.01.233-7.3-2.279-7.549-6.4a6.987,6.987,0,0,1,6.988-7.643c2.571-.045,2.579-4.045,0-4a11.01,11.01,0,0,0-10.988,11.643A10.777,10.777,0,0,0,285.722,110l-1.929-1.468a10.478,10.478,0,0,0,7.008,6.7,11.858,11.858,0,0,0,10.749-2.215h-2.829c5.564,4.522,14.655,4.326,19.441-1.317a14.262,14.262,0,0,0-.561-18.73A13.742,13.742,0,0,0,306.665,89l1.727.991a13.677,13.677,0,0,0-11.578-7.537,13.829,13.829,0,0,0-12.584,6.522l1.727-.991c-.265-.024-.53-.036-.8-.039C282.586,87.875,282.588,91.875,285.161,91.948Z\" />\r\n                    <path class=\"a\"\r\n                        d=\"M221.244,122.171c0,3.2-2.231,6.364-6.418,8.782a31.725,31.725,0,0,1-30.733.109c-4.575-2.641-6.816-5.861-6.672-9.084.039-3.092,2.28-6.16,6.67-8.7l30.735.115c4.189,2.419,6.419,5.571,6.419,8.775\" />\r\n                    <path class=\"d\"\r\n                        d=\"M212.314,111.441c-2.9-3.587-7.406-5.718-12.982-5.718-7.533,0-13.406,4.158-15.637,10.7a4.571,4.571,0,0,0,1.182,1.386,5.849,5.849,0,0,0,3.645,1.011,12.765,12.765,0,0,1,1.313.1,17.845,17.845,0,0,0,19.3-.017,7.77,7.77,0,0,1,1.007-.085,5.829,5.829,0,0,0,3.645-1.011,4.557,4.557,0,0,0,1.2-1.426A15.7,15.7,0,0,0,212.314,111.441Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M217.945,122.543c-.057-7.311-3.632-14.262-10.554-17.224-7.092-3.034-16.195-1.8-21.625,3.887a19.348,19.348,0,0,0-5.046,13.185c-.046,2.575,3.954,2.576,4,0,.121-6.746,4-12.6,10.724-14.226,5.566-1.346,12.143.191,15.651,4.951a15.916,15.916,0,0,1,2.85,9.427c.02,2.573,4.02,2.579,4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M193.76,110.225a57.18,57.18,0,0,0-5.278-8.892,2.048,2.048,0,0,0-2.737-.718,2.023,2.023,0,0,0-.717,2.737,57.1,57.1,0,0,1,5.278,8.892,2.011,2.011,0,0,0,2.737.718,2.054,2.054,0,0,0,.717-2.737Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M189.633,121.156a20.177,20.177,0,0,0,19.4.167c2.265-1.227.247-4.682-2.019-3.454a16.031,16.031,0,0,1-15.361-.167c-2.243-1.271-4.261,2.184-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M213.816,115.118c.489.285.969.585,1.433.908q.181.126.361.258c.049.036.381.293.144.106s.085.07.133.109q.162.132.321.27a13.765,13.765,0,0,1,1.02.972q.242.255.469.525c.067.079.131.161.2.241.125.15-.279-.378-.015-.014a9.842,9.842,0,0,1,.665,1.047c.1.183.19.371.28.559.142.3-.022.013-.047-.119a2.408,2.408,0,0,0,.116.309,7.539,7.539,0,0,1,.308,1.146c.015.083.058.414.014.049s-.007-.035,0,.049c.019.211.027.422.029.633a2,2,0,0,0,4,0c-.036-4.693-3.595-8.28-7.41-10.5a2,2,0,0,0-2.019,3.454Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M183.081,111.549c-3.824,2.232-7.624,5.755-7.661,10.513a2,2,0,0,0,4,0c0-.2.01-.4.028-.6.008-.086.045-.406,0-.036s0,.051.013-.035a7.058,7.058,0,0,1,.3-1.1c.035-.1.085-.2.114-.3-.159.537-.1.236-.028.083s.163-.33.252-.491a10.733,10.733,0,0,1,.725-1.114c.142-.2-.281.344-.052.07.079-.1.157-.19.238-.284q.23-.266.474-.517c.344-.355.708-.691,1.085-1.01q.135-.114.273-.225c.078-.064.409-.389.051-.044a5.312,5.312,0,0,1,.667-.482c.5-.347,1.017-.669,1.542-.975a2,2,0,1,0-2.019-3.454Z\" />\r\n                    <path class=\"b\"\r\n                        d=\"M177.979,127.264a25.83,25.83,0,0,1-.56-5.09c0,.035,0,.069,0,.1,0,3.123,2.242,6.225,6.675,8.784a31.725,31.725,0,0,0,30.733-.109c4.187-2.418,6.418-5.577,6.418-8.782,0-.042,0-.084,0-.127-.1,12.933-8.732,21.96-21.912,21.96-10.138,0-17.995-5.707-20.8-14.638Q178.21,128.342,177.979,127.264Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M219.244,121.818c-.046,7.819-3.7,15.315-11.143,18.511-7.542,3.239-17.344,1.954-23.184-3.991a20.588,20.588,0,0,1-5.5-14.32c-.039-2.571-4.039-2.579-4,0a25.225,25.225,0,0,0,5.391,15.713,22.512,22.512,0,0,0,12,7.488c9.41,2.344,20.01-.451,25.885-8.415a25.422,25.422,0,0,0,4.546-14.986c.015-2.574-3.985-2.577-4,0Z\" />\r\n                    <path class=\"c\"\r\n                        d=\"M175.418,122.278c.178,8.149,10.016,12.569,16.824,13.971a33.724,33.724,0,0,0,23.98-3.8c3.7-2.247,6.923-5.74,7.022-10.28.056-2.575-3.944-2.574-4,0-.063,2.9-2.366,5.129-4.665,6.593a27.542,27.542,0,0,1-9.461,3.663,29.221,29.221,0,0,1-19.844-2.994c-2.624-1.49-5.783-3.827-5.856-7.155-.055-2.57-4.056-2.579-4,0Z\" />\r\n                </svg>\r\n            </h1>\r\n\r\n            <div class=\"list-search flex mrgn-bottom-400\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                    <path\r\n                        d=\"M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z\" />\r\n                </svg>\r\n                <input class=\"list-search-input flex\" type=\"text\" placeholder=\"Search in your list...\">\r\n\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                    <path\r\n                        d=\"M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z\" />\r\n                </svg>\r\n            </div>\r\n\r\n            <div class=\"flex filter-section\">\r\n                <div class=\"flex ai-items-center jc-center fs-filter-card\"><span>Read</span><span>x</span></div>\r\n                <div class=\"flex fs-filter-card\"><span>Currently Reading</span><span>x</span></div>\r\n                <div class=\"flex fs-filter-card\"><span>Want to Read</span><span>x</span></div>\r\n            </div>\r\n\r\n        </header>\r\n\r\n        <main class=\"grid\">\r\n            <svg data-global-action=\"add\" class=\"as-center js-center mrgn-bottom-800\" xmlns=\"http://www.w3.org/2000/svg\"\r\n                height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\">\r\n                <path\r\n                    d=\"M453-280h60v-166h167v-60H513v-174h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z\" />\r\n            </svg>\r\n\r\n            <ul class=\"books\">\r\n            </ul>\r\n        </main>\r\n    </div>\r\n\r\n</body>\r\n</html>";
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
/* harmony import */ var _controller_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller.js */ "./src/controller.js");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.html */ "./src/index.html");



const appController = (0,_controller_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUc7Ozs7Ozs7VUN4THJHO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ055QztBQUNuQjtBQUNVO0FBRWhDLE1BQU1FLGFBQWEsR0FBRzNDLDBEQUFVLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9ib29rRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2Jvb2tNb2RlbC5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2NvbXBvbmVudHMvYWRkQm9va01vZGFsL2FkZEJvb2tNb2RhbC5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2NvbXBvbmVudHMvYm9va0NhcmQvYm9va0NhcmQuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9jb21wb25lbnRzL3JhdGluZ1N0YXJzL3JhdGluZ1N0YXJzLmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9pbmRleC5odG1sIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29tcG9uZW50cy9hZGRCb29rTW9kYWwvYWRkQm9va01vZGFsLmNzcz82ZGEwIiwid2VicGFjazovL2xpYnJhcnkvLi9zcmMvY29tcG9uZW50cy9ib29rQ2FyZC9ib29rQ2FyZC5jc3M/OTg2OCIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL3N0eWxlcy5jc3M/MTU1MyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9uYXRpdmUuanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL2xpYnJhcnkvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5Ly4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC93cmFwLWlkYi12YWx1ZS5qcyIsIndlYnBhY2s6Ly9saWJyYXJ5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xpYnJhcnkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2xpYnJhcnkvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9saWJyYXJ5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGlicmFyeS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBib29rRmFjdG9yeSh0aXRsZSwgYXV0aG9yLCBzdGF0dXMsIHJhdGluZykge1xyXG4gIHJldHVybiB7IHRpdGxlLCBhdXRob3IsIHN0YXR1cywgcmF0aW5nIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgb3BlbkRCLCBkZWxldGVEQiwgd3JhcCwgdW53cmFwIH0gZnJvbSBcImlkYlwiO1xyXG5pbXBvcnQgZW51bUZhY3RvcnkgZnJvbSBcIi4vaGVscGVycy5qc1wiO1xyXG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYm9va01vZGVsRmFjdG9yeSgpIHtcclxuICBsZXQgZGI7XHJcbiAgbGV0IGJvb2tzO1xyXG4gIGNvbnN0IGJvb2tTdGF0dXMgPSBlbnVtRmFjdG9yeShbXCJSZWFkXCIsIFwiV2FudCB0byBSZWFkXCIsIFwiQ3VycmVudGx5IFJlYWRpbmdcIl0pO1xyXG5cclxuICAvKiBXaHkgZG9lcyB0aGlzIGdpdmUgXCJpbnZhbGlkIGludm9jYXRvciBlcnJvciBvbiAuYWRkRXZlbnRMaXN0ZW5lciwgd2hhdHMgdGhlIGRpZmZlcmVuY2UgdG8gY29uc3RydWN0b3IgZnVuY3Rpb24/XCIgKi9cclxuICAvKiAgIGxldCBib29rTW9kZWwgPSBPYmplY3QuY3JlYXRlKEV2ZW50VGFyZ2V0LnByb3RvdHlwZSk7ICovXHJcblxyXG4gIGNvbnN0IGJvb2tNb2RlbCA9IG5ldyBFdmVudFRhcmdldCgpO1xyXG5cclxuICBib29rTW9kZWwuYWRkID0gX2FkZDtcclxuICBib29rTW9kZWwuZWRpdEJvb2sgPSBfZWRpdEJvb2s7XHJcbiAgYm9va01vZGVsLmdldEJvb2tzID0gX2dldEJvb2tzO1xyXG4gIGJvb2tNb2RlbC51cGRhdGVCb29rUmF0aW5nID0gX3VwZGF0ZUJvb2tSYXRpbmc7XHJcbiAgYm9va01vZGVsLmdldEJvb2tSYXRpbmcgPSBfZ2V0Qm9va1JhdGluZztcclxuICBib29rTW9kZWwuZGVsZXRlQm9vayA9IF9kZWxldGVCb29rO1xyXG5cclxuICBhd2FpdCBpbml0TW9kZWwoKTtcclxuXHJcbiAgcmV0dXJuIGJvb2tNb2RlbDtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdE1vZGVsKCkge1xyXG4gICAgYm9va3MgPSBbXTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRiID0gYXdhaXQgZ2V0RGF0YWJhc2UoKTtcclxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbXCJib29rc1wiXSwgXCJyZWFkb25seVwiKTtcclxuICAgICAgY29uc3Qgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcImJvb2tzXCIpO1xyXG4gICAgICBib29rcyA9IGF3YWl0IHN0b3JlLmdldEFsbCgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0YWJhc2UoKSB7XHJcbiAgICByZXR1cm4gb3BlbkRCKFwiYm9va1N0b3JhZ2VcIiwgMSwgeyB1cGdyYWRlIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBncmFkZShkYikge1xyXG4gICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFwiYm9va3NcIikpIHtcclxuICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoXCJib29rc1wiLCB7IGtleVBhdGg6IFwidXVpZFwiIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FkZChhZGRCb29rRXZlbnQpIHtcclxuICAgIGNvbnN0IGJvb2tUb0FkZCA9IGFkZEJvb2tFdmVudC5kZXRhaWw7XHJcbiAgICBib29rVG9BZGQudXVpZCA9IHV1aWR2NCgpO1xyXG5cclxuICAgIGJvb2tzLnB1c2goYm9va1RvQWRkKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzY2hhaXNpbm5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZWRpdEJvb2soZWRpdEJvb2tFdmVudCkge1xyXG4gICAgY29uc3QgYm9va1RvRWRpdCA9IGVkaXRCb29rRXZlbnQuZGV0YWlsO1xyXG4gICAgYm9va3MgPSBib29rcy5tYXAoKGJvb2spID0+IHtcclxuICAgICAgaWYgKChib29rLnV1aWQgPSBib29rVG9FZGl0LnV1aWQpKSByZXR1cm4gYm9va1RvRWRpdDtcclxuICAgICAgcmV0dXJuIGJvb2s7XHJcbiAgICB9KTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzY2hhaXNpbm5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdXBkYXRlQm9va1JhdGluZyhib29rSUQsIG5ld1JhdGluZykge1xyXG4gICAgYm9va3MgPSBib29rcy5tYXAoKGJvb2spID0+IHtcclxuICAgICAgaWYgKGJvb2suaWQgIT0gYm9va0lEKSByZXR1cm4gYm9vaztcclxuXHJcbiAgICAgIGlmIChib29rLnJhdGluZyA9PSBuZXdSYXRpbmcpIHtcclxuICAgICAgICBib29rLnJhdGluZyA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYm9vay5yYXRpbmcgPSBuZXdSYXRpbmc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJvb2s7XHJcbiAgICB9KTtcclxuICAgIHVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2dldEJvb2tSYXRpbmcoYm9va0lEKSB7XHJcbiAgICByZXR1cm4gYm9va3MuZmluZCgoYm9vaykgPT4gYm9vay5pZCA9PSBib29rSUQpLnJhdGluZztcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9kZWxldGVCb29rKGJvb2tVVUlEKSB7XHJcbiAgICBib29rcyA9IGJvb2tzLmZpbHRlcigoYm9vaykgPT4gYm9vay51dWlkICE9IGJvb2tVVUlEKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oXCJib29rc1wiLCBcInJlYWR3cml0ZVwiKTtcclxuICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShcImJvb2tzXCIpO1xyXG4gICAgICBhd2FpdCBvYmplY3RTdG9yZS5kZWxldGUoYm9va1VVSUQpO1xyXG4gICAgICBib29rTW9kZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVcIikpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgYm9va01vZGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidXBkYXRlRmFpbHVyZVwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKFwiYm9va3NcIiwgXCJyZWFkd3JpdGVcIik7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKFwiYm9va3NcIik7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgYm9va3MuZm9yRWFjaCgoYm9vaykgPT4gc3RvcmUucHV0KGJvb2spKTtcclxuLyogICAgICAgYm9va3MgPSBhd2FpdCBzdG9yZS5nZXRBbGwoKTsgLy8gVGhpcyBzdWNrcyBhbmQgaXMgZG9uZSwgYmVjYXVzZSBvZiBhdXRvSW5jcmVtZW50IElELiAqL1xyXG4gICAgICBib29rTW9kZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ1cGRhdGVcIikpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgYm9va01vZGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidXBkYXRlRmFpbHVyZVwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogV2h5IGRvZXMgdGhpcyBub3Qgd29yaz8gKi9cclxuICAgIC8qICAgICB0cnkge1xyXG4gICAgICBjb25zdCBibGEgPSBhd2FpdCBQcm9taXNlLmFsbChib29rcy5tYXAoKGJvb2spID0+IHN0b3JlLnB1dChib29rKSkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJibGFcIik7XHJcbiAgICB9ICovXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZ2V0Qm9va3MoKSB7XHJcbiAgICByZXR1cm4gYm9va3M7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBcIi4vYWRkQm9va01vZGFsLmNzc1wiO1xyXG5pbXBvcnQgcmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5IGZyb20gXCIuLi9yYXRpbmdTdGFycy9yYXRpbmdTdGFyc1wiO1xyXG5pbXBvcnQgYm9va0ZhY3RvcnkgZnJvbSBcIi4uLy4uL2Jvb2tGYWN0b3J5LmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRCb29rTW9kYWxDb21wb25lbnRGYWN0b3J5KFxyXG4gIGJvb2ssXHJcbiAgZm9ybUhlYWRlcixcclxuICBidXR0b25UZXh0LFxyXG4gIG1vZGVcclxuKSB7XHJcbiAgbGV0IGZvcm1XcmFwcGVyO1xyXG4gIGxldCBjdXJyZW50UmF0aW5nO1xyXG5cclxuICBjb25zdCBib29rTW9kYWxDb21wb25lbnQgPSBuZXcgRXZlbnRUYXJnZXQoKTtcclxuICBib29rTW9kYWxDb21wb25lbnQuY3JlYXRlQm9va01vZGFsRE9NTm9kZSA9IGNyZWF0ZUJvb2tNb2RhbERPTU5vZGU7XHJcblxyXG4gIGNvbnN0IHJhdGluZ1N0YXJzQ29tcG9uZW50ID0gcmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5KFxyXG4gICAgZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXHJcbiAgICAgIFwiLS1jbHItc2Vjb25kYXJ5LWFjY2VudFwiXHJcbiAgICApLFxyXG4gICAgZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCItLWNsci13aGl0ZVwiKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiBib29rTW9kYWxDb21wb25lbnQ7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUJvb2tNb2RhbERPTU5vZGUoKSB7XHJcbiAgICBjcmVhdGVGb3JtV3JhcHBlck5vZGUoKTtcclxuICAgIGluaXRFdmVudExpc3RlbmVycygpO1xyXG4gICAgcmV0dXJuIGZvcm1XcmFwcGVyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRm9ybVdyYXBwZXJOb2RlKCkge1xyXG4gICAgZm9ybVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGZvcm1XcmFwcGVyLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgIFwiZm9ybS13cmFwcGVyXCIsXHJcbiAgICAgIFwicG9zLWFic1wiLFxyXG4gICAgICBcImluc2V0MFwiLFxyXG4gICAgICBcImdyaWRcIixcclxuICAgICAgXCJwaS1jZW50ZXJcIlxyXG4gICAgKTtcclxuXHJcbiAgICBmb3JtV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIHJldHVybkJvb2tNb2RhbEhUTUwoKSk7XHJcbiAgICBjdXJyZW50UmF0aW5nID0gYm9vay5yYXRpbmc7XHJcbiAgICByYXRpbmdTdGFyc0NvbXBvbmVudC5jb2xvcml6ZVJhdGluZ1N0YXJzKFxyXG4gICAgICBjdXJyZW50UmF0aW5nLFxyXG4gICAgICBmb3JtV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwicmF0aW5nXCJdJylcclxuICAgICk7XHJcbiAgICBmb3JtV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKS5jbGFzc0xpc3QuYWRkKFwicG9wdXAtZW50cmFuY2UtYW5pbWF0aW9uXCIpO1xyXG4gICAgZm9ybVdyYXBwZXIuY2xhc3NMaXN0LmFkZChcIndyYXBwZXItZW50cmFuY2UtYW5pbWF0aW9uXCIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgaW5pdENvcnJlY3RCdXR0b25MaXN0ZW5lckFjY29yZGluZ1RvTW9kZSgpO1xyXG4gICAgZm9ybVdyYXBwZXJcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFkZC1ib29rPVwiY2xvc2VcIl0nKVxyXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUJvb2tNb2RhbCk7XHJcblxyXG4gICAgZm9ybVdyYXBwZXJcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zdGFyLW51bWJlcl1cIilcclxuICAgICAgLmZvckVhY2goKHN0YXIpID0+IHN0YXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoYW5nZVJhdGluZykpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRDb3JyZWN0QnV0dG9uTGlzdGVuZXJBY2NvcmRpbmdUb01vZGUoKSB7XHJcbiAgICAgIGlmIChtb2RlID09IFwiZWRpdFwiKSB7XHJcbiAgICAgICAgZm9ybVdyYXBwZXJcclxuICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hZGQtYm9vaz1cImVkaXRcIl0nKVxyXG4gICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlZGl0Qm9vayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9ybVdyYXBwZXJcclxuICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hZGQtYm9vaz1cImFkZFwiXScpXHJcbiAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZEJvb2spO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRCb29rKCkge1xyXG4gICAgLyogICAgIGNvbnN0IGJvb2tUb0FkZCA9IHtcclxuICAgICAgdGl0bGU6IFwiXCIsXHJcbiAgICAgIGF1dGhvcjogXCJcIixcclxuICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICByYXRpbmc6IFwiXCIsXHJcbiAgICB9O1xyXG4gICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWJvb2tdXCIpLmZvckVhY2goKG1ldGFJbmZvKSA9PiB7XHJcbiAgICAgIGlmIChtZXRhSW5mby5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJvb2tcIikgPT09IFwidGl0bGVcIikge1xyXG4gICAgICAgIGJvb2tUb0FkZC50aXRsZSA9IG1ldGFJbmZvLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChtZXRhSW5mby5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJvb2tcIikgPT09IFwiYXV0aG9yXCIpIHtcclxuICAgICAgICBib29rVG9BZGQuYXV0aG9yID0gbWV0YUluZm8udmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1ldGFJbmZvLmdldEF0dHJpYnV0ZShcImRhdGEtYm9va1wiKSA9PT0gXCJzdGF0dXNcIikge1xyXG4gICAgICAgIGJvb2tUb0FkZC5zdGF0dXMgPSBtZXRhSW5mby52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobWV0YUluZm8uZ2V0QXR0cmlidXRlKFwiZGF0YS1ib29rXCIpID09PSBcInJhdGluZ1wiKSB7XHJcbiAgICAgICAgYm9va1RvQWRkLnJhdGluZyA9IGN1cnJlbnRSYXRpbmc7XHJcbiAgICAgIH1cclxuICAgIH0pOyAqL1xyXG4gICAgLyogXHJcbiAgICBib29rVG9BZGQgPSBib29rRmFjdG9yeShcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignXCJbZGF0YS1ib29rPXRpdGxlXVwiJykudmFsdWUsXHJcbiAgICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1wiW2RhdGEtYm9vaz1hdXRob3JdXCInKS52YWx1ZSxcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignXCJbZGF0YS1ib29rPXN0YXR1c11cIicpLnZhbHVlLFxyXG4gICAgICBjdXJyZW50UmF0aW5nXHJcbiAgICApOyAqL1xyXG5cclxuICAgIHJlbW92ZUJvb2tNb2RhbCgpO1xyXG4gICAgY29uc3QgYWRkQm9va0V2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiYWRkQm9va1wiLCB7XHJcbiAgICAgIGRldGFpbDogY3JlYXRlQm9va09iamVjdEZyb21Vc2VySW5wdXQoKSxcclxuICAgIH0pO1xyXG4gICAgYm9va01vZGFsQ29tcG9uZW50LmRpc3BhdGNoRXZlbnQoYWRkQm9va0V2ZW50KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVkaXRCb29rKCkge1xyXG4gICAgcmVtb3ZlQm9va01vZGFsKCk7XHJcbiAgICBjb25zdCBib29rVG9FZGl0ID0gY3JlYXRlQm9va09iamVjdEZyb21Vc2VySW5wdXQoKTtcclxuICAgIGJvb2tUb0VkaXQudXVpZCA9IGJvb2sudXVpZDtcclxuICAgIGNvbnN0IGVkaXRCb29rRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlZGl0Qm9va1wiLCB7XHJcbiAgICAgIGRldGFpbDogYm9va1RvRWRpdCxcclxuICAgIH0pO1xyXG4gICAgYm9va01vZGFsQ29tcG9uZW50LmRpc3BhdGNoRXZlbnQoZWRpdEJvb2tFdmVudCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVCb29rT2JqZWN0RnJvbVVzZXJJbnB1dCgpIHtcclxuICAgIHJldHVybiBib29rRmFjdG9yeShcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInRpdGxlXCJdJykudmFsdWUsXHJcbiAgICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJvb2s9XCJhdXRob3JcIl0nKS52YWx1ZSxcclxuICAgICAgZm9ybVdyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInN0YXR1c1wiXScpLnZhbHVlLFxyXG4gICAgICBjdXJyZW50UmF0aW5nXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlQm9va01vZGFsKGV2ZW50KSB7XHJcbiAgICBmb3JtV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwid3JhcHBlci1jbG9zaW5nLWFuaW1hdGlvblwiKTtcclxuICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpLmNsYXNzTGlzdC5hZGQoXCJwb3B1cC1jbG9zaW5nLWFuaW1hdGlvblwiKTtcclxuICAgIGZvcm1XcmFwcGVyXHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hZGQtYm9vaz1cImNsb3NlXCJdJylcclxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmVCb29rTW9kYWwpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGZvcm1XcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH0sIDQwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaGFuZ2VSYXRpbmcoZXZlbnQpIHtcclxuICAgIGlmIChjdXJyZW50UmF0aW5nID09IGV2ZW50LnRhcmdldC5kYXRhc2V0LnN0YXJOdW1iZXIpIHtcclxuICAgICAgY3VycmVudFJhdGluZyA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50UmF0aW5nID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuc3Rhck51bWJlcjtcclxuICAgIH1cclxuICAgIHJhdGluZ1N0YXJzQ29tcG9uZW50LmNvbG9yaXplUmF0aW5nU3RhcnMoXHJcbiAgICAgIGN1cnJlbnRSYXRpbmcsXHJcbiAgICAgIGZvcm1XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJvb2s9XCJyYXRpbmdcIl0nKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJldHVybkJvb2tNb2RhbEhUTUwoKSB7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8Zm9ybSBjbGFzcz1cImFkZC1ib29rLWZvcm0gcG9zLXJlbFwiIG9uc3VibWl0PVwicmV0dXJuIGZhbHNlO1wiIGFjdGlvbj1cIlwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLWFkZC1ib29rPVwiY2xvc2VcIiBjbGFzcz1cImFkZC1ib29rLWZvcm1fX2Nsb3NlLWJ1dHRvbiBwb3MtYWJzIGNsci13aGl0ZVwiPlg8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxsZWdlbmQgY2xhc3M9XCJjbHItd2hpdGUgbXJnbi1ib3R0b20tNzAwXCI+JHtmb3JtSGVhZGVyfTwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPkJvb2sgVGl0bGU8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGRhdGEtYm9vaz1cInRpdGxlXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7Ym9vay50aXRsZX1cIj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+QXV0aG9yPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBkYXRhLWJvb2s9XCJhdXRob3JcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHtcclxuICAgICAgICAgICAgICAgICAgICAgIGJvb2suYXV0aG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8cD5TdGF0dXM8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGRhdGEtYm9vaz1cInN0YXR1c1wiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCIke1xyXG4gICAgICAgICAgICAgICAgICAgICAgYm9vay5zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICB9XCI+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPlJhdGluZzwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYm9vaz1cInJhdGluZ1wiIGNsYXNzPVwiZmxleCByYXRpbmcgamMtc3RhcnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAke3JhdGluZ1N0YXJzQ29tcG9uZW50LnJldHVyblJhdGluZ1N0YXJzSFRNTCg1KX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtYWRkLWJvb2s9XCIke21vZGV9XCIgY2xhc3M9XCJhZGQtYm9vay1mb3JtX19hZGQtYnV0dG9uXCI+JHtidXR0b25UZXh0fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Zvcm0+XHJcbmA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBcIi4vYm9va0NhcmQuY3NzXCI7XHJcbmltcG9ydCByYXRpbmdTdGFyc0NvbXBvbmVudEZhY3RvcnkgZnJvbSBcIi4uL3JhdGluZ1N0YXJzL3JhdGluZ1N0YXJzLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBib29rQ2FyZEZhY3RvcnkoKSB7XHJcbiAgY29uc3QgYm9va0NhcmRDb21wb25lbnQgPSBuZXcgRXZlbnRUYXJnZXQoKTtcclxuICBib29rQ2FyZENvbXBvbmVudC5jcmVhdGVCb29rQ2FyZCA9IGNyZWF0ZUJvb2tDYXJkO1xyXG5cclxuICBjb25zdCByYXRpbmdTdGFyc0NvbXBvbmVudCA9IHJhdGluZ1N0YXJzQ29tcG9uZW50RmFjdG9yeShcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFxyXG4gICAgICBcIi0tY2xyLXNlY29uZGFyeS1hY2NlbnRcIlxyXG4gICAgKSxcclxuICAgIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFxyXG4gICAgICBcIi0tY2xyLW1haW4tYWNjZW50XCJcclxuICAgIClcclxuICAgIC8qICAgICBcIndoaXRlXCIgKi9cclxuICApO1xyXG5cclxuICByZXR1cm4gYm9va0NhcmRDb21wb25lbnQ7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUJvb2tDYXJkKGJvb2tPYmplY3QpIHtcclxuICAgIGNvbnN0IGJvb2tDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgYm9va0NhcmQuY2xhc3NMaXN0LmFkZChcclxuICAgICAgXCJib29rXCIsXHJcbiAgICAgIFwiZmxleFwiLFxyXG4gICAgICBcImFpLXN0YXJ0XCIsXHJcbiAgICAgIFwicGItYm90dG9tLTcwMFwiLFxyXG4gICAgICBcIm1yZ24tYm90dG9tLTcwMFwiXHJcbiAgICApO1xyXG4gICAgYm9va0NhcmQuc2V0QXR0cmlidXRlKFwiZGF0YS1ib29rLXV1aWRcIiwgYm9va09iamVjdC51dWlkKTtcclxuICAgIGJvb2tDYXJkLmluc2VydEFkamFjZW50SFRNTChcImFmdGVyYmVnaW5cIiwgcmV0dXJuQm9va0NhcmRIVE1MKCkpO1xyXG4gICAgYm9va0NhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInRpdGxlXCJdJykudGV4dENvbnRlbnQgPVxyXG4gICAgICBib29rT2JqZWN0LnRpdGxlO1xyXG4gICAgYm9va0NhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cImF1dGhvclwiXScpLnRleHRDb250ZW50ID1cclxuICAgICAgYm9va09iamVjdC5hdXRob3I7XHJcbiAgICBib29rQ2FyZC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwic3RhdHVzXCJdJykudGV4dENvbnRlbnQgPVxyXG4gICAgICBib29rT2JqZWN0LnN0YXR1cztcclxuXHJcbiAgICByYXRpbmdTdGFyc0NvbXBvbmVudC5jb2xvcml6ZVJhdGluZ1N0YXJzKGJvb2tPYmplY3QucmF0aW5nLCBib29rQ2FyZCk7XHJcbiAgICByZXR1cm4gYm9va0NhcmQ7XHJcbiAgfVxyXG5cclxuICAvKiAgIGZ1bmN0aW9uIGluaXRSYXRpbmdTdGFyRXZlbnRzKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXN0YXItbnVtYmVyXVwiKS5mb3JFYWNoKChyYXRpbmdTdGFyKSA9PiB7XHJcbiAgICAgIHJhdGluZ1N0YXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICBcImNsaWNrXCIsXHJcbiAgICAgICAgb25SYXRpbmdTdGFySW50ZXJhY3Rpb24uYmluZChyYXRpbmdTdGFyLCBcImJsdWVcIilcclxuICAgICAgKTtcclxuICAgICAgcmF0aW5nU3Rhci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwiZGJsY2xpY2tcIixcclxuICAgICAgICBvblJhdGluZ1N0YXJJbnRlcmFjdGlvbi5iaW5kKHJhdGluZ1N0YXIsIFwibm9uZVwiKVxyXG4gICAgICApOyAqL1xyXG4gIC8qICAgICAgIHJhdGluZ1N0YXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZXZlbnQpID0+XHJcbiAgICAgICAgb25SYXRpbmdTdGFySW50ZXJhY3Rpb24oZXZlbnQsIFwieWVsbG93XCIpXHJcbiAgICAgICk7ICovXHJcbiAgLyogICAgIH0pO1xyXG4gIH0gKi9cclxuXHJcbiAgZnVuY3Rpb24gb25SYXRpbmdTdGFySW50ZXJhY3Rpb24oY29sb3IpIHtcclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB7XHJcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXHJcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3Bvc3NpYmlsdHkgdG8gcmVzZXQgc3RhciByYXRpbmcsIHdoZW4gY2xpY2tpbmcgb24gc3RhciB0aGF0cyBjdXJyZW50UmF0aW5nIGFnYWluLlxyXG4gICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdGFyLW51bWJlclwiKSA9PSBjdXJyZW50UmF0aW5nKSByZXR1cm47XHJcbiAgICBjdXJyZW50UmF0aW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXItbnVtYmVyXCIpO1xyXG5cclxuICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBjb2xvcik7XHJcbiAgICBsZXQgc2libGluZyA9IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgd2hpbGUgKHNpYmxpbmcpIHtcclxuICAgICAgc2libGluZy5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcclxuICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmV0dXJuQm9va0NhcmRIVE1MKCkge1xyXG4gICAgcmV0dXJuIGA8aW1nIGRhdGEtYm9vaz1cImltYWdlXCIgc3JjPVwiXCIgYWx0PVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndpZHRoLTEwMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwiZmxleCBhaS1jZW50ZXIgamMtc2JcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBkYXRhLWJvb2s9XCJ0aXRsZVwiIGNsYXNzPVwiZnMtYm9vay10aXRsZVwiPjwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBib29rX19pY29uLWdyb3VwXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGRhdGEtYm9vaz1cImVkaXRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMjJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgLTk2MCA5NjAgOTYwXCIgd2lkdGg9XCIyMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkPVwiTTE4MC0xODBoNDRsNDQzLTQ0My00NC00NC00NDMgNDQzdjQ0Wm02MTQtNDg2TDY2Ni03OTRsNDItNDJxMTctMTcgNDItMTd0NDIgMTdsNDQgNDRxMTcgMTcgMTcgNDJ0LTE3IDQybC00MiA0MlptLTQyIDQyTDI0OC0xMjBIMTIwdi0xMjhsNTA0LTUwNCAxMjggMTI4Wm0tMTA3LTIxLTIyLTIyIDQ0IDQ0LTIyLTIyWlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGRhdGEtYm9vaz1cImRlbGV0ZVwiIHdpZHRoPVwiMjJweFwiIGhlaWdodD1cIjIycHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwIDEyVjE3XCIgc3Ryb2tlPVwiIzAwMDAwMFwiIHN0cm9rZS13aWR0aD1cIjEuNVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgMTJWMTdcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00IDdIMjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk02IDEwVjE4QzYgMTkuNjU2OSA3LjM0MzE1IDIxIDkgMjFIMTVDMTYuNjU2OSAyMSAxOCAxOS42NTY5IDE4IDE4VjEwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOSA1QzkgMy44OTU0MyA5Ljg5NTQzIDMgMTEgM0gxM0MxNC4xMDQ2IDMgMTUgMy44OTU0MyAxNSA1VjdIOVY1WlwiIHN0cm9rZT1cIiMwMDAwMDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjEuNVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgZGF0YS1ib29rPVwiYXV0aG9yXCIgY2xhc3M9XCJmcy1ib29rLWF1dGhvciBtcmduLWJvdHRvbS01MDBcIj48L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYm9vay1zdGF0dXMgbXJnbi1ib3R0b20tNTAwIGJnLWNvbG9yLW1haW4gZmxleCBhaS1jZW50ZXIgamMtc2JcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYm9vaz1cInN0YXR1c1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCIjMDAwMDAwXCIgd2lkdGg9XCIyMnB4XCIgaGVpZ2h0PVwiMjJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxMGw1IDUgNS01elwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5Zb3VyIHJhdGluZzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IHJhdGluZyBhaS1zdGFydCBqYy1zdGFydFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtyYXRpbmdTdGFyc0NvbXBvbmVudC5yZXR1cm5SYXRpbmdTdGFyc0hUTUwoNSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbmA7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJhdGluZ1N0YXJzQ29tcG9uZW50RmFjdG9yeShzdGFyRmlsbCwgc3RhclN0cm9rZSkge1xyXG4gIGZ1bmN0aW9uIHJldHVyblJhdGluZ1N0YXJzSFRNTChudW1iZXJPZlN0YXJzKSB7XHJcbiAgICBsZXQgcmF0aW5nU3RyaW5nID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSBudW1iZXJPZlN0YXJzOyBpID49IDE7IGktLSkge1xyXG4gICAgICByYXRpbmdTdHJpbmcgKz0gYDxzdmcgZGF0YS1zdGFyLW51bWJlcj0ke2l9IHdpZHRoPVwiMTdweFwiIGhlaWdodD1cIjE3cHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTQuNjUgOC45MzI3NEwxMi40ODUyIDQuMzA5MDFDMTIuMjkyMyAzLjg5Njk5IDExLjcwNzcgMy44OTcgMTEuNTE0OCA0LjMwOTAyTDkuMzUwMDIgOC45MzI3NEw0LjQ1NTU5IDkuNjgyNDNDNC4wMjQzNSA5Ljc0ODQ4IDMuODQ4MjcgMTAuMjc1OCA0LjE1MjkyIDEwLjU4ODhMNy43MTIyNSAxNC4yNDYxTDYuODc3NzQgMTkuMzc0OUM2LjgwNTcxIDE5LjgxNzYgNy4yNzQ0NSAyMC4xNDg3IDcuNjY2MDEgMTkuOTMxN0wxMiAxNy41Mjk5TDE2LjMzNCAxOS45MzE3QzE2LjcyNTYgMjAuMTQ4NyAxNy4xOTQzIDE5LjgxNzYgMTcuMTIyMyAxOS4zNzQ5TDE2LjI4NzggMTQuMjQ2MUwxOS44NDcxIDEwLjU4ODhDMjAuMTUxNyAxMC4yNzU4IDE5Ljk3NTYgOS43NDg0OCAxOS41NDQ0IDkuNjgyNDNMMTQuNjUgOC45MzI3NFpcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPSBcImhzbCgke3N0YXJTdHJva2V9KVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgPC9zdmc+YDtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmdTdHJpbmc7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xvcml6ZVJhdGluZ1N0YXJzKHJhdGluZywgb2JqZWN0VGhhdHNSYXRlZCkge1xyXG4gICAgZGVjb2xvckFsbFN0YXJzKCk7IC8vYWx3YXlzIHJlc2V0IGFsbCBTdGFycyBiZWZvcmUgcmVjb2xvcml6aW5nIGFjY29yZGluZyB0byBuZXcgcmF0aW5nXHJcblxyXG4gICAgaWYgKCFyYXRpbmcpIHJldHVybjtcclxuICAgIGNvbnN0IG1heENvbG9yaXplZFN0YXIgPSBvYmplY3RUaGF0c1JhdGVkLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIGBbZGF0YS1zdGFyLW51bWJlcj1cIiR7cmF0aW5nfVwiXWBcclxuICAgICk7XHJcblxyXG4gICAgbWF4Q29sb3JpemVkU3Rhci5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGBoc2woJHtzdGFyRmlsbH0pYCk7XHJcbiAgICBtYXhDb2xvcml6ZWRTdGFyLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBgaHNsKCR7c3RhclN0cm9rZX0pYCk7XHJcbiAgICBsZXQgbmV4dFNpYmxpbmcgPSBtYXhDb2xvcml6ZWRTdGFyLm5leHRFbGVtZW50U2libGluZztcclxuICAgIHdoaWxlIChuZXh0U2libGluZykge1xyXG4gICAgICBuZXh0U2libGluZy5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGBoc2woJHtzdGFyRmlsbH0pYCk7XHJcbiAgICAgIG5leHRTaWJsaW5nLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBgaHNsKCR7c3RhclN0cm9rZX0pYCk7XHJcbiAgICAgIG5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmcubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlY29sb3JBbGxTdGFycygpIHtcclxuICAgICAgb2JqZWN0VGhhdHNSYXRlZFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtc3Rhci1udW1iZXJdXCIpXHJcbiAgICAgICAgLmZvckVhY2goKHN0YXIpID0+IHN0YXIuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIikpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4geyByZXR1cm5SYXRpbmdTdGFyc0hUTUwsIGNvbG9yaXplUmF0aW5nU3RhcnMgfTtcclxufVxyXG4iLCJpbXBvcnQgYm9va01vZGVsRmFjdG9yeSBmcm9tIFwiLi9ib29rTW9kZWwuanNcIjtcclxuaW1wb3J0IGFkZEJvb2tNb2RhbENvbXBvbmVudEZhY3RvcnkgZnJvbSBcIi4vY29tcG9uZW50cy9hZGRCb29rTW9kYWwvYWRkQm9va01vZGFsLmpzXCI7XHJcbmltcG9ydCBib29rQ2FyZENvbXBvbmVudEZhY3RvcnkgZnJvbSBcIi4vY29tcG9uZW50cy9ib29rQ2FyZC9ib29rQ2FyZC5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwRmFjdG9yeSgpIHtcclxuICAvKiBGdW5jdGlvbiBtZW1iZXIgYXR0cmlidXRlcyAqL1xyXG4gIGxldCBib29rTW9kZWw7XHJcblxyXG4gIGNvbnN0IEFwcCA9IHtcclxuICAgICQ6IHtcclxuICAgICAgcmF0aW5nU3RhcnM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zdGFyLW51bWJlcl1cIiksXHJcbiAgICAgIGJvb2tMaXN0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvb2tzXCIpLFxyXG4gICAgICBhZGRCb29rOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1nbG9iYWwtYWN0aW9uPVwiYWRkXCJdJyksXHJcbiAgICAgIHdyYXBwZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWdsb2JhbD1cIndyYXBwZXJcIl0nKSxcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgaW5pdEFwcCgpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBpbml0QXBwKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYm9va01vZGVsID0gYXdhaXQgYm9va01vZGVsRmFjdG9yeSgpO1xyXG4gICAgICBmdWxsUmVuZGVyVmlldygpO1xyXG4gICAgICBpbml0RXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZnVsbFJlbmRlclZpZXcoKSB7XHJcbiAgICBsZXQgYm9va0NhcmRDb21wb25lbnQgPSBib29rQ2FyZENvbXBvbmVudEZhY3RvcnkoKTtcclxuICAgIEFwcC4kLmJvb2tMaXN0LnJlcGxhY2VDaGlsZHJlbihcclxuICAgICAgLi4uYm9va01vZGVsXHJcbiAgICAgICAgLmdldEJvb2tzKClcclxuICAgICAgICAubWFwKChib29rT2JqZWN0KSA9PiBib29rQ2FyZENvbXBvbmVudC5jcmVhdGVCb29rQ2FyZChib29rT2JqZWN0KSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0RXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBsZXQgYWRkQm9va01vZGFsQ29tcG9uZW50O1xyXG5cclxuICAgIGluaXRHbG9iYWxFdmVudHMoKTtcclxuICAgIGluaXRCb29rU3RvcmFnZUV2ZW50cygpO1xyXG4gICAgaW5pdEJvb2tDYXJkRXZlbnRzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEdsb2JhbEV2ZW50cygpIHtcclxuICAgICAgQXBwLiQuYWRkQm9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICBjcmVhdGVCb29rTW9kYWxWaWV3KFxyXG4gICAgICAgICAgeyB0aXRsZTogXCJcIiwgYXV0aG9yOiBcIlwiLCBzdGF0dXM6IFwiXCIsIHJhdGluZzogXCJcIiB9LFxyXG4gICAgICAgICAgXCJBZGQgYSBuZXcgYm9vayB0byB5b3VyIGxpc3RcIixcclxuICAgICAgICAgIFwiQWRkIGJvb2tcIixcclxuICAgICAgICAgIFwiYWRkXCJcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEJvb2tTdG9yYWdlRXZlbnRzKCkge1xyXG4gICAgICAvKiBXaGVuIHN0b3JhZ2UgaGFzIGJlZW4gY2hhbmdlZCAtPiByZXJlbmRlciBWaWV3ICovXHJcbiAgICAgIGJvb2tNb2RlbC5hZGRFdmVudExpc3RlbmVyKFwidXBkYXRlXCIsIGZ1bGxSZW5kZXJWaWV3KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Qm9va0NhcmRFdmVudHMoKSB7XHJcbiAgICAgIGFkZEJvb2tDYXJkRXZlbnQoXCJjbGlja1wiLCBcIltkYXRhLXN0YXItbnVtYmVyXVwiLCAoYm9vaywgZXZlbnQpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdSYXRpbmcgPSBldmVudC50YXJnZXQuZGF0YXNldC5zdGFyTnVtYmVyO1xyXG4gICAgICAgIGNvbnN0IGJvb2tJRCA9IGJvb2suZGF0YXNldC5ib29rSWQ7XHJcbiAgICAgICAgYm9va01vZGVsLnVwZGF0ZUJvb2tSYXRpbmcoYm9va0lELCBuZXdSYXRpbmcpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFkZEJvb2tDYXJkRXZlbnQoXCJjbGlja1wiLCAnW2RhdGEtYm9vaz1cImRlbGV0ZVwiXScsIChib29rLCBldmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGJvb2tVVUlEID0gYm9vay5kYXRhc2V0LmJvb2tVdWlkO1xyXG4gICAgICAgIGJvb2tNb2RlbC5kZWxldGVCb29rKGJvb2tVVUlEKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhZGRCb29rQ2FyZEV2ZW50KFwiY2xpY2tcIiwgJ1tkYXRhLWJvb2s9XCJlZGl0XCJdJywgKGJvb2ssIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgY3JlYXRlQm9va01vZGFsVmlldyhcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXVpZDogYm9vay5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJvb2stdXVpZFwiKSxcclxuICAgICAgICAgICAgdGl0bGU6IGJvb2sucXVlcnlTZWxlY3RvcignW2RhdGEtYm9vaz1cInRpdGxlXCJdJykudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgIGF1dGhvcjogYm9vay5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwiYXV0aG9yXCJdJykudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgIHN0YXR1czogYm9vay5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ib29rPVwic3RhdHVzXCJdJykudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgIHJhdGluZzogYm9va01vZGVsLmdldEJvb2tSYXRpbmcoYm9vay5kYXRhc2V0LmJvb2tJZCksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJFZGl0IHRoaXMgYm9va1wiLFxyXG4gICAgICAgICAgXCJDb25maXJtIEVkaXRcIixcclxuICAgICAgICAgIFwiZWRpdFwiXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBhZGRCb29rQ2FyZEV2ZW50KGV2ZW50TmFtZSwgc2VsZWN0b3IsIGhhbmRsZXIpIHtcclxuICAgICAgICBBcHAuJC5ib29rTGlzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuYm9va1wiKSwgZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9va01vZGFsVmlldyhib29rLCBmb3JtSGVhZGVyLCBidXR0b25UZXh0LCBtb2RlKSB7XHJcbiAgICAgIGFkZEJvb2tNb2RhbENvbXBvbmVudCA9IGFkZEJvb2tNb2RhbENvbXBvbmVudEZhY3RvcnkoXHJcbiAgICAgICAgYm9vayxcclxuICAgICAgICBmb3JtSGVhZGVyLFxyXG4gICAgICAgIGJ1dHRvblRleHQsXHJcbiAgICAgICAgbW9kZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLyogQWRkIEJvb2sgRXZlbnQgZGlzcGF0Y2hlZCBmcm9tIE1vZGFsIGNvbXBvbmVudCovXHJcbiAgICAgIGFkZEJvb2tNb2RhbENvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKFwiYWRkQm9va1wiLCBib29rTW9kZWwuYWRkKTtcclxuICAgICAgYWRkQm9va01vZGFsQ29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJlZGl0Qm9va1wiLCBib29rTW9kZWwuZWRpdEJvb2spO1xyXG5cclxuICAgICAgLyogY3JlYXRlIHRoZSBNb2RhbCB2aWV3ICovXHJcbiAgICAgIGNvbnN0IGZvcm1XcmFwcGVyID0gYWRkQm9va01vZGFsQ29tcG9uZW50LmNyZWF0ZUJvb2tNb2RhbERPTU5vZGUoKTtcclxuICAgICAgY29uc3QgZmlyc3RDaGlsZCA9IEFwcC4kLndyYXBwZXIuZmlyc3RDaGlsZDtcclxuICAgICAgQXBwLiQud3JhcHBlci5pbnNlcnRCZWZvcmUoZm9ybVdyYXBwZXIsIGZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVFbnVtUE9KTyhlbnVtVmFsdWVzKSB7XHJcbiAgY29uc3QgZW51bVBPSk8gPSB7fTtcclxuICBmb3IgKGNvbnN0IGVudW1WYWx1ZSBvZiBlbnVtVmFsdWVzKSB7XHJcbiAgICBjb25zdCBrZXkgPSBjYW1lbENhc2UoZW51bVZhbHVlKTtcclxuICAgIGVudW1QT0pPW2tleV0gPSBlbnVtVmFsdWU7XHJcbiAgfVxyXG4gIHJldHVybiBPYmplY3QuZnJlZXplKGVudW1QT0pPKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FtZWxDYXNlKHN0cmluZykge1xyXG4gIHJldHVybiBzdHJpbmdcclxuICAgIC5zcGxpdChcIiBcIilcclxuICAgIC5tYXAoKHdvcmQsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHdvcmRMb3dlckNhc2UgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIHJldHVybiBpbmRleCAhPSAwXHJcbiAgICAgICAgPyBgJHt3b3JkTG93ZXJDYXNlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7d29yZExvd2VyQ2FzZS5zbGljZSgxKX1gXHJcbiAgICAgICAgOiB3b3JkTG93ZXJDYXNlO1xyXG4gICAgfSlcclxuICAgIC5qb2luKFwiXCIpO1xyXG59XHJcbiIsIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjxodG1sIGxhbmc9XFxcImVuXFxcIj5cXHJcXG48aGVhZD5cXHJcXG4gICAgPG1ldGEgY2hhcnNldD1cXFwiVVRGLThcXFwiPlxcclxcbiAgICA8bWV0YSBuYW1lPVxcXCJ2aWV3cG9ydFxcXCIgY29udGVudD1cXFwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFxcXCI+XFxyXFxuICAgIDx0aXRsZT5MaWJyYXJ5PC90aXRsZT5cXHJcXG48L2hlYWQ+XFxyXFxuPHN0eWxlPlxcclxcbiAgICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbmRpZStGbG93ZXImZGlzcGxheT1zd2FwJyk7XFxyXFxuPC9zdHlsZT5cXHJcXG48c3R5bGU+XFxyXFxuICAgIEBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUNvdXJpZXIrUHJpbWU6d2dodEA0MDA7NzAwJmRpc3BsYXk9c3dhcCcpO1xcclxcbjwvc3R5bGU+XFxyXFxuPGJvZHkgY2xhc3M9XFxcImJnLWNvbG9yIGZmLW1haW5cXFwiPlxcclxcblxcclxcblxcclxcbiAgICA8ZGl2IGRhdGEtZ2xvYmFsPVxcXCJ3cmFwcGVyXFxcIiBjbGFzcz1cXFwid3JhcHBlciBwb3MtcmVsXFxcIj5cXHJcXG4gICAgICAgIDwhLS0gICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwb3MtYWJzIGluc2V0MCBncmlkIHBpLWNlbnRlciBmb3JtLXdyYXBwZXJcXFwiPlxcclxcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzPVxcXCJwb3MtcmVsXFxcIiBhY3Rpb249XFxcIlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImNsb3NlLW1vZGFsIHBvcy1hYnMgY2xyLXdoaXRlXFxcIiBzdHlsZT1cXFwicmlnaHQ6IDA7IHRvcDowO1xcXCI+WDwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XFxcImNsci13aGl0ZSBtcmduLWJvdHRvbS03MDBcXFwiPkFkZCBhIG5ldyBib29rIHRvIHlvdXIgbGlzdDwvaDI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwPkJvb2sgVGl0bGU8L3A+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwPkF1dGhvcjwvcD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHA+U3RhdHVzPC9wPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cD5SYXRpbmc8L3A+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPVxcXCJqdXN0aWZ5LXNlbGY6IGVuZDsgcGFkZGluZy10b3A6IDFyZW07XFxcIj48YnV0dG9uPkFkZCB0byBsaXN0PC9idXR0b24+PC9wPlxcclxcbiAgICAgICAgICAgIDwvZm9ybT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAtLT5cXHJcXG4gICAgICAgIDxoZWFkZXIgY2xhc3M9XFxcImdyaWQgcGktY2VudGVyIG1yZ24tYm90dG9tLTgwMFxcXCI+XFxyXFxuICAgICAgICAgICAgPCEtLSAgICAgICAgICAgICA8aDEgY2xhc3M9XFxcImZmLWFjY2VudCB0YS1jZW50ZXIgZnMtaDEgcGItYm90dG9tLTUwMFxcXCI+TXkgQm9vayBMaXN0PC9oMT4gLS0+XFxyXFxuICAgICAgICAgICAgPGgxIGNsYXNzPVxcXCJzdmctaDEgcGItYm90dG9tLTUwMFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XFxcIjEwMHB4XFxcIiBoZWlnaHQ9XFxcIjEwMHB4XFxcIiB2aWV3Qm94PVxcXCIwIC0wLjQ2IDMyMS4zOTUgMzIxLjM5NVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHlsZT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmEge1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogI2ZmZmZmZjtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiAjNkI3MDVDO1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6ICMyMTE3MTU7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmQge1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogI2ZmZGE3MTtcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3R5bGU+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMzA0LjQxOCwyMzguOWMtLjAxNy0xMS45NTEtLjA3Ny0zNi40MS0uMDc3LTQ1LjEsMCwwLDAtLjEyMS4wMDYtLjM1Ni01My45LTMxLjAxLTEzNS4wNjEtNzcuOTE5LTE3MS45MjItOTkuMjU0LTMxLjIxMywxOC4wNTktOTQuMDMxLDU0LjM1Ny0xMzAuMzczLDc1LjIzNCwwLDEwLjEzOC4wNzQsNDAuMTc0LjA2OCw0OS4wODUsMzMuMTUsMTkuMiwxMTkuOTU3LDY5LjM3MiwxNzMuMzI1LDEwMC4wNTgsMzcuODg1LTIxLjc3OCw5OS44MjktNTcuNTc1LDEyOC45NzgtNzQuNDQ3di0uNDU5QzMwNC40MjMsMjQyLjQ5MywzMDQuNDIxLDI0MC44NjUsMzA0LjQxOCwyMzguOVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYlxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTMxLjcwNiw5NC42QzEwMC4zNywxMTIuNzMsMzguNTY3LDE0OC40NDEsMi40NDUsMTY5LjE5M2MyNy4zNzIsMTUuODUzLDEyNi4zNDcsNzMuMDcxLDE3Mi4yMjcsOTkuMzg1LDMzLjUtMTkuMiwxMDYuODU5LTYxLjU3OCwxMjkuNjY5LTc0Ljc4MywwLDAsMC0uMTIxLjAwNi0uMzU2LTUzLjktMzEuMDEtMTM1LjA2MS03Ny45MTktMTcxLjkyMi05OS4yNTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTMwNi40MTgsMjM4LjlxLS4wMTctMTIuMS0uMDQ2LTI0LjJjLS4wMTQtNy4wOC0uMTgtMTQuMTgtLjAyNS0yMS4yNTlhMiwyLDAsMCwwLS45OS0xLjcyN3EtMzUuNy0yMC41MzktNzEuMzY1LTQxLjEzOC0zNS4zNzYtMjAuNDE5LTcwLjczNi00MC44NjYtMTQuOTEzLTguNjIyLTI5LjgyMi0xNy4yNWEyLjAyMiwyLjAyMiwwLDAsMC0yLjAxOSwwcS0yMy43NjEsMTMuNzQ4LTQ3LjUzNCwyNy40NzctMjcuODQzLDE2LjA4My01NS43LDMyLjE0MS0xMy41NjQsNy44MTUtMjcuMTM3LDE1LjYxNmEyLjAxMSwyLjAxMSwwLDAsMC0uOTksMS43MjdxMCwxNy4zMjUuMDUyLDM0LjY1MS4wMDgsNC4yNzguMDEzLDguNTU1YTM4LjY1NiwzOC42NTYsMCwwLDAsLjAzOSw2LjE0NWMuMjMsMS4zNjIsMS43MjMsMS45MDUsMi44LDIuNTMxTDUuNywyMjIuODg2bDYuMDMyLDMuNDkxUTI2LjksMjM1LjE1Nyw0Mi4wOCwyNDMuOTI5cTE4LjY2MiwxMC43OSwzNy4zMjgsMjEuNTY5LDE5Ljg0MiwxMS40NiwzOS42ODcsMjIuOTA5LDE5LjA3OCwxMS4wMDYsMzguMTY0LDIyYzUuNjUsMy4yNTQsMTEuMjIsNi44MDcsMTcuMDE1LDkuNzkyLDEuNzA5Ljg4LDMuMzE0LS41NTksNC43NzgtMS40bDQuMi0yLjQxM3E0LjQyLTIuNTQ0LDguODQtNS4wODksMTkuNjg5LTExLjMzNywzOS4zNjMtMjIuNywxOS43NTUtMTEuNCwzOS41LTIyLjgxNSwxNi4xNjctOS4zNDQsMzIuMzMtMTguN2MxLjE0MS0uNjYxLDIuODY1LTEuMjY3LDMuMS0yLjcwNWEzNC4yMzQsMzQuMjM0LDAsMCwwLC4wMzEtNS40ODJjMC0yLjU3NC00LTIuNTc5LTQsMHEwLDIuNjA3LDAsNS4yMTZsLjk5LTEuNzI3cS0yMi44NTEsMTMuMjI3LTQ1LjcxNSwyNi40MzMtMjcuNywxNi01NS40MDksMzEuOTc4LTEzLjkyMyw4LjAyNS0yNy44NTQsMTYuMDM2aDIuMDE5cS0zNi40NDMtMjAuOTU0LTcyLjg0My00MS45ODJRNjcuNjQ2LDI1NC4wOTMsMzEuNywyMzMuMywxNy40MTEsMjI1LjA0NCwzLjEzLDIxNi43NzdsLjk5LDEuNzI3Yy4wMDgtMTMuMzE0LS4wNDEtMjYuNjI4LS4wNi0zOS45NDJxLS4wMDctNC41NzItLjAwOC05LjE0M2wtLjk5MSwxLjcyN3EyNS42MTYtMTQuNzE1LDUxLjItMjkuNDg5UTgxLjYsMTI1Ljg4LDEwOC45MzQsMTEwLjA4cTEyLjI1Mi03LjA4MywyNC41LTE0LjE2OGgtMi4wMTlxMjkuNTkyLDE3LjEyNyw1OS4yLDM0LjIzLDM3LjA3MywyMS40Miw3NC4xNjMsNDIuODExLDE5LjI3NSwxMS4xMTUsMzguNTYxLDIyLjIxM2wtLjk5MS0xLjcyN2MtLjE1NSw3LjA3OS4wMTEsMTQuMTc5LjAyNSwyMS4yNTlxLjAyNCwxMi4xLjA0NiwyNC4yQzMwMi40MjIsMjQxLjQ3MiwzMDYuNDIyLDI0MS40NzcsMzA2LjQxOCwyMzguOVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTczLjA3LDI2OC40NDRxMCwyMC43MzYuMDcyLDQxLjQ3Mi4wMDcsNC4xOTQuMDEsOC4zODljMCwyLjU3NCw0LDIuNTc4LDQsMCwwLTEzLjUtLjA1LTI3LS4wNzItNDAuNXEtLjAwOC00LjY4My0uMDEtOS4zNjZjMC0yLjU3NC00LTIuNTc4LTQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMy40MzEsMTcyLjA2NnExMi4xMSw3LjAxNywyNC4yMjYsMTQuMDIzLDE3LjAzOCw5Ljg1NSwzNC4wODMsMTkuNywxOS4zNDgsMTEuMTc5LDM4LjcsMjIuMzQ5LDE5LjAzOSwxMC45ODgsMzguMDg1LDIxLjk2LDE2LjEwOSw5LjI3OSwzMi4yMywxOC41MzZsMy4zMDYsMS45YzIuMjM2LDEuMjgzLDQuMjU0LTIuMTcyLDIuMDE4LTMuNDU0cS0xNS41ODItOC45MzQtMzEuMTQ2LTE3LjktMTguODI5LTEwLjg0Mi0zNy42NDctMjEuNy0xOS40NTgtMTEuMjI4LTM4LjkxLTIyLjQ2NVE1MC45MSwxOTQuOTE0LDMzLjQ0NCwxODQuODE1cS0xMi44NjMtNy40NC0yNS43MjEtMTQuODg2TDUuNDUsMTY4LjYxMmMtMi4yMzItMS4yOTMtNC4yNDgsMi4xNjMtMi4wMTksMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE3NS4wOTMsMjgzLjU2N3EtMTMuNDQxLTcuNzA3LTI2Ljg2NS0xNS40NDQtMTYuMzc3LTkuNDMtMzIuNzQ1LTE4Ljg3N1E5OC42LDIzOS41MDUsODEuNzI0LDIyOS43NTVxLTE1LjIzNi04LjgtMzAuNDY4LTE3LjYwOS0xMS4xNjYtNi40NTctMjIuMzMxLTEyLjkyLS45OTItLjU3Ni0xLjk4NS0xLjE1Yy0yLjIzMi0xLjI5My00LjI0OCwyLjE2Mi0yLjAxOSwzLjQ1NFEzNS40MywyMDcuNjE3LDQ1Ljk0NCwyMTMuN3ExNC44Niw4LjYsMjkuNzIzLDE3LjE4MSwxNi43OSw5LjcsMzMuNTg0LDE5LjM5MywxNi41NjYsOS41NTksMzMuMTM4LDE5LjEwOCwxMy45LDguMDEsMjcuODIyLDE2bDIuODYzLDEuNjQyYzIuMjM3LDEuMjgyLDQuMjU0LTIuMTcyLDIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNjQuMTE1LDI5My40NDdxLTEzLjAxOS03LjQ2NS0yNi0xNWMtMi4yMzItMS4yOTMtNC4yNDgsMi4xNjItMi4wMTksMy40NTNxMTIuOTg3LDcuNTIyLDI2LDE1YzIuMjM3LDEuMjgzLDQuMjU0LTIuMTcyLDIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yNDkuNDIzLDI4MS41MjZjLTQuNjE4LDIuNjUyLTE5LjU5NCwxMS4zLTI2LjQwNiwxNS4yMjUtNi41NzMtMy43NzUtMTguMjMxLTEwLjQ5My0yNi45MzYtMTUuNTE3LDguMjI2LTQuNzMyLDE3LjI3NC05Ljk0MiwyNi40MjYtMTUuMjI1QzIzMS40NDEsMjcxLjE2NywyNDMuMTcyLDI3Ny45MzgsMjQ5LjQyMywyODEuNTI2WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xOTYuMDgxLDI4My4yMzRoLjAxbC0xLjAwOS0uMjczcTEyLjU0Niw3LjI1NSwyNS4xMTMsMTQuNDc2YTguMDMsOC4wMywwLDAsMCwyLjU1NiwxLjI3OGMxLC4xMzUsMS45MjgtLjYxMiwyLjc1Ni0xLjA5bDQuNzMtMi43MjYsMTAuNzUyLTYuMnE0LjcyLTIuNzI0LDkuNDQzLTUuNDQyYTIuMDE5LDIuMDE5LDAsMCwwLDAtMy40NTRxLTEzLjQ3MS03LjczNC0yNi45MTUtMTUuNTE3Yy0yLjIzNC0xLjI5LTQuMjUsMi4xNjYtMi4wMTksMy40NTRxMTMuNDUyLDcuNzY3LDI2LjkxNSwxNS41MTdWMjc5LjhxLTEzLjIxNSw3LjU5LTI2LjQsMTUuMjI1aDIuMDE4cS02LjYtMy43OTItMTMuMi03LjYtMy43LTIuMTMtNy40LTQuMjY0bC0zLjY3Mi0yLjEyMWMtMS4wMjctLjU5My0yLjQ2My0xLjgwOS0zLjY3Ny0xLjgwOS0yLjU3NCwwLTIuNTc4LDQsMCw0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yODYuODEsMjI2LjU2MXEtMTguNDU4LDEwLjY4OS0zNi45MzEsMjEuMzQ4LTI0Ljg0MSwxNC4zNDMtNDkuNywyOC42NTktMTIuODU2LDcuNC0yNS43MjEsMTQuNzg1Yy0yLjIzNCwxLjI3OS0uMjIxLDQuNzM2LDIuMDE5LDMuNDU0cTIzLjc1OC0xMy42LDQ3LjQ1Ni0yNy4zMTIsMjMuNDgxLTEzLjUzNyw0Ni45NDgtMjcuMSw4Ljk3NC01LjE4NywxNy45NDctMTAuMzgxYzIuMjI3LTEuMjkuMjE1LTQuNzQ4LTIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNzUuOSwyNzAuMTc5cTI2LjA2OS0xNC45NDEsNTIuMDg2LTI5Ljk3MywyOC4wNjgtMTYuMTg1LDU2LjExOS0zMi40LDEwLjYyMy02LjEzOSwyMS4yNDMtMTIuMjg1YzIuMjI3LTEuMjg5LjIxNS00Ljc0Ny0yLjAxOS0zLjQ1NFEyODEuMTY5LDIwNC45LDI1OC45ODksMjE3LjdxLTI5LjE0LDE2LjgyNy01OC4zLDMzLjYyMi0xMy40LDcuNzEzLTI2LjgwNywxNS40MDZjLTIuMjMzLDEuMjgtLjIyMSw0LjczNywyLjAxOSwzLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjYyLjI0OSwxNjUuNTg3Yy0uMDEzLTguOTIyLS4wNTgtMjcuMTgxLS4wNTgtMzMuNjcyLDAsMCwwLS4wOS4wMDUtLjI2Ni00MC4yMzgtMjMuMTUtMTAwLjgzMS01OC4xNy0xMjguMzQ5LTc0LjEtMjMuMywxMy40ODItNzAuMiw0MC41OC05Ny4zMzEsNTYuMTY2LDAsNy41NjguMDU2LDI5Ljk5Mi4wNTEsMzYuNjQ0LDI0Ljc0OSwxNC4zMyw4OS41NTUsNTEuNzkxLDEyOS40LDc0LjcsMjguMjg0LTE2LjI1OSw3NC41MjgtNDIuOTg0LDk2LjI4OS01NS41Nzl2LS4zNDNDMjYyLjI1MiwxNjguMjcsMjYyLjI1MSwxNjcuMDU1LDI2Mi4yNDksMTY1LjU4N1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiZFxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTMyLjEsNTguNTYxYy0yMy44MzEsMTMuNzg2LTY5LjExNSwzOS45NS05NS41ODUsNTUuMTU2LDAsNy41NjguMDU2LDI5Ljk5Mi4wNTEsMzYuNjQ0LDEwLjc2Myw2LjIzMywyOS4xLDE2LjgzOSw0OS42NywyOC43MjItLjAxNS05LjEzMi0uMDU0LTI5LjMwNy0uMDU4LTM2Ljk4Myw0MS44MzMtMjQuMTY2LDc3LjA3Ny00NC41NDUsOTYuOTU1LTU2LjA1Mi0xOS42OTMtMTEuMzc3LTM3LjUxNi0yMS42ODQtNDkuMjg3LTI4LjVaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTI2NC4yNDksMTY1LjU4N2MtLjAxNy0xMS4zLS4zLTIyLjYzNy0uMDUzLTMzLjkzOGEyLDIsMCwwLDAtLjk5MS0xLjcyN3EtMjYuNjQ0LTE1LjMzLTUzLjI2NS0zMC43LTI2LjQwNi0xNS4yNDItNTIuOC0zMC41UTE0Niw2Mi4yNzEsMTM0Ljg1Niw1NS44MjRhMi4wMjIsMi4wMjIsMCwwLDAtMi4wMTksMFExMTUuMDczLDY2LjEsOTcuMyw3Ni4zNjcsNzYuNTY2LDg4LjM0Myw1NS44MjIsMTAwLjNxLTEwLjE1NSw1Ljg1MS0yMC4zMTUsMTEuNjkxYTIuMDEyLDIuMDEyLDAsMCwwLS45OTEsMS43MjdxMCwxMy4wODcuMDQsMjYuMTc0LjAwNiwzLjE2OC4wMDksNi4zMzZjMCwxLjQyMy0uMzA3LDMuMjgyLjA3NCw0LjY2Ni40MDcsMS40NzgsMy4xOSwyLjUxLDQuNDUsMy4yNGw0LjYsMi42NjRxMjUuMjgzLDE0LjYzLDUwLjU3OSwyOS4yMzcsMjkuMDE0LDE2Ljc1Nyw1OC4wNDUsMzMuNDgybDYuNjIyLDMuODEyLDMuMDQ5LDEuNzU0YTI0LjY0NiwyNC42NDYsMCwwLDAsMy4yMDUsMS44MDZjMS4zMi41MTEsMi41NTQtLjU0NiwzLjY1NS0xLjE3OWwzLjMyNy0xLjkxMyw2LjcyNy0zLjg3M3ExNC42NDktOC40MzYsMjkuMjktMTYuODg5LDI2LjgxNC0xNS40NzUsNTMuNjEyLTMwLjk4MmMxLjA5Mi0uNjMyLDIuMzQ2LTEuMTI1LDIuNDQ4LTIuNTcuMDkxLTEuMjg1LDAtMi42MDgsMC0zLjksMC0yLjU3My00LTIuNTc4LTQsMHEwLDEuOTQ3LDAsMy45bC45OTEtMS43MjdxLTE3LjAyMiw5Ljg1Mi0zNC4wNTQsMTkuNjg5LTIwLjcxOSwxMS45NzItNDEuNDUsMjMuOTIzLTEwLjM5MSw1Ljk4OC0yMC43ODUsMTEuOTY3aDIuMDE5cS0yNy4xNzMtMTUuNjI1LTU0LjMxNC0zMS4zUTg1Ljg0LDE3Ni41NTEsNTkuMDM1LDE2MS4wNSw0OC4zLDE1NC44NDUsMzcuNTc3LDE0OC42MzRsLjk5LDEuNzI3Yy4wMDYtOS45MTEtLjAzLTE5LjgyMi0uMDQ1LTI5LjczNHEwLTMuNDU0LS4wMDYtNi45MWwtLjk5LDEuNzI3cTE5LjE0OS0xMSwzOC4yNzMtMjIuMDQ2UTk2LjE2MSw4MS42NSwxMTYuNTEyLDY5Ljg4NXE5LjE3NC01LjMsMTguMzQ0LTEwLjYwN2gtMi4wMTlxMjIuMDg2LDEyLjc4Myw0NC4xODQsMjUuNTQ4LDI3LjY3MSwxNS45ODksNTUuMzU1LDMxLjk1NCwxNC40LDguMywyOC44MSwxNi42bC0uOTktMS43MjdjLS4yNDgsMTEuMy4wMzYsMjIuNjM1LjA1MywzMy45MzhDMjYwLjI1MywxNjguMTYxLDI2NC4yNTMsMTY4LjE2NiwyNjQuMjQ5LDE2NS41ODdaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE2My42ODQsMTg3LjY0NGMwLDguNDY0LjA2LDE2LjkyNy4wNjEsMjUuMzkxLDAsMi41NzMsNCwyLjU3OCw0LDAsMC04LjQ2NC0uMDYtMTYuOTI3LS4wNjEtMjUuMzkxLDAtMi41NzMtNC0yLjU3OC00LDBaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE2Ny4wNzgsMTg2LjQwOHEtMjIuNzY3LTEzLjA1NC00NS40ODYtMjYuMTg5UTk3LjA4MSwxNDYuMDc3LDcyLjU4MywxMzEuOTFxLTkuMjc5LTUuMzY1LTE4LjU1NS0xMC43MzdjLTIuMjMxLTEuMjkyLTQuMjQ4LDIuMTYzLTIuMDE5LDMuNDU0cTE5LjM1NSwxMS4yMTEsMzguNzIzLDIyLjM5NCwyNS40NDksMTQuNyw1MC45MTMsMjkuMzc4LDExLjcsNi43NDEsMjMuNDE0LDEzLjQ2M2MyLjIzNywxLjI4Myw0LjI1NC0yLjE3MiwyLjAxOS0zLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTY2LjU2LDE4OS4zNzdxMTYuNDUzLTkuNDI5LDMyLjg3NS0xOC45MTcsMTcuNjUyLTEwLjE4MSwzNS4yOTUtMjAuMzc3LDYuNzU2LTMuOSwxMy41MDktNy44MTNjMi4yMjgtMS4yODkuMjE2LTQuNzQ3LTIuMDE4LTMuNDUzcS0xMy45ODksOC4xLTI3Ljk4OCwxNi4xNzYtMTguMzIxLDEwLjU3OS0zNi42NTUsMjEuMTQtOC41MTYsNC45LTE3LjAzNyw5Ljc5Yy0yLjIzMywxLjI4LS4yMiw0LjczOCwyLjAxOSwzLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNODcuMywxNDMuNzZxMjEuOTU2LTEyLjY4Miw0My45MDctMjUuMzcxLDE3LjgyNy0xMC4zLDM1LjY1Mi0yMC42MTUsNy42MjQtNC40MSwxNS4yNDctOC44MjNjMi4yMjctMS4yODkuMjE2LTQuNzQ3LTIuMDE5LTMuNDU0cS0xNC43NDIsOC41MzUtMjkuNDksMTcuMDYxLTE5LjgzNiwxMS40Ny0zOS42NzUsMjIuOTM0UTk4LjEsMTMyLjksODUuMjg1LDE0MC4zMDZjLTIuMjI5LDEuMjg4LS4yMTcsNC43NDUsMi4wMTgsMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTg0LjE3NCwxNDIuMDgyYy4wMTMsMTEuMzQzLjA2MSwyMi42ODYuMDYyLDM0LjAyOSwwLDIuNTc0LDQsMi41NzgsNCwwLDAtMTEuMzQzLS4wNDktMjIuNjg2LS4wNjItMzQuMDI5LDAtMi41NzMtNC0yLjU3OC00LDBaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImJcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE0Ny4zLDE0Mi43NThhMTUuNzkzLDE1Ljc5MywwLDAsMS0xLjYsNi4xNjVjLTEuOTg2LDMuOS01LjgxOCw2LjU2OS05Ljg1Myw4LjI2OXMtNC42MTMsMS4yNTgtOC43ODgsMi41NzZjLTMuMjU1LDEuMDI3LTYuNjYzLDIuNTA2LTguMDU4LDUuOGExOS4yNDUsMTkuMjQ1LDAsMCwwLTEuMDMxLDUuMjMxYy0uMyw2Ljc0OC0uMjQ2LDEzLjc2Ny0uMzMsMjAuNzExYTIuMjc5LDIuMjc5LDAsMCwxLTEuNTcsMi4xOSwzMi4xMzksMzIuMTM5LDAsMCwxLTE0LjY1NS43ODEsMi45MjUsMi45MjUsMCwwLDEtMS4zLS44NzMsMy45NTksMy45NTksMCwwLDEtMS4xLTEuODMxYy0uMzc2LTMuMTUyLS41NTctNi4xODgtLjY2NC05LjIyOC0zLjQ5My43NzYtNy40ODUsMi4xMTYtMTEuMiwxLjIwOS0yLjU4My0uNjMtNS0yLjYtNS40LTUuMjI5bC0uMzI4LTIuMTcxYy0uNTc3LTEwLjYyLTEuMTUzLTkuMjgzLTEuNzMtMTkuOS0uMTk0LTMuNTczLS4zNS03LjM0MSwxLjI4Mi0xMC41MjZhMTcuODI2LDE3LjgyNiwwLDAsMSw1LjY2NC01LjkwOSw2OS4wMyw2OS4wMywwLDAsMSwxNC40NjQtOC4xMDdTMTQwLjYxOSwxNDEuMzk0LDE0Ny4zLDE0Mi43NThaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEzOS4yMjEsMTQ2LjMxN2MyLjMtMS4yODgsNS4yNjMtMi43MzgsOC4xMjMtNC40NTIsNC43NDYtMi44NCw5LjI1OC02LjQyOSwxMC4xOTEtMTEuMjQ2YTIwLjEyNiwyMC4xMjYsMCwwLDAtLjAzLTYuMjg4Yy0uOTEzLTcuMzcyLTIuNjU3LTE2Ljc4Mi03LjI1MS0yMi44NDctMi44LTMuNzExLTcuMjItOC41LTExLjUzLTEwLjcwOCwwLDAtNy40NzctMy42Mi0xNC43NDEtNC4wOTQtMTEuNjYyLS43Ni0xNy42Myw0LjIxMS0xNy42Myw0LjIxMWEzNS4yNTYsMzUuMjU2LDAsMCwwLTEzLjIsMjAuOGwtMi4wMzYsMTEuNzE2LS43MzUsNC4yMjlaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTkyLjQ3MiwyMDQuMDI4YTcuMzU5LDcuMzU5LDAsMCwxLDEuNDI5LTYuMDIsMTguMTU4LDE4LjE1OCwwLDAsMSw1LjQzNi00LjM3NWMyLjEsMS42NDQsMTAuNjMyLDEuOTYyLDE2LjczOC4wN2EyLjE1NSwyLjE1NSwwLDAsMCwuNTgzLS4yODFjLjA3NS43MTIuMTIzLDEuMTUzLjEyMywxLjE1My42MzUsNS44LTIuODc4LDguMTMyLTUuMTA4LDkuNDU5YTMzLjYxOSwzMy42MTksMCwwLDEtOC41LDMuNTc4LDEzLjksMTMuOSwwLDAsMS01LjU0Ny41NDRBNi40NTMsNi40NTMsMCwwLDEsOTMsMjA1LjMwNiw0Ljk3NSw0Ljk3NSwwLDAsMSw5Mi40NzIsMjA0LjAyOFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNNzQuNjA5LDE5MS40NjFhOC4wMTMsOC4wMTMsMCwwLDEsMS4xNDMtMi4xMzMsMTkuMjgzLDE5LjI4MywwLDAsMSw1Ljg5Mi00LjYxNCw5LjkyMyw5LjkyMywwLDAsMSwzLjgwOC0xLjU4MSw4LjExOCw4LjExOCwwLDAsMCwxLjcwOC42MjhjMy43MTUuOTA3LDcuNzA2LS40MzIsMTEuMi0xLjIwOC4wNzUsMi4xOS4xOTEsNC4zNzkuMzksNi42MWwtMS41NjkuMjU5Yy4xMTcsMi41LTIuMSw0LjQ1MS00LjI1MSw1LjczYTMyLjUyMywzMi41MjMsMCwwLDEtOC4yMTksMy40NTksMTMuMzQ4LDEzLjM0OCwwLDAsMS01LjM2My41Miw2LjIsNi4yLDAsMCwxLTQuNDY5LTIuNzUyQTUuODM0LDUuODM0LDAsMCwxLDc0LjYwOSwxOTEuNDYxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMTQuNzgxLDE5NC41NzVhNy4xNzMsNy4xNzMsMCwwLDEtMi42LDYuNzQ0LDI3Ljc4NywyNy43ODcsMCwwLDEtOS41NDYsNC4zNjVjLTIuNzc0LjczNC04LjI4NywxLjIxNy04LjM0MS0zLjAzNi0uMDQ4LTMuOCwzLjg3NC02LDYuNzA2LTcuNjc3LDIuMjE1LTEuMzA4LjItNC43NjctMi4wMTktMy40NTMtMy4zNDcsMS45NzgtNi43MDgsNC4xOTQtOC4xMjUsOGE3LjY0Niw3LjY0NiwwLDAsMCwzLjQxNSw5LjYxM2MzLjg0MywyLjAxMyw4LjM3NC45MzQsMTIuMjM1LS40NjdhMjguNjA4LDI4LjYwOCwwLDAsMCw4LjcxNy00LjY4NCwxMC43LDEwLjcsMCwwLDAsMy41NTctOS40LDIuMDU0LDIuMDU0LDAsMCwwLTItMiwyLjAxNCwyLjAxNCwwLDAsMC0yLDJaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTg0LjY1NCwxODEuMjQyYTE2LjAzLDE2LjAzLDAsMCwwLTQuOTQ3LDIuMywyMy44MjgsMjMuODI4LDAsMCwwLTQuMTgsMy4wNDdjLTIuNDYyLDIuMzQ2LTQuMDgxLDYuMDA5LTIuOTkxLDkuNCwxLjE1MiwzLjU4Niw0LjkxNCw1LjMyNyw4LjQ3NCw1LjIzNCwzLjgzOS0uMSw3Ljc3NC0xLjYzMiwxMS4xNTMtMy4zNjEsMy4zMjUtMS43LDcuMDQ5LTQuMjgyLDcuMDIxLTguNDQtLjAxNy0yLjU3My00LjAxNy0yLjU3OC00LDAsLjAyLDIuOTM5LTQuMzE2LDQuNzEtNi41LDUuNjkxYTI5LjM1NSwyOS4zNTUsMCwwLDEtNC45LDEuNjc0LDguODczLDguODczLDAsMCwxLTUuMjE5LjA5MmMtMi44OS0xLjA4NC0yLjgxOC00LjIyOC0xLjE3Mi02LjQxOWExMy4zMzMsMTMuMzMzLDAsMCwxLDMuNzIzLTMuMDg5LDE0LjYzNSwxNC42MzUsMCwwLDEsNC42MDctMi4yNzJjMi41MjEtLjUxMywxLjQ1NC00LjM3LTEuMDYzLTMuODU3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMDAuNTc5LDEyOS45ODlhNzAuNDM0LDcwLjQzNCwwLDAsMC0xNS45MzYsOS4wNTVBMTcuNDY1LDE3LjQ2NSwwLDAsMCw3OC45LDE0NS43YTIwLjIxMywyMC4yMTMsMCwwLDAtMS4yODgsOC44MTZjLjE0NSw0LjMxNS41Niw4LjYsMS4wNzgsMTIuODgyLjQ2OCwzLjg3MS40NDUsNy44MTQsMS4xNCwxMS42NWE4LjU3LDguNTcsMCwwLDAsNS4yMzgsNi4wOTVjMy4zNiwxLjQ0NCw3LjA2MS45MDcsMTAuNTE2LjEyNiwyLjUxLS41NjcsMS40NDgtNC40MjUtMS4wNjMtMy44NTctMy43MzMuODQ0LTEwLjAzMywxLjUtMTAuODYzLTMuNjE1LS41NDctMy4zNzYtLjU0My02Ljg1Ny0uOTU1LTEwLjI4Ny0uNDMyLTMuNi0uNzg2LTcuMTg1LS45ODctMTAuOGEyNi42MzcsMjYuNjM3LDAsMCwxLC4yNTgtNy42NSwxMS40MjMsMTEuNDIzLDAsMCwxLDQuMTIzLTYuMDg1LDU5Ljg4NCw1OS44ODQsMCwwLDEsMTUuNTQ3LTkuMTIzLDIuMDY3LDIuMDY3LDAsMCwwLDEuNC0yLjQ2MSwyLjAxMiwyLjAxMiwwLDAsMC0yLjQ2LTEuNFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTAwLjE2NCwxNDkuMjc1Yy0zLjQyNywyLjM4Mi00LjI4Nyw2LjExNy00LjM0OSwxMC4wNDMtLjA2MywzLjk4Mi4xNDksNy45NjMuMjczLDExLjk0Mi4xNjMsNS4yMi4xNCwxMC40NDcuNDksMTUuNjU5LjE2MiwyLjQxNS0uMDE1LDUuMzY2LDEuNTE4LDcuMzY3LDEuNDcxLDEuOTIsMy4yNzQsMi4zMjMsNS41NTUsMi41NjNhMzIuNjkxLDMyLjY5MSwwLDAsMCw2LjU4My0uMDIzLDI1LjQ2OCwyNS40NjgsMCwwLDAsNi42ODItMS4zMTNjMi42MS0xLjAxNywyLjcyNC0zLjUxOSwyLjc0OC01LjkzOS4wMjYtMi43NS4wMzYtNS41LjA2My04LjI0OC4wMjYtMi43MTkuMDY3LTUuNDM5LjE1Ny04LjE1N2EyMS4xMzIsMjEuMTMyLDAsMCwxLC44NjktNi41ODFjMS4zMzUtMy42MTYsNi4wNzQtNC44MDYsOS40MS01LjYxMSw0LjMyNi0xLjA0NCw4LjQ5LTIuNCwxMi4wOTItNS4xMjhhMTcuNjYxLDE3LjY2MSwwLDAsMCw3LjA4OS0xMy45ODRjLjEtMi41NzUtMy45LTIuNTctNCwwYTEzLjUyMSwxMy41MjEsMCwwLDEtNS4yMDksMTAuNiwyNC4yNzcsMjQuMjc3LDAsMCwxLTkuNjYxLDQuMzM4Yy0zLjU2NS43OTItNy4zNTEsMS44LTEwLjI3LDQuMS0zLjI0MSwyLjU1LTQuMDQxLDYuNDQ3LTQuMjQ4LDEwLjM3My0uMjYzLDQuOTU3LS4yMzIsOS45MzUtLjI2NiwxNC45cS0uMDEyLDEuODIxLS4wMjksMy42NDFhNi40NzMsNi40NzMsMCwwLDEtLjAxOSwxLjdjLS4xMTMuMzIxLS4wNjYuMi0uMjc3LjMxNmExMC4yOSwxMC4yOSwwLDAsMS0yLjg2NC42NzksMjkuMDIzLDI5LjAyMywwLDAsMS0zLjA2OC4zODYsMzIsMzIsMCwwLDEtNS43ODItLjA0Niw0LjgzMyw0LjgzMywwLDAsMS0xLjgzMy0uMzhjLS45MzEtLjU1NC0uOTA2LTEuNjI3LTEtMi41NTktLjQ1OC00LjcwOS0uNTMxLTkuNDQtLjYyNS0xNC4xNjctLjA5LTQuNDktLjMxOS04Ljk3Ny0uMzc5LTEzLjQ2OC0uMDIyLTEuNjkxLS4wNS0zLjQuMDgtNS4wODMuMDExLS4xNC4wMjItLjI4LjAzNi0uNDIuMDQxLS40LS4wMjYuMTIyLjAxMS0uMDY2YTkuMjE1LDkuMjE1LDAsMCwxLC40MzMtMS41NjMsNS4yMSw1LjIxLDAsMCwxLDEuODA1LTIuNDE0YzIuMS0xLjQ2LjEtNC45MjktMi4wMTktMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEwNS4zNDQsODkuMTY2YTM3LjU3OSwzNy41NzksMCwwLDAtMTQuMTE3LDIxLjk5MWMtLjUzNSwyLjUxMSwzLjMyLDMuNTg0LDMuODU3LDEuMDYzYTMzLjQzNywzMy40MzcsMCwwLDEsMTIuMjc5LTE5LjYsMi4wNjUsMi4wNjUsMCwwLDAsLjcxNy0yLjczNiwyLjAxMywyLjAxMywwLDAsMC0yLjczNi0uNzE4WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk05My4wNzMsMTMxLjkxMmMtMi4yMjQtMS4zODctMy4xNDktMy43My0zLjUxMi02LjIxNy0uNDA3LTIuNzg4LjA3LTYuMzM3LDQuMTI3LTcuMzUxYTUuNzc2LDUuNzc2LDAsMCwxLDQuMjI1Ljc4OSw3LjkxNyw3LjkxNywwLDAsMSwzLjg5MSw3LjY4MmMtLjI3NCwzLjMwNi0zLjM5MSw2LjMzNi02LjY3Myw1Ljg1N0E1LjMsNS4zLDAsMCwxLDkzLjA3MywxMzEuOTEyWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk05NC4wODIsMTMwLjE4NWE0Ljc4OSw0Ljc4OSwwLDAsMS0xLjItMS4wOTFjLjE3OS4yMjQtLjA4LS4xMjEtLjExOC0uMTc2cS0uMTQyLS4yMTYtLjI3LS40MzljLS4wNjgtLjEyLS4xMzMtLjI0MS0uMTk1LS4zNjQsMCwwLS4yNDctLjU2My0uMTM1LS4yODFhMTAuODg0LDEwLjg4NCwwLDAsMS0uNTI3LTEuODI1Yy0uMDM2LS4xNzUtLjA2OC0uMzUtLjEtLjUyNy0uMDIzLS4xMzYtLjA3Ni0uNjE5LS4wMTgtLjA4My0uMDI3LS4yNTMtLjA1My0uNS0uMDY2LS43NTlhMTEuMDg4LDExLjA4OCwwLDAsMSwuMDMxLTEuNGMuMDI4LS4zNzQsMCwwLS4wMS4wNjcuMDI2LS4xMjcuMDQ2LS4yNTYuMDc1LS4zODMuMDYyLS4yODEuMTUyLS41NDguMjQxLS44MjEtLjE0NS40NS4wODYtLjE2Ny4xNjEtLjNzLjQ4MS0uNjM3LjE4NS0uMzA5YTcuMzMsNy4zMywwLDAsMSwuNTE4LS41MjVjLjIzMi0uMjA5LS4zOS4yMjQuMDcyLS4wNTMuMTU1LS4wOTIuMy0uMTkzLjQ2NC0uMjc4LjExMS0uMDYuMjI0LS4xMTguMzM5LS4xNjctLjI4Ny4xMjQuMDI4LDAsLjA3Ni0uMDE5YTguMTI2LDguMTI2LDAsMCwxLC45MDctLjI0Yy0uNDQ3LjA3Ni4xODUuMDEyLjM1LjAxNXMuMzMuMDEyLjQ5NC4wM2MuMTQxLjAxNC4xMzUuMDE0LS4wMTcsMCwuMTA2LjAxOC4yMTEuMDQxLjMxNC4wNjdhNC4wOTMsNC4wOTMsMCwwLDEsMS42Ljc3NGMuMDIzLjAxNi4zLjIyNi4xLjA2NS4xMDguMDgzLjIxMi4xNzMuMzE1LjI2MmE4LjkzOSw4LjkzOSwwLDAsMSwuNzguNzY1LDUuMzQ4LDUuMzQ4LDAsMCwxLDEuMjY2LDIuNTMxYy0uMDA3LS4wMzMuMTEyLjU4OC4wNjguMzA5cy4wMzQuMzYyLjAzMS4zMjZhOC45MjQsOC45MjQsMCwwLDEsLjAxOS45MjVjMCwuMTc4LS4wMTQuMzU1LS4wMjkuNTMyLjAwNy0uMDg3LjA3My0uMzQtLjAxLjA3MmE4LjA0OCw4LjA0OCwwLDAsMS0uMjY4Ljk3OWMtLjIuNi4wODYtLjE1LS4wNzguMTc5LS4wOS4xODQtLjE4Ny4zNjMtLjI5Mi41MzlhMi41MzksMi41MzksMCwwLDEtLjQ3NC42NjEsNi43MTMsNi43MTMsMCwwLDEtLjcyOS43Yy4yMTYtLjE3Ny0uMDQxLjAyNy0uMDc3LjA1LS4xNjguMTA4LS4zMzQuMjE4LS41MS4zMTRhMy40MjgsMy40MjgsMCwwLDEtMS40MzYuNDEsMy4xMTIsMy4xMTIsMCwwLDEtMS44NDgtLjUzNiwyLDIsMCwwLDAtMi4wMTksMy40NTRjMy43LDIuMiw4LC43MDYsMTAuMzI2LTIuNjkzYTkuNTExLDkuNTExLDAsMCwwLS4wMzktMTAuMTkyYy0xLjk4MS0zLjA0Ni01LjctNS4zMTEtOS40LTQuMjgzYTcuNDgyLDcuNDgyLDAsMCwwLTUuNDg1LDcuMDgxYy0uMjQ3LDMuODM1LDEuMzE0LDcuOTYxLDQuNiwxMC4wODdhMiwyLDAsMSwwLDIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIiBkPVxcXCJNMTA1LjkzNiwxMDUuNTIydjIyLjI5NGMwLDIuNTc0LDQsMi41NzgsNCwwVjEwNS41MjJjMC0yLjU3My00LTIuNTc4LTQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTA3LjI0MSwxMzEuNjA4Yy02LjE1MSwxLjA0Mi0xMi40MjksMy40NDItMjEuNSw0Ljk0Nyw1LjU5MSwyLjY5NSwxNi4xMDYsNy44NzIsMjYuMTYxLDEyLjksOC43MzctMy41NTcsMTEuMjI0LTQuMTc3LDE2LjY5Mi02LjI3NEMxMTkuNDQ2LDEzOC40NjIsMTA3LjI1OSwxMzEuNiwxMDcuMjQxLDEzMS42MDhaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEwNi43MSwxMjkuNjc5Yy03LjI1MiwxLjI1Ni0xNC4yMywzLjcyMi0yMS41LDQuOTQ4LTEuNjY0LjI4LTEuOTcxLDIuOTM1LS40NzcsMy42NTUsNS45MTEsMi44NTIsMTEuOCw1Ljc1OSwxNy42NzQsOC42NzZxMi42NDcsMS4zMTMsNS4yOTEsMi42MzFjLjkyNC40NjEsMS44NDMuOTMyLDIuNzcxLDEuMzg0YTMuMTYsMy4xNiwwLDAsMCwzLjA3OS0uMDM3cTQuMTM4LTEuNjY4LDguMzMyLTMuMTg5YzIuNDE4LS44Nyw0Ljg0NS0xLjcxNiw3LjI0Ni0yLjYzNCwxLjQ3OS0uNTY2LDIuMTM4LTIuOC40NzgtMy42NTYtNC43MzgtMi40NDktOS40MjctNC45OTEtMTQuMS03LjU2LTIuNDA4LTEuMzI0LTQuNzc2LTIuODIzLTcuMjUyLTQuMDE2LTIuMzA5LTEuMTEzLTQuMzQsMi4zMzUtMi4wMTksMy40NTQsMi40NzYsMS4xOTMsNC44NDQsMi42OTIsNy4yNTMsNC4wMTYsNC42NzMsMi41NjksOS4zNjIsNS4xMTEsMTQuMSw3LjU2bC40NzgtMy42NTVjLTUuNTU1LDIuMTI0LTExLjE3OCw0LjAzMy0xNi42OTEsNi4yNzRsMS41NDEuMmMtOC43LTQuMzUtMTcuNC04LjY3OC0yNi4xNjEtMTIuOWwtLjQ3OCwzLjY1NmM3LjI3LTEuMjI2LDE0LjI0Ny0zLjY5MSwyMS41LTQuOTQ4YTIuMDE2LDIuMDE2LDAsMCwwLDEuNC0yLjQ2QTIuMDQ2LDIuMDQ2LDAsMCwwLDEwNi43MSwxMjkuNjc5WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMjMuMzQ2LDE0MC44N2MuNTktNC43NzksNS41OTItOC43NjUsMTIuMDE1LTYsLjk3LDIuOTgyLDIuNjU1LDcuNDksMy42OTEsMTEuMjU4LTEuNDEyLDEuMTQyLTIuNjMzLDIuMTM0LTIuNjMzLDIuMTM0LTIuMDY2LDIuNDk0LTYuNjMsMi4wNDUtOS4xMTIuNTM1QTguMjQ3LDguMjQ3LDAsMCwxLDEyMy4zNDYsMTQwLjg3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMzQuNjY5LDEzMi40ODdhMTAuODc1LDEwLjg3NSwwLDAsMC04LjEwOS42MDYsOS45MzEsOS45MzEsMCwwLDAtNC42NjUsNS4zNTZjLTEuOTgsNS4yLDEuMTUyLDExLjA1Niw2LjI0NiwxMi45MjIsMy4xMTcsMS4xNDEsNy4zOC45NzUsOS42OTItMS43YTIuMDUsMi4wNSwwLDAsMCwwLTIuODI5LDIuMDE4LDIuMDE4LDAsMCwwLTIuODI4LDBjLS4xLjExMS0uMi4yMTItLjMuMzIxLS4wNjYuMDc0LS4zNjkuMzE2LS4wNTguMDhhNS4yNDQsNS4yNDQsMCwwLDEtLjY2NS40MDVjLS4xLjA1My0uNDQ5LjE2Ni0uMDg1LjA0My0uMTEzLjAzOC0uMjIzLjA3OC0uMzM3LjExMmE2LjYyNiw2LjYyNiwwLDAsMS0uODguMmMuNC0uMDYzLDAsMC0uMTA3LDAtLjE1NS4wMDYtLjMwOS4wMTktLjQ2NC4wMjEtLjI4MS4wMDUtLjU2LS4wMTQtLjg0LS4wMjYtLjEsMC0uNTEtLjA1MS0uMTIsMC0uMTIzLS4wMTYtLjI0Ni0uMDM4LS4zNjgtLjA2MWE5LjUsOS41LDAsMCwxLS45ODQtLjIzM2MtLjI1Ny0uMDc1LS41MDktLjE2NC0uNzYtLjI1Ni4zODYuMTQyLS4yNjQtLjEyOC0uMzcyLS4xODZhNi41ODEsNi41ODEsMCwwLDEtLjY2My0uNDE2Yy0uNDg3LS4zMzguMTYxLjE0LS4xMDYtLjA4Mi0uMTM4LS4xMTQtLjI3NC0uMjMtLjQwNi0uMzVxLS4yODgtLjI2My0uNTU1LS41NDZjLS4wNzYtLjA4Mi0uMTUxLS4xNjUtLjIyNS0uMjUsMCwwLS4zNDMtLjQxOS0uMTU2LS4xNzlzLS4xMjktLjE4NC0uMTMxLS4xODdjLS4wNi0uMDg3LS4xMTktLjE3NS0uMTc1LS4yNjRhNy45NTMsNy45NTMsMCwwLDEtLjQxOS0uNzQxYy0uMDU2LS4xMTItLjEwOS0uMjI3LS4xNjEtLjM0Mi4wMjcuMDYxLjE0NC40LjAzMi4wNjMtLjA3Ni0uMjMzLS4xNi0uNDYxLS4yMjQtLjctLjA1LS4xODctLjA5LS4zNzUtLjEyOS0uNTY0LS4wMDctLjAzNi0uMDc1LS41LS4wMzEtLjE1Ny4wNDMuMzMxLS4wMS0uMTYzLS4wMTQtLjIyOGExMC41NTgsMTAuNTU4LDAsMCwxLC4wMjctMS4zMzFjLS4wMjYuNDQ5LS4wMTEuMDY4LjAzMy0uMTU1YTguMDQ0LDguMDQ0LDAsMCwxLC4yLS44MDVjLjA1NS0uMTc2LjEyNC0uMzQ2LjE4Mi0uNTIxLjE0LS40MjUtLjE2NC4yNjgtLjAxMi4wMzMuMDYtLjA5NC4xLS4yMTEuMTUxLS4zMTFxLjE0Mi0uMjc2LjMwNi0uNTQxYy4wNzEtLjExNS41NDktLjc2NC4yLS4zMzJhOC4zODksOC4zODksMCwwLDEsLjg0OS0uOTE5Yy4wNzYtLjA2OS41NTYtLjQ2My4zMzQtLjI5NC0uMjYxLjIuMTE1LS4wNzcuMTM5LS4wOTMuMTE5LS4wNzcuMjM2LS4xNTcuMzU4LS4yMy4yLS4xMjQuNDE0LS4yMzkuNjI4LS4zNDMuMDI1LS4wMTIuNDYtLjIuMTU4LS4wNzctLjI4NS4xMTguMTgyLS4wNjMuMjQtLjA4MmE3LjYyNiw3LjYyNiwwLDAsMSwuNzg4LS4yMjZjLjE3Ni0uMDQxLjg3MS0uMTMuMzc1LS4wODRhMTIuNzI4LDEyLjcyOCwwLDAsMSwxLjc3OS0uMDE4Yy4wODYsMCwuMzkyLjA0Ny0uMDIzLS4wMTEuMTc0LjAyNC4zNDcuMDU1LjUxOS4wODkuMzU5LjA3MS43MTIuMTY1LDEuMDYzLjI3YTIsMiwwLDEsMCwxLjA2My0zLjg1N1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTQwLjc5MywxMTguNDU5Yy0uMDc2LS41MzQtLjAzLS4yMzMsMCwuMDc5LjAyMi4yNjIuMDQzLjUyMy4wNjIuNzg1LjA1My43NDkuMDkzLDEuNS4xMjgsMi4yNDkuMDc1LDEuNjQxLjEzLDMuMjg5LjA5MSw0LjkzMi0uMDA3LjMyMS0uMDE3LjY0My0uMDM5Ljk2NC0uMDEyLjE4Ny0uMDI0LjktLjAyMi4zNjQsMCwuNTI5LS4xODEsMCwuMDc0LS4wNDMtLjI4MS4wNTItLjgxOS42MjctMS4xMTIuODYzLTIuMDExLDEuNjI0LTMuOTY1LDMuMzE2LTUuOTgsNC45MzRhMS45NDUsMS45NDUsMCwwLDAtLjUxNCwxLjk0NmMxLjI0OSwzLjc4OSwyLjY2Miw3LjUyNSwzLjcxNiwxMS4zNzZhMi4wMjMsMi4wMjMsMCwwLDAsMi45MzgsMS4yYzguMjkzLTQuNjM5LDE5Ljg4Mi05LjM2NiwxOS42MzYtMjAuNjJhNjUuMzcyLDY1LjM3MiwwLDAsMC0yLjMxOC0xNC42MzUsMzUuMzUzLDM1LjM1MywwLDAsMC01LjY4LTEyLjY1M2MtMy4yOC00LjMtNy4xOTEtOC41OTItMTIuMDM0LTExLjE0Ni0yLjI3Ni0xLjItNC4zLDIuMjUxLTIuMDE5LDMuNDU0LDMuODY0LDIuMDM4LDcuMDE2LDUuMzIxLDkuNzYyLDguNjY1YTMwLjQ2NSwzMC40NjUsMCwwLDEsNS41NzgsMTAuODI0LDc0Ljk4Myw3NC45ODMsMCwwLDEsMi40NzksMTIuNTgxYy4yODYsMi4zODEuNTEyLDQuOTQ4LS40MjIsNy4yMjJhMTMuMTM5LDEzLjEzOSwwLDAsMS0zLjQ5NCw0LjU3MmMtMy45MzEsMy41NjQtOC45MjMsNS43MTgtMTMuNTA3LDguMjgybDIuOTM4LDEuMmMtMS4wNTQtMy44NTItMi40NjctNy41ODgtMy43MTYtMTEuMzc3bC0uNTE1LDEuOTQ2YzIuMTU1LTEuNzMsNC4yMzgtMy41NDksNi40LTUuMjcsMS41LTEuMTkxLDEuNzY1LTIuMzU0LDEuODM4LTQuMTg5YTUzLjYsNTMuNiwwLDAsMC0uNDA2LTkuNTYsMi4wMTMsMi4wMTMsMCwwLDAtMi40Ni0xLjQsMi4wNTQsMi4wNTQsMCwwLDAtMS40LDIuNDYxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMDcuMDkyLDcxLjM2MkEyMy4wMzQsMjMuMDM0LDAsMCwwLDExMi41NzcsODcuNCwxOS44NzcsMTkuODc3LDAsMCwwLDE0MC41LDg5LjQyNWExMS40ODgsMTEuNDg4LDAsMCwwLDcuNjM1LTIuMzksNy4yODQsNy4yODQsMCwwLDAsMi43NzEtNi41LDUuMjk0LDUuMjk0LDAsMCwwLTMuMDg1LTMuODk1LDE4Ljk4LDE4Ljk4LDAsMCwwLTYuNTY4LTIyLjE3NGMtOC45LTYuMzIxLTIxLjQ3NC01LjQ1MS0yOC43ODUsMi44NjZBMjIuNDYxLDIyLjQ2MSwwLDAsMCwxMDcuMDkyLDcxLjM2MlpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTA5Ljk4OSw2MC44MzFhMjIuNzM2LDIyLjczNiwwLDAsMC0yLjYsNy41LDM4LjA3MSwzOC4wNzEsMCwwLDAsMTUuNjM4LTEuODg1LDEuMDg3LDEuMDg3LDAsMCwxLC44NjEuMDc0Yy42MzEuMzU1LS4xMzEsMS43MzMtLjQ4NywyLjM2MywyLjI0LjYzMSw3LjcyNS0uNCwxMC4xNDktMS43MzIsMS4zNDgsMy4yNzYsMi43MjMsNC45ODMsNS4zNjUsNi4yMkwxNDYuMDEsNzYuMmE1LjA1OSw1LjA1OSwwLDAsMSwxLjgxMy40NDUsMTguOTk0LDE4Ljk5NCwwLDAsMC02LjU3NC0yMi4xNzdjLTguOS02LjMyMS0yMS40NzQtNS40NTEtMjguNzg1LDIuODY2QTIwLjU2LDIwLjU2LDAsMCwwLDEwOS45ODksNjAuODMxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNTAuMDU4LDc2LjMyNWEyMS4xNDMsMjEuMTQzLDAsMCwwLTcuMDA2LTIyLjk5MSwyNC4yNTMsMjQuMjUzLDAsMCwwLTIzLjYxNC0zLjMwOGMtOC4yLDMuMzY1LTEzLjM0MiwxMS4wMjEtMTQuMjM0LDE5LjcyOWEyNC42MzIsMjQuNjMyLDAsMCwwLDEwLjAxMiwyMi42MzhjOC4xODYsNS43MTYsMjAuMDIzLDQuNzEsMjcuMjYzLTIuMDc1LDEuODgzLTEuNzY0LS45NS00LjU4OC0yLjgyOC0yLjgyOGExOC4yMSwxOC4yMSwwLDAsMS0yMC4wNDIsMi44NjJjLTYuNzMyLTMuMzYyLTEwLjQ5MS0xMC41ODYtMTAuNTMyLTE3Ljk2MS0uMDM5LTcuMDg5LDMuMzM0LTEzLjk4OCw5LjU4My0xNy41N2EyMC4xLDIwLjEsMCwwLDEsMTkuNjIuMTI5QTE3LjE4MSwxNy4xODEsMCwwLDEsMTQ2LjIsNzUuMjYxYy0uNzkyLDIuNDU2LDMuMDY5LDMuNTA4LDMuODU3LDEuMDY0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNDYuMDEsNzguMmMuNDcxLjAzMy0uMjE5LS4wODcuMi4wMjIuMTc4LjA0Ny4zNTguMDg0LjUzNC4xNDEuMS4wMzMuNTEuMjI4LjIwNy4wNzMuMTY1LjA4NC4zMjkuMTcuNDg2LjI2Ny4wNzIuMDQ1LjQ2NC4zMjkuMi4xMTdhNS4xOTIsNS4xOTIsMCwwLDEsLjQxMi4zNzMsNC44NDgsNC44NDgsMCwwLDEsLjM3Mi40MTNjLS4yMzQtLjMuMDcyLjEzNC4xMTMuMmE0LjgyLDQuODIsMCwwLDEsLjI2MS40OTJjLS4xNi0uMzU2LjAzNC4xMzkuMDU3LjIyYTQuMTIzLDQuMTIzLDAsMCwxLC4xMjMuNTVjLS4wNTctLjM5NS0uMDA2LjE1OSwwLC4yNDIsMCwuMi0uMDA5LjM5LS4wMi41ODUtLjAyNC40NDcuMDY4LS4xNTItLjA0Mi4yNDctLjA4OS4zMjYtLjI2My45NTYtLjMyMSwxLjA5MWE2Ljg2Miw2Ljg2MiwwLDAsMS0xLjA2NCwxLjYzNyw1Ljg3NCw1Ljg3NCwwLDAsMS0xLjczNCwxLjMzOCw3Ljk3Niw3Ljk3NiwwLDAsMS0yLjE0OC44ODUsMTEuNTU1LDExLjU1NSwwLDAsMS0xLjI3NS4yODNxLS4yMTMuMDMzLDAsMGMtLjEwNi4wMTItLjIxMi4wMjMtLjMxOC4wMzEtLjI0NS4wMjEtLjQ4OS4wMzItLjczNS4wMzhhMiwyLDAsMCwwLDAsNGM0Ljc3MS0uMTE3LDkuNTkyLTIuNywxMS4yMTMtNy4zOGE3LjQ1OCw3LjQ1OCwwLDAsMC0uNjg5LTYuNTE0QTcuNTY3LDcuNTY3LDAsMCwwLDE0Ni4wMSw3NC4yYTIuMDEsMi4wMSwwLDAsMC0yLDIsMi4wNDksMi4wNDksMCwwLDAsMiwyWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xMTkuNzA4LDc4LjYzN2EzLjE2MiwzLjE2MiwwLDAsMS0xLjI5LDIuMzgyLDIuNDU5LDIuNDU5LDAsMCwxLTEuODExLjM0MywyLjc2LDIuNzYsMCwwLDEtMS45OTMtMS41LDMuMjI4LDMuMjI4LDAsMCwxLC44LTMuNzE0LDIuNTU1LDIuNTU1LDAsMCwxLDMuNDc0LjE5MUEyLjg0NSwyLjg0NSwwLDAsMSwxMTkuNzA4LDc4LjYzN1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTMxLjg2Nyw4MS4xMjFhMy4xNzIsMy4xNzIsMCwwLDEtMS4yOSwyLjM4MiwyLjQ2NCwyLjQ2NCwwLDAsMS0xLjgxMi4zNDIsMi43NTYsMi43NTYsMCwwLDEtMS45OTItMS41LDMuMjI4LDMuMjI4LDAsMCwxLC44LTMuNzE0LDIuNTU0LDIuNTU0LDAsMCwxLDMuNDczLjE5MUEyLjg1LDIuODUsMCwwLDEsMTMxLjg2Nyw4MS4xMjFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEzMS42MjUsNjcuNjg0YTE3LjQxMiwxNy40MTIsMCwwLDAsMi42ODYsNC43MjgsMTAuNjQyLDEwLjY0MiwwLDAsMCwzLjYsMi42ODgsMi4xNTYsMi4xNTYsMCwwLDAsMS41NDEuMiwyLDIsMCwwLDAsLjQ3OC0zLjY1NSwxMC40NiwxMC40NiwwLDAsMS0xLjkxNS0xLjE0OGwuNC4zMTNhOC43ODYsOC43ODYsMCwwLDEtMS41NDMtMS41NThsLjMxMi40YTE1LjAxLDE1LjAxLDAsMCwxLTEuNzg3LTMuMjI5bC4yLjQ3OGMtLjA0LS4wOTUtLjA4LS4xOS0uMTE5LS4yODVhMi4yLDIuMiwwLDAsMC0uOTE5LTEuMTk1LDIsMiwwLDAsMC0yLjczNy43MTcsMS45MjksMS45MjksMCwwLDAtLjIsMS41NDFaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTEzMi41NDQsNjUuNDI2Yy0yLjI4MywxLjItNi4xODcsMi4xMzUtOC42MDgsMS41M2wxLjE5NSwyLjkzOGMuNzctMS4zNzYsMS42MS0zLjI4OS4zMjQtNC42NS0xLjQ4Ni0xLjU3Mi0zLjYtLjQ2NS01LjMsMGEzNy43NTQsMzcuNzU0LDAsMCwxLTEyLjExMiwxLjEzNmMtMi41NzItLjE0Mi0yLjU2NCwzLjg1OCwwLDRhNDMuNDU1LDQzLjQ1NSwwLDAsMCw4LjExOS0uMjc5YzEuMjY4LS4xNjgsMi41MjctLjM4NCwzLjc3My0uNjc1cS45NjktLjIyNywxLjkyMy0uNTA1LjUzNS0uMTU2LDEuMDY0LS4zMjljLjE0Mi0uMDQ1LjI4NC0uMDkyLjQyNS0uMTQxcS40Mi0uMTQ1LjAxLDBsLS44ODItLjUxNC4xNDkuMTM1LS41MTQtLjg4M2MtLjItLjQ3OC4xNzQtLjQzNi0uMDUzLS4wMzUtLjEzNC4yMzYtLjI0OS40ODQtLjM4Mi43MjFhMi4wMjIsMi4wMjIsMCwwLDAsMS4xOTUsMi45MzgsMTQuNTIyLDE0LjUyMiwwLDAsMCw1LjktLjEsMTkuMzUzLDE5LjM1MywwLDAsMCw1Ljc5NC0xLjgzM2MyLjI3OC0xLjIuMjU5LTQuNjU1LTIuMDE5LTMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0xNDIuODc1LDEyNS40OTFBMTE4LjQ0MiwxMTguNDQyLDAsMCwwLDE1Ni45LDEyNi45YTIsMiwwLDAsMCwwLTQsMTEwLjYxOSwxMTAuNjE5LDAsMCwxLTEyLjk2My0xLjI2MiwyLjA2MywyLjA2MywwLDAsMC0yLjQ2LDEuNCwyLjAxNiwyLjAxNiwwLDAsMCwxLjQsMi40NlpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNOTQuNTc5LDEwNi4zMTFsMTEuNTgsNy41MjdhMi4wMTQsMi4wMTQsMCwwLDAsMi43MzYtLjcxNywyLjA0NSwyLjA0NSwwLDAsMC0uNzE3LTIuNzM3TDk2LjYsMTAyLjg1N2EyLjAxNiwyLjAxNiwwLDAsMC0yLjczNy43MTcsMi4wNDYsMi4wNDYsMCwwLDAsLjcxOCwyLjczN1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjA0LjI3MiwyOS4zNTFjLjM0OCwwLC42ODYuMDIzLDEuMDIzLjA1YTE1LjI4MiwxNS4yODIsMCwwLDEsMjYuNTg5LDEuM2MuNDg3LS4wNDQuOTgyLS4wNzIsMS40ODgtLjA3MkExNC41OSwxNC41OSwwLDAsMSwyNDguMjUsNDUuNDJjMCw4LjkyMS02LjIxMSwxNS4wNjQtMTQuODc5LDE1LjA2NGExNS4wMzUsMTUuMDM1LDAsMCwxLTkuODcxLTMuMzM5LDExLjY0NiwxMS42NDYsMCwwLDEtNy42NjIsMi42NjhjLTUuMzc0LDAtOS4zMDYtMi44NDktMTAuODQ1LTcuMjktLjI0LjAxMy0uNDc2LjAzMy0uNzIxLjAzMy03LDAtMTEuNTY2LTQuODIxLTExLjU2Ni0xMS43MUExMS4zMzIsMTEuMzMyLDAsMCwxLDIwNC4yNzIsMjkuMzUxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJhXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yODUuMTYxLDg5Ljk0OGMuMjcxLDAsLjUzNC4wMTguOC4wMzlBMTEuOSwxMS45LDAsMCwxLDMwNi42NjUsOTFjLjM4LS4wMzQuNzY1LS4wNTYsMS4xNTktLjA1NmExMS4zNjMsMTEuMzYzLDAsMCwxLDExLjU4OCwxMS41MTdjMCw2Ljk0OC00LjgzOCwxMS43MzItMTEuNTg5LDExLjczMmExMS43MSwxMS43MSwwLDAsMS03LjY4Ny0yLjYsOS4wNzEsOS4wNzEsMCwwLDEtNS45NjgsMi4wNzhjLTQuMTg1LDAtNy4yNDctMi4yMi04LjQ0Ni01LjY3OC0uMTg3LjAxLS4zNzEuMDI1LS41NjIuMDI1LTUuNDQ5LDAtOS4wMDctMy43NTQtOS4wMDctOS4xMkE4LjgyNSw4LjgyNSwwLDAsMSwyODUuMTYxLDg5Ljk0OFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiZFxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTkuNTY4LDIuNDI4YTE4LjgsMTguOCwwLDAsMSwyMi43MzcsMTQuNjFjMi40MSwxMS4yMzgtMy43NTYsMjAuNjU1LTE0LjY3NSwyM0MxNi4yOTEsNDIuNDY1LDcuMjExLDM2LjI0MSw0LjgxNywyNS4wNzVBMTguNzgxLDE4Ljc4MSwwLDAsMSwxOS41NjgsMi40MjhaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIwLjEsNC4zNTdhMTYuOTc0LDE2Ljk3NCwwLDAsMSwxOC41MTEsOC4zNzJjMy4zMjUsNi4wOSwzLjA2MywxNC40Ni0xLjYxNSwxOS43OTRBMTguOSwxOC45LDAsMCwxLDE3LjQ0OSwzNy43Yy02LjYwOS0yLjItMTAuNy05LjAyNC0xMS4wNS0xNS43OEExNy4xMDYsMTcuMTA2LDAsMCwxLDkuNjg0LDEwLjgsMTcuNTEzLDE3LjUxMywwLDAsMSwyMC4xLDQuMzU3QzIyLjYxMSwzLjgsMjEuNTQ4LS4wNjEsMTkuMDM3LjVBMjEuMDI4LDIxLjAyOCwwLDAsMCwyLjQ2OSwxOC45NjdDMS42MzksMjcuMzQ2LDYsMzYuNjA4LDEzLjY3Myw0MC40MjljNy43ODMsMy44NzcsMTcuODg0LDIuMjg2LDI0LjQwOS0zLjM1LDYuNjA4LTUuNzA3LDguMzM0LTE1LjQ4MSw1LjI5MS0yMy40ODdBMjEuMTY5LDIxLjE2OSwwLDAsMCwzNC4xOTQsMi42NjcsMjEuNTg0LDIxLjU4NCwwLDAsMCwxOS4wMzcuNUMxNi41MTcsMS4wMTcsMTcuNTgzLDQuODc0LDIwLjEsNC4zNTdaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTM4LjUsNjQuODdxLTEuMzA2LTUuMTItMi42MTItMTAuMjRhMiwyLDAsMCwwLTMuODU3LDEuMDYzcTEuMzA1LDUuMTIxLDIuNjEyLDEwLjI0MUEyLDIsMCwwLDAsMzguNSw2NC44N1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTIuNDQyLDU2LjcwOXEtMS4yMjYsMTMuMDQ3LTIuNDMxLDI2LjFhMi4wMTUsMi4wMTUsMCwwLDAsMiwyLDIuMDQzLDIuMDQzLDAsMCwwLDItMnExLjIxNS0xMy4wNDksMi40MzEtMjYuMWEyLjAxNSwyLjAxNSwwLDAsMC0yLTIsMi4wNDMsMi4wNDMsMCwwLDAtMiwyWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk03MC44NjUsMTAuNTkyLDU5LjY3OSwxMi42NjdhMi4wMSwyLjAxLDAsMCwwLTEuNCwyLjQ2LDIuMDUyLDIuMDUyLDAsMCwwLDIuNDYsMS40bDExLjE4Ni0yLjA3NWEyLjAxMSwyLjAxMSwwLDAsMCwxLjQtMi40NjEsMi4wNTMsMi4wNTMsMCwwLDAtMi40Ni0xLjRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTgzLjUsMzguNjEycS0xMS45LTMuNjc4LTIzLjgtNy4zNjRjLTIuNDY1LS43NjItMy41MTksMy4xLTEuMDYzLDMuODU3cTExLjksMy42NzUsMjMuOCw3LjM2NGMyLjQ2NS43NjIsMy41MTktMy4xLDEuMDYzLTMuODU3WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk02My41NjksNjAuMDMzcS02LjQyMi02LjY1Ni0xMi44MzgtMTMuMzE0QTIsMiwwLDAsMCw0Ny45LDQ5LjU0N1E1NC4zMiw1Ni4yMDYsNjAuNzQsNjIuODYyYTIsMiwwLDAsMCwyLjgyOS0yLjgyOVpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMjA0LjI3MiwzMS4zNTFjLjM0My4wMDcuNjgxLjAyNSwxLjAyMy4wNWExLjk5LDEuOTksMCwwLDAsMS43MjctLjk5MSwxMy4yLDEzLjIsMCwwLDEsMTIuMzcyLTYuMSwxMi45NDIsMTIuOTQyLDAsMCwxLDEwLjc2Myw3LjQsMS45NDMsMS45NDMsMCwwLDAsMS43MjcuOTksMTMuNDYxLDEzLjQ2MSwwLDAsMSw5LjY1OCwyLjY4MSwxMi44MzEsMTIuODMxLDAsMCwxLDQuNjExLDguMjc5QzI0Nyw1MC4xOTMsMjQzLjMyNiw1Ni41MiwyMzYuOCw1OC4xYTEzLjk3NywxMy45NzcsMCwwLDEtMTEuODgyLTIuMzY3LDIuMDc2LDIuMDc2LDAsMCwwLTIuODI4LDBjLTQuODExLDMuOTQ4LTEzLDIuMjM3LTE1LjE2NS0zLjczOWEyLjA1MywyLjA1MywwLDAsMC0xLjkyOC0xLjQ2OSw5Ljk1OCw5Ljk1OCwwLDAsMS03LjE4Mi0yLjE0Niw5LjUsOS41LDAsMCwxLTMuMDgtNi42NjcsOS41MzcsOS41MzcsMCwwLDEsOS41NDEtMTAuMzU5YzIuNTcyLS4wMzUsMi41NzktNC4wMzUsMC00YTEzLjUzMywxMy41MzMsMCwwLDAtMTIuOTY1LDkuNDMyYy0xLjY3Myw1LjQuMDcxLDExLjgsNC42NDksMTUuMmExMy45LDEzLjksMCwwLDAsOS4wMzcsMi41MzhsLTEuOTI5LTEuNDY4YTEyLjgyNywxMi44MjcsMCwwLDAsOC41LDguMTcxLDE0LjYwNSwxNC42MDUsMCwwLDAsMTMuMzUyLTIuNjY3aC0yLjgyOGM2Ljk0LDUuNjgzLDE4LjQzNyw1LjI4OSwyNC4yOTEtMS44NDlhMTcuNzQ2LDE3Ljc0NiwwLDAsMC0uODUzLTIzLjA4OCwxNy4wNzQsMTcuMDc0LDAsMCwwLTEzLjY0LTQuOTE4bDEuNzI3Ljk5MWExNi45NTksMTYuOTU5LDAsMCwwLTE0LjIxNy05LjM4NiwxNy4xODEsMTcuMTgxLDAsMCwwLTE1LjgyNiw4LjA4MmwxLjcyNy0uOTljLS4zNDItLjAyNS0uNjgtLjA0My0xLjAyMy0uMDVDMjAxLjcsMjcuMywyMDEuNywzMS4zLDIwNC4yNzIsMzEuMzUxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yODUuMTYxLDkxLjk0OGMuMjY2LDAsLjUzMS4wMTUuOC4wMzlBMS45OTMsMS45OTMsMCwwLDAsMjg3LjY4NCw5MWE5LjgyNyw5LjgyNywwLDAsMSw5LjEzLTQuNTQsOS42Niw5LjY2LDAsMCwxLDguMTI0LDUuNTU2LDEuOTQ1LDEuOTQ1LDAsMCwwLDEuNzI3Ljk5LDkuODM3LDkuODM3LDAsMCwxLDguNzM0LDMuNDksMTAuMjM1LDEwLjIzNSwwLDAsMSwxLjY0LDguOTI4LDguODg3LDguODg3LDAsMCwxLTUuNDQ5LDYuMTI2LDEwLjU5MywxMC41OTMsMCwwLDEtMTAuMDQtMS4zNjUsMi4wNzksMi4wNzksMCwwLDAtMi44MjksMGMtMy41LDIuODQ3LTkuNDgyLDEuNjEtMTEuMDcxLTIuNzE3QTIuMDUzLDIuMDUzLDAsMCwwLDI4NS43MjIsMTA2Yy00LjAxLjIzMy03LjMtMi4yNzktNy41NDktNi40YTYuOTg3LDYuOTg3LDAsMCwxLDYuOTg4LTcuNjQzYzIuNTcxLS4wNDUsMi41NzktNC4wNDUsMC00YTExLjAxLDExLjAxLDAsMCwwLTEwLjk4OCwxMS42NDNBMTAuNzc3LDEwLjc3NywwLDAsMCwyODUuNzIyLDExMGwtMS45MjktMS40NjhhMTAuNDc4LDEwLjQ3OCwwLDAsMCw3LjAwOCw2LjcsMTEuODU4LDExLjg1OCwwLDAsMCwxMC43NDktMi4yMTVoLTIuODI5YzUuNTY0LDQuNTIyLDE0LjY1NSw0LjMyNiwxOS40NDEtMS4zMTdhMTQuMjYyLDE0LjI2MiwwLDAsMC0uNTYxLTE4LjczQTEzLjc0MiwxMy43NDIsMCwwLDAsMzA2LjY2NSw4OWwxLjcyNy45OTFhMTMuNjc3LDEzLjY3NywwLDAsMC0xMS41NzgtNy41MzcsMTMuODI5LDEzLjgyOSwwLDAsMC0xMi41ODQsNi41MjJsMS43MjctLjk5MWMtLjI2NS0uMDI0LS41My0uMDM2LS44LS4wMzlDMjgyLjU4Niw4Ny44NzUsMjgyLjU4OCw5MS44NzUsMjg1LjE2MSw5MS45NDhaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImFcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTIyMS4yNDQsMTIyLjE3MWMwLDMuMi0yLjIzMSw2LjM2NC02LjQxOCw4Ljc4MmEzMS43MjUsMzEuNzI1LDAsMCwxLTMwLjczMy4xMDljLTQuNTc1LTIuNjQxLTYuODE2LTUuODYxLTYuNjcyLTkuMDg0LjAzOS0zLjA5MiwyLjI4LTYuMTYsNi42Ny04LjdsMzAuNzM1LjExNWM0LjE4OSwyLjQxOSw2LjQxOSw1LjU3MSw2LjQxOSw4Ljc3NVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJkXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMTIuMzE0LDExMS40NDFjLTIuOS0zLjU4Ny03LjQwNi01LjcxOC0xMi45ODItNS43MTgtNy41MzMsMC0xMy40MDYsNC4xNTgtMTUuNjM3LDEwLjdhNC41NzEsNC41NzEsMCwwLDAsMS4xODIsMS4zODYsNS44NDksNS44NDksMCwwLDAsMy42NDUsMS4wMTEsMTIuNzY1LDEyLjc2NSwwLDAsMSwxLjMxMy4xLDE3Ljg0NSwxNy44NDUsMCwwLDAsMTkuMy0uMDE3LDcuNzcsNy43NywwLDAsMSwxLjAwNy0uMDg1LDUuODI5LDUuODI5LDAsMCwwLDMuNjQ1LTEuMDExLDQuNTU3LDQuNTU3LDAsMCwwLDEuMi0xLjQyNkExNS43LDE1LjcsMCwwLDAsMjEyLjMxNCwxMTEuNDQxWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMTcuOTQ1LDEyMi41NDNjLS4wNTctNy4zMTEtMy42MzItMTQuMjYyLTEwLjU1NC0xNy4yMjQtNy4wOTItMy4wMzQtMTYuMTk1LTEuOC0yMS42MjUsMy44ODdhMTkuMzQ4LDE5LjM0OCwwLDAsMC01LjA0NiwxMy4xODVjLS4wNDYsMi41NzUsMy45NTQsMi41NzYsNCwwLC4xMjEtNi43NDYsNC0xMi42LDEwLjcyNC0xNC4yMjYsNS41NjYtMS4zNDYsMTIuMTQzLjE5MSwxNS42NTEsNC45NTFhMTUuOTE2LDE1LjkxNiwwLDAsMSwyLjg1LDkuNDI3Yy4wMiwyLjU3Myw0LjAyLDIuNTc5LDQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTkzLjc2LDExMC4yMjVhNTcuMTgsNTcuMTgsMCwwLDAtNS4yNzgtOC44OTIsMi4wNDgsMi4wNDgsMCwwLDAtMi43MzctLjcxOCwyLjAyMywyLjAyMywwLDAsMC0uNzE3LDIuNzM3LDU3LjEsNTcuMSwwLDAsMSw1LjI3OCw4Ljg5MiwyLjAxMSwyLjAxMSwwLDAsMCwyLjczNy43MTgsMi4wNTQsMi4wNTQsMCwwLDAsLjcxNy0yLjczN1pcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTg5LjYzMywxMjEuMTU2YTIwLjE3NywyMC4xNzcsMCwwLDAsMTkuNC4xNjdjMi4yNjUtMS4yMjcuMjQ3LTQuNjgyLTIuMDE5LTMuNDU0YTE2LjAzMSwxNi4wMzEsMCwwLDEtMTUuMzYxLS4xNjdjLTIuMjQzLTEuMjcxLTQuMjYxLDIuMTg0LTIuMDE5LDMuNDU0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMTMuODE2LDExNS4xMThjLjQ4OS4yODUuOTY5LjU4NSwxLjQzMy45MDhxLjE4MS4xMjYuMzYxLjI1OGMuMDQ5LjAzNi4zODEuMjkzLjE0NC4xMDZzLjA4NS4wNy4xMzMuMTA5cS4xNjIuMTMyLjMyMS4yN2ExMy43NjUsMTMuNzY1LDAsMCwxLDEuMDIuOTcycS4yNDIuMjU1LjQ2OS41MjVjLjA2Ny4wNzkuMTMxLjE2MS4yLjI0MS4xMjUuMTUtLjI3OS0uMzc4LS4wMTUtLjAxNGE5Ljg0Miw5Ljg0MiwwLDAsMSwuNjY1LDEuMDQ3Yy4xLjE4My4xOS4zNzEuMjguNTU5LjE0Mi4zLS4wMjIuMDEzLS4wNDctLjExOWEyLjQwOCwyLjQwOCwwLDAsMCwuMTE2LjMwOSw3LjUzOSw3LjUzOSwwLDAsMSwuMzA4LDEuMTQ2Yy4wMTUuMDgzLjA1OC40MTQuMDE0LjA0OXMtLjAwNy0uMDM1LDAsLjA0OWMuMDE5LjIxMS4wMjcuNDIyLjAyOS42MzNhMiwyLDAsMCwwLDQsMGMtLjAzNi00LjY5My0zLjU5NS04LjI4LTcuNDEtMTAuNWEyLDIsMCwwLDAtMi4wMTksMy40NTRaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9XFxcImNcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTE4My4wODEsMTExLjU0OWMtMy44MjQsMi4yMzItNy42MjQsNS43NTUtNy42NjEsMTAuNTEzYTIsMiwwLDAsMCw0LDBjMC0uMi4wMS0uNC4wMjgtLjYuMDA4LS4wODYuMDQ1LS40MDYsMC0uMDM2czAsLjA1MS4wMTMtLjAzNWE3LjA1OCw3LjA1OCwwLDAsMSwuMy0xLjFjLjAzNS0uMS4wODUtLjIuMTE0LS4zLS4xNTkuNTM3LS4xLjIzNi0uMDI4LjA4M3MuMTYzLS4zMy4yNTItLjQ5MWExMC43MzMsMTAuNzMzLDAsMCwxLC43MjUtMS4xMTRjLjE0Mi0uMi0uMjgxLjM0NC0uMDUyLjA3LjA3OS0uMS4xNTctLjE5LjIzOC0uMjg0cS4yMy0uMjY2LjQ3NC0uNTE3Yy4zNDQtLjM1NS43MDgtLjY5MSwxLjA4NS0xLjAxcS4xMzUtLjExNC4yNzMtLjIyNWMuMDc4LS4wNjQuNDA5LS4zODkuMDUxLS4wNDRhNS4zMTIsNS4zMTIsMCwwLDEsLjY2Ny0uNDgyYy41LS4zNDcsMS4wMTctLjY2OSwxLjU0Mi0uOTc1YTIsMiwwLDEsMC0yLjAxOS0zLjQ1NFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiYlxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTc3Ljk3OSwxMjcuMjY0YTI1LjgzLDI1LjgzLDAsMCwxLS41Ni01LjA5YzAsLjAzNSwwLC4wNjksMCwuMSwwLDMuMTIzLDIuMjQyLDYuMjI1LDYuNjc1LDguNzg0YTMxLjcyNSwzMS43MjUsMCwwLDAsMzAuNzMzLS4xMDljNC4xODctMi40MTgsNi40MTgtNS41NzcsNi40MTgtOC43ODIsMC0uMDQyLDAtLjA4NCwwLS4xMjctLjEsMTIuOTMzLTguNzMyLDIxLjk2LTIxLjkxMiwyMS45Ni0xMC4xMzgsMC0xNy45OTUtNS43MDctMjAuOC0xNC42MzhRMTc4LjIxLDEyOC4zNDIsMTc3Ljk3OSwxMjcuMjY0WlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPVxcXCJjXFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XFxcIk0yMTkuMjQ0LDEyMS44MThjLS4wNDYsNy44MTktMy43LDE1LjMxNS0xMS4xNDMsMTguNTExLTcuNTQyLDMuMjM5LTE3LjM0NCwxLjk1NC0yMy4xODQtMy45OTFhMjAuNTg4LDIwLjU4OCwwLDAsMS01LjUtMTQuMzJjLS4wMzktMi41NzEtNC4wMzktMi41NzktNCwwYTI1LjIyNSwyNS4yMjUsMCwwLDAsNS4zOTEsMTUuNzEzLDIyLjUxMiwyMi41MTIsMCwwLDAsMTIsNy40ODhjOS40MSwyLjM0NCwyMC4wMS0uNDUxLDI1Ljg4NS04LjQxNWEyNS40MjIsMjUuNDIyLDAsMCwwLDQuNTQ2LTE0Ljk4NmMuMDE1LTIuNTc0LTMuOTg1LTIuNTc3LTQsMFpcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz1cXFwiY1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVxcXCJNMTc1LjQxOCwxMjIuMjc4Yy4xNzgsOC4xNDksMTAuMDE2LDEyLjU2OSwxNi44MjQsMTMuOTcxYTMzLjcyNCwzMy43MjQsMCwwLDAsMjMuOTgtMy44YzMuNy0yLjI0Nyw2LjkyMy01Ljc0LDcuMDIyLTEwLjI4LjA1Ni0yLjU3NS0zLjk0NC0yLjU3NC00LDAtLjA2MywyLjktMi4zNjYsNS4xMjktNC42NjUsNi41OTNhMjcuNTQyLDI3LjU0MiwwLDAsMS05LjQ2MSwzLjY2MywyOS4yMjEsMjkuMjIxLDAsMCwxLTE5Ljg0NC0yLjk5NGMtMi42MjQtMS40OS01Ljc4My0zLjgyNy01Ljg1Ni03LjE1NS0uMDU1LTIuNTctNC4wNTYtMi41NzktNCwwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9zdmc+XFxyXFxuICAgICAgICAgICAgPC9oMT5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNlYXJjaCBmbGV4IG1yZ24tYm90dG9tLTQwMFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjQ4XFxcIiB2aWV3Qm94PVxcXCIwIC05NjAgOTYwIDk2MFxcXCIgd2lkdGg9XFxcIjQ4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTc5Ni0xMjEgNTMzLTM4NHEtMzAgMjYtNjkuOTU5IDQwLjVUMzc4LTMyOXEtMTA4LjE2MiAwLTE4My4wODEtNzVRMTIwLTQ3OSAxMjAtNTg1dDc1LTE4MXE3NS03NSAxODEuNS03NXQxODEgNzVRNjMyLTY5MSA2MzItNTg0Ljg1IDYzMi01NDIgNjE4LTUwMnEtMTQgNDAtNDIgNzVsMjY0IDI2Mi00NCA0NFpNMzc3LTM4OXE4MS4yNSAwIDEzOC4xMjUtNTcuNVQ1NzItNTg1cTAtODEtNTYuODc1LTEzOC41VDM3Ny03ODFxLTgyLjA4MyAwLTEzOS41NDIgNTcuNVExODAtNjY2IDE4MC01ODV0NTcuNDU4IDEzOC41UTI5NC45MTctMzg5IDM3Ny0zODlaXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L3N2Zz5cXHJcXG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJsaXN0LXNlYXJjaC1pbnB1dCBmbGV4XFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiU2VhcmNoIGluIHlvdXIgbGlzdC4uLlxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjQ4XFxcIiB2aWV3Qm94PVxcXCIwIC05NjAgOTYwIDk2MFxcXCIgd2lkdGg9XFxcIjQ4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cXFwiTTQ0MC0xNjBxLTE3IDAtMjguNS0xMS41VDQwMC0yMDB2LTI0MEwxNjEtNzQ1cS0xNC0xNy00LTM2dDMxLTE5aDU4NHEyMSAwIDMxIDE5dC00IDM2TDU2MC00NDB2MjQwcTAgMTctMTEuNSAyOC41VDUyMC0xNjBoLTgwWm00MC0yNzYgMjQwLTMwNEgyNDBsMjQwIDMwNFptMCAwWlxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgPC9zdmc+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmxleCBmaWx0ZXItc2VjdGlvblxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZsZXggYWktaXRlbXMtY2VudGVyIGpjLWNlbnRlciBmcy1maWx0ZXItY2FyZFxcXCI+PHNwYW4+UmVhZDwvc3Bhbj48c3Bhbj54PC9zcGFuPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmbGV4IGZzLWZpbHRlci1jYXJkXFxcIj48c3Bhbj5DdXJyZW50bHkgUmVhZGluZzwvc3Bhbj48c3Bhbj54PC9zcGFuPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmbGV4IGZzLWZpbHRlci1jYXJkXFxcIj48c3Bhbj5XYW50IHRvIFJlYWQ8L3NwYW4+PHNwYW4+eDwvc3Bhbj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDwvaGVhZGVyPlxcclxcblxcclxcbiAgICAgICAgPG1haW4gY2xhc3M9XFxcImdyaWRcXFwiPlxcclxcbiAgICAgICAgICAgIDxzdmcgZGF0YS1nbG9iYWwtYWN0aW9uPVxcXCJhZGRcXFwiIGNsYXNzPVxcXCJhcy1jZW50ZXIganMtY2VudGVyIG1yZ24tYm90dG9tLTgwMFxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIlxcclxcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XFxcIjQ4XFxcIiB2aWV3Qm94PVxcXCIwIC05NjAgOTYwIDk2MFxcXCIgd2lkdGg9XFxcIjQ4XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHBhdGhcXHJcXG4gICAgICAgICAgICAgICAgICAgIGQ9XFxcIk00NTMtMjgwaDYwdi0xNjZoMTY3di02MEg1MTN2LTE3NGgtNjB2MTc0SDI4MHY2MGgxNzN2MTY2Wm0yNy4yNjYgMjAwcS04Mi43MzQgMC0xNTUuNS0zMS41dC0xMjcuMjY2LTg2cS01NC41LTU0LjUtODYtMTI3LjM0MVE4MC0zOTcuNjgxIDgwLTQ4MC41cTAtODIuODE5IDMxLjUtMTU1LjY1OVExNDMtNzA5IDE5Ny41LTc2M3QxMjcuMzQxLTg1LjVRMzk3LjY4MS04ODAgNDgwLjUtODgwcTgyLjgxOSAwIDE1NS42NTkgMzEuNVE3MDktODE3IDc2My03NjN0ODUuNSAxMjdRODgwLTU2MyA4ODAtNDgwLjI2NnEwIDgyLjczNC0zMS41IDE1NS41VDc2My0xOTcuNjg0cS01NCA1NC4zMTYtMTI3IDg2UTU2My04MCA0ODAuMjY2LTgwWm0uMjM0LTYwUTYyMi0xNDAgNzIxLTIzOS41dDk5LTI0MVE4MjAtNjIyIDcyMS4xODgtNzIxIDYyMi4zNzUtODIwIDQ4MC04MjBxLTE0MSAwLTI0MC41IDk4LjgxMlExNDAtNjIyLjM3NSAxNDAtNDgwcTAgMTQxIDk5LjUgMjQwLjV0MjQxIDk5LjVabS0uNS0zNDBaXFxcIiAvPlxcclxcbiAgICAgICAgICAgIDwvc3ZnPlxcclxcblxcclxcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cXFwiYm9va3NcXFwiPlxcclxcbiAgICAgICAgICAgIDwvdWw+XFxyXFxuICAgICAgICA8L21haW4+XFxyXFxuICAgIDwvZGl2PlxcclxcblxcclxcbjwvYm9keT5cXHJcXG48L2h0bWw+XCI7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImNvbnN0IHJhbmRvbVVVSUQgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8ucmFuZG9tVVVJRCAmJiBjcnlwdG8ucmFuZG9tVVVJRC5iaW5kKGNyeXB0byk7XG5leHBvcnQgZGVmYXVsdCB7XG4gIHJhbmRvbVVVSURcbn07IiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxubGV0IGdldFJhbmRvbVZhbHVlcztcbmNvbnN0IHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbmNvbnN0IGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zbGljZSgxKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICByZXR1cm4gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIGNvbnN0IHV1aWQgPSB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBuYXRpdmUgZnJvbSAnLi9uYXRpdmUuanMnO1xuaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgeyB1bnNhZmVTdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIGlmIChuYXRpdmUucmFuZG9tVVVJRCAmJiAhYnVmICYmICFvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5hdGl2ZS5yYW5kb21VVUlEKCk7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3Qgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiB1bnNhZmVTdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGFwcEZhY3RvcnkgZnJvbSBcIi4vY29udHJvbGxlci5qc1wiO1xyXG5pbXBvcnQgXCIuL3N0eWxlcy5jc3NcIjtcclxuaW1wb3J0IGh0bWwgZnJvbSBcIi4vaW5kZXguaHRtbFwiO1xyXG5cclxuY29uc3QgYXBwQ29udHJvbGxlciA9IGFwcEZhY3RvcnkoKTtcclxuIl0sIm5hbWVzIjpbImJvb2tGYWN0b3J5IiwidGl0bGUiLCJhdXRob3IiLCJzdGF0dXMiLCJyYXRpbmciLCJvcGVuREIiLCJkZWxldGVEQiIsIndyYXAiLCJ1bndyYXAiLCJlbnVtRmFjdG9yeSIsInY0IiwidXVpZHY0IiwiYm9va01vZGVsRmFjdG9yeSIsImRiIiwiYm9va3MiLCJib29rU3RhdHVzIiwiYm9va01vZGVsIiwiRXZlbnRUYXJnZXQiLCJhZGQiLCJfYWRkIiwiZWRpdEJvb2siLCJfZWRpdEJvb2siLCJnZXRCb29rcyIsIl9nZXRCb29rcyIsInVwZGF0ZUJvb2tSYXRpbmciLCJfdXBkYXRlQm9va1JhdGluZyIsImdldEJvb2tSYXRpbmciLCJfZ2V0Qm9va1JhdGluZyIsImRlbGV0ZUJvb2siLCJfZGVsZXRlQm9vayIsImluaXRNb2RlbCIsImdldERhdGFiYXNlIiwidHJhbnNhY3Rpb24iLCJzdG9yZSIsIm9iamVjdFN0b3JlIiwiZ2V0QWxsIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidXBncmFkZSIsIm9iamVjdFN0b3JlTmFtZXMiLCJjb250YWlucyIsImNyZWF0ZU9iamVjdFN0b3JlIiwia2V5UGF0aCIsImFkZEJvb2tFdmVudCIsImJvb2tUb0FkZCIsImRldGFpbCIsInV1aWQiLCJwdXNoIiwidXBkYXRlIiwiZWRpdEJvb2tFdmVudCIsImJvb2tUb0VkaXQiLCJtYXAiLCJib29rIiwiYm9va0lEIiwibmV3UmF0aW5nIiwiaWQiLCJmaW5kIiwiYm9va1VVSUQiLCJmaWx0ZXIiLCJkZWxldGUiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJmb3JFYWNoIiwicHV0IiwicmF0aW5nU3RhcnNDb21wb25lbnRGYWN0b3J5IiwiYWRkQm9va01vZGFsQ29tcG9uZW50RmFjdG9yeSIsImZvcm1IZWFkZXIiLCJidXR0b25UZXh0IiwibW9kZSIsImZvcm1XcmFwcGVyIiwiY3VycmVudFJhdGluZyIsImJvb2tNb2RhbENvbXBvbmVudCIsImNyZWF0ZUJvb2tNb2RhbERPTU5vZGUiLCJyYXRpbmdTdGFyc0NvbXBvbmVudCIsImdldENvbXB1dGVkU3R5bGUiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImdldFByb3BlcnR5VmFsdWUiLCJjcmVhdGVGb3JtV3JhcHBlck5vZGUiLCJpbml0RXZlbnRMaXN0ZW5lcnMiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwicmV0dXJuQm9va01vZGFsSFRNTCIsImNvbG9yaXplUmF0aW5nU3RhcnMiLCJxdWVyeVNlbGVjdG9yIiwiaW5pdENvcnJlY3RCdXR0b25MaXN0ZW5lckFjY29yZGluZ1RvTW9kZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVCb29rTW9kYWwiLCJxdWVyeVNlbGVjdG9yQWxsIiwic3RhciIsImNoYW5nZVJhdGluZyIsImFkZEJvb2siLCJjcmVhdGVCb29rT2JqZWN0RnJvbVVzZXJJbnB1dCIsInZhbHVlIiwiZXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsInN0eWxlIiwiZGlzcGxheSIsInRhcmdldCIsImRhdGFzZXQiLCJzdGFyTnVtYmVyIiwicmV0dXJuUmF0aW5nU3RhcnNIVE1MIiwiYm9va0NhcmRGYWN0b3J5IiwiYm9va0NhcmRDb21wb25lbnQiLCJjcmVhdGVCb29rQ2FyZCIsImJvb2tPYmplY3QiLCJib29rQ2FyZCIsInNldEF0dHJpYnV0ZSIsInJldHVybkJvb2tDYXJkSFRNTCIsInRleHRDb250ZW50Iiwib25SYXRpbmdTdGFySW50ZXJhY3Rpb24iLCJjb2xvciIsInBhcmVudEVsZW1lbnQiLCJjaGlsZE5vZGVzIiwiY2hpbGQiLCJub2RlVHlwZSIsIk5vZGUiLCJFTEVNRU5UX05PREUiLCJnZXRBdHRyaWJ1dGUiLCJzaWJsaW5nIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwic3RhckZpbGwiLCJzdGFyU3Ryb2tlIiwibnVtYmVyT2ZTdGFycyIsInJhdGluZ1N0cmluZyIsImkiLCJvYmplY3RUaGF0c1JhdGVkIiwiZGVjb2xvckFsbFN0YXJzIiwibWF4Q29sb3JpemVkU3RhciIsIm5leHRTaWJsaW5nIiwiYm9va0NhcmRDb21wb25lbnRGYWN0b3J5IiwiYXBwRmFjdG9yeSIsIkFwcCIsIiQiLCJyYXRpbmdTdGFycyIsImJvb2tMaXN0Iiwid3JhcHBlciIsImluaXRBcHAiLCJmdWxsUmVuZGVyVmlldyIsInJlcGxhY2VDaGlsZHJlbiIsImFkZEJvb2tNb2RhbENvbXBvbmVudCIsImluaXRHbG9iYWxFdmVudHMiLCJpbml0Qm9va1N0b3JhZ2VFdmVudHMiLCJpbml0Qm9va0NhcmRFdmVudHMiLCJjcmVhdGVCb29rTW9kYWxWaWV3IiwiYWRkQm9va0NhcmRFdmVudCIsImJvb2tJZCIsImJvb2tVdWlkIiwiZXZlbnROYW1lIiwic2VsZWN0b3IiLCJoYW5kbGVyIiwibWF0Y2hlcyIsImNsb3Nlc3QiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiY3JlYXRlRW51bVBPSk8iLCJlbnVtVmFsdWVzIiwiZW51bVBPSk8iLCJlbnVtVmFsdWUiLCJrZXkiLCJjYW1lbENhc2UiLCJPYmplY3QiLCJmcmVlemUiLCJzdHJpbmciLCJzcGxpdCIsIndvcmQiLCJpbmRleCIsIndvcmRMb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJqb2luIiwiaHRtbCIsImFwcENvbnRyb2xsZXIiXSwic291cmNlUm9vdCI6IiJ9