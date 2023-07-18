import { openDB, deleteDB, wrap, unwrap } from "idb";

export default class bookModel extends EventTarget {
  constructor() {
    super();
  }

  upgrade(db) {
    db.createObjectStore("test", { keyPath: "id", autoIncrement: true });
  }

  async openDB() {
    return await openDB("testDB", 1, { upgrade: (db) => this.upgrade(db) });
  }
}
