import { openDB, deleteDB, wrap, unwrap } from "idb";
import enumFactory from "./helpers.js";

export default async function bookModelFactory() {
  let db;
  let books;
  const bookStatus = enumFactory(["Read", "Want to Read", "Currently Reading"]);

/*   let bookModel = Object.create(EventTarget.prototype); */

  const bookModel = new EventTarget();

  bookModel.add = add;
  bookModel.getBooks = getBooks;
  await initModel();

  return bookModel;

  async function initModel() {
    books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "Scott F. Fitzgerald",
        rating: 5,
        status: bookStatus.currentlyReading,
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        rating: 5,
        status: bookStatus.read,
      },
      {
        id: 3,
        title: "Jane Eyre",
        author: "George Orwell",
        rating: 4,
        status: bookStatus.wantToRead,
      },
    ];
    db = await getDatabase();
    const transaction = db.transaction(["books"], "readonly");
    const store = transaction.objectStore("books");
    /*     books = await store.getAll(); */
  }

  function getDatabase() {
    return openDB("bookStorage", 1, { upgrade });
  }

  function upgrade(db) {
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { keyPath: "id", autoIncrement: true });
    }
  }

  function add(book) {
    books.push(book);
    update();
  }

  async function update() {
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    const bookPromises = books.map((book) => store.put(book));

    try {
      await Promise.all(bookPromises);
      bookModel.dispatchEvent(new CustomEvent("update"));
    } catch (error) {
      bookModel.dispatchEvent(new CustomEvent("updateFailed"));
    }
  }

  function getBooks() {
    return books;
  }
}
