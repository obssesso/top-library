import "./addBookModal.css";

export default function addBookModalComponentFactory() {
  let formWrapper;

  function createBookModalDOMNode() {
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
    formWrapper
      .querySelector('[data-addBook="close"]')
      .addEventListener("click", removeAddBookModal);
    formWrapper.classList.add("wrapper-entrance-animation");
    return formWrapper;
  }

  function returnBookModalHTML() {
    return `
            <form class="pos-rel" action="">
                <button data-addBook="close" class="close-modal pos-abs clr-white">X</button>
                <h2 class="clr-white mrgn-bottom-700">Add a new book to your list</h2>
                <label>
                    <p>Book Title</p>
                    <input type="text">
                </label>
                <label>
                    <p>Author</p>
                    <input type="text">
                </label>
                <label>
                    <p>Status</p>
                    <input type="text">
                </label>
                <label>
                    <p>Rating</p>
                    <input type="text">
                </label>
                <p style="justify-self: end; padding-top: 1rem;"><button>Add to list</button></p>
            </form>
`;
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

  return { createBookModalDOMNode };
}
