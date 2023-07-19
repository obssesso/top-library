import bookModelFactory from "./bookModel.js";

export default function appFactory() {
  let currentRating;
  let bookModel;
  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
      bookList: document.querySelector(".books"),
    },
  };

  async function initApp() {
    try {
      bookModel = await bookModelFactory();
      fullRenderView();
      bookModel.addEventListener("update", fullRenderView);
      initEventListeners();
    } catch (error) {}
  }

  function fullRenderView() {
    App.$.bookList.replaceChildren(
      ...bookModel.getBooks().map((bookObject) => createBookCard(bookObject))
    );
  }

  function createBookCard(bookObject) {
    const bookCard = document.createElement("li");
    bookCard.classList.add(
      "book",
      "flex",
      "ai-start",
      "pb-bottom-700",
      "mrgn-bottom-700"
    );
    bookCard.insertAdjacentHTML("afterbegin", returnBookCardHTML());
    bookCard.querySelector('[data-book="title"]').textContent =
      bookObject.title;
    bookCard.querySelector('[data-book="author"]').textContent =
      bookObject.author;
    bookCard.querySelector('[data-book="status"]').textContent =
      bookObject.status;
    return bookCard;
  }

  function returnBookCardHTML() {
    return `<img data-book="image" src="" alt="">
                    <div class="width-100">
                        <div class="flex ai-center jc-sb">
                            <span data-book="title" class="fs-book-title"></span>
                            <svg class="edit-button" xmlns="http://www.w3.org/2000/svg" height="22"
                                viewBox="0 -960 960 960" width="22">
                                <path
                                    d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z" />
                            </svg>
                        </div>
                        <div data-book="author" class="fs-book-author mrgn-bottom-500"></div>
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
                                <svg data-star-number=5 width="17px" height="17px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                                        stroke="#464455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg data-star-number=4 width="17px" height="17px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                                        stroke="#464455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg data-star-number=3 width="17px" height="17px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                                        stroke="#464455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg data-star-number=2 width="17px" height="17px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                                        stroke="#464455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg data-star-number=1 width="17px" height="17px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.65 8.93274L12.4852 4.30901C12.2923 3.89699 11.7077 3.897 11.5148 4.30902L9.35002 8.93274L4.45559 9.68243C4.02435 9.74848 3.84827 10.2758 4.15292 10.5888L7.71225 14.2461L6.87774 19.3749C6.80571 19.8176 7.27445 20.1487 7.66601 19.9317L12 17.5299L16.334 19.9317C16.7256 20.1487 17.1943 19.8176 17.1223 19.3749L16.2878 14.2461L19.8471 10.5888C20.1517 10.2758 19.9756 9.74848 19.5444 9.68243L14.65 8.93274Z"
                                        stroke="#464455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
`;
  }

  function initEventListeners() {
    initRatingStarEvents();
  }

  function initRatingStarEvents() {
    document.querySelectorAll("[data-star-number]").forEach((ratingStar) => {
      ratingStar.addEventListener(
        "click",
        onRatingStarInteraction.bind(ratingStar, "blue")
      );
      ratingStar.addEventListener(
        "dblclick",
        onRatingStarInteraction.bind(ratingStar, "none")
      );
      /*       ratingStar.addEventListener("mouseover", (event) =>
        onRatingStarInteraction(event, "yellow")
      ); */
    });
  }

  function onRatingStarInteraction(color) {
    this.parentElement.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE)
        child.setAttribute("fill", "none");
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

  initApp();
  return {};
}
