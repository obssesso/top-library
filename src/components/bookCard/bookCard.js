import "./bookCard.css";
import ratingStarsComponentFactory from "../ratingStars/ratingStars.js";

export default function bookCardFactory() {
  const bookCardComponent = new EventTarget();
  bookCardComponent.createBookCard = createBookCard;

  const ratingStarsComponent = ratingStarsComponentFactory();

  return bookCardComponent;

  function createBookCard(bookObject) {
    const bookCard = document.createElement("li");
    bookCard.classList.add(
      "book",
      "flex",
      "ai-start",
      "pb-bottom-700",
      "mrgn-bottom-700"
    );
    bookCard.setAttribute("data-book-id", bookObject.id);
    bookCard.insertAdjacentHTML("afterbegin", returnBookCardHTML());
    bookCard.querySelector('[data-book="title"]').textContent =
      bookObject.title;
    bookCard.querySelector('[data-book="author"]').textContent =
      bookObject.author;
    bookCard.querySelector('[data-book="status"]').textContent =
      bookObject.status;

    colorizeRatingStars();
    function colorizeRatingStars() {
      if (bookObject.rating == "") return;
      const maxColorizedStar = bookCard.querySelector(
        `[data-star-number="${bookObject.rating}"]`
      );
      maxColorizedStar.setAttribute("fill", "blue");
      let nextSibling = maxColorizedStar.nextElementSibling;
      while (nextSibling) {
        nextSibling.setAttribute("fill", "blue");
        nextSibling = nextSibling.nextElementSibling;
      }
    }

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
                            ${ratingStarsComponent.returnRatingStarsHTML(5)}
                            </div>
                        </div>
                    </div>
`;
  }
}