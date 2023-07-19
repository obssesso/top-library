import { openDB, deleteDB, wrap, unwrap } from "idb";

export default function bookModelFactory() {
  let db;
  let books;

  let bookModel = Object.create(EventTarget.prototype);

  async function initModel() {
    const db = await getDatabase();
    const transaction = db.transaction(["books"], "readonly");
    const store = transaction.objectStore("books");
    books = await store.getAll();
  }

  async function getDatabase() {
    return await openDB("bookStorage", 1, { upgrade });
  }

  function upgrade(db) {
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { keyPath: "id" });
    }
  }

  async function add(book) {
    books.push(book);
    update();
  }

  async function update() {
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    store.put(books);
    try {
      bookModel.dispatchEvent(new CustomEvent("update"));
    } catch (error) {}
  }

  bookModel.add = add;
  initModel();

  return { bookModel };
}
