import { openDB, deleteDB, wrap, unwrap } from "idb";
import enumFactory from "./helpers.js";
import { v4 as uuidv4 } from "uuid";

export default async function bookModelFactory() {
  let db;
  let books;
  const bookStatus = enumFactory(["Read", "Want to Read", "Currently Reading"]);

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
    return openDB("bookStorage", 1, { upgrade });
  }

  function upgrade(db) {
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { keyPath: "uuid" });
    }
  }

  function _add(addBookEvent) {
    const bookToAdd = addBookEvent.detail;
    bookToAdd.uuid = uuidv4();

    books.push(bookToAdd);
    try {
      update();
    } catch (error) {
      console.log("schaisinn");
    }
  }

  function _editBook(editBookEvent) {
    const bookToEdit = editBookEvent.detail;
    books = books.map((book) => {
      if ((book.uuid = bookToEdit.uuid)) return bookToEdit;
      return book;
    });
    try {
      update();
    } catch (error) {
      console.log("schaisinn");
    }
  }

  function _updateBookRating(bookUUID, newRating) {
    books = books.map((book) => {
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
    return books.find((book) => book.uuid == bookUUID).rating;
  }

  async function _deleteBook(bookUUID) {
    books = books.filter((book) => book.uuid != bookUUID);
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
    books = books.map((book) => {
      if (book.uuid == bookUUID) {
        book.status = newStatus;
      }
      return book;
    });
    update();
  }

  async function update() {
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    try {
      await books.forEach((book) => store.put(book));
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
