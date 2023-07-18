import bookModel from "./bookModel.js";

export default function appFactory() {
  let currentRating;

  const App = {
    $: {
      ratingStars: document.querySelectorAll("[data-star-number]"),
    },
  };
  function initApp() {
    const model = new bookModel();
    model.openDB();
    initEventListeners();
  }
  function initEventListeners() {
    initRatingStarEvents();
  }

  function initRatingStarEvents() {
    App.$.ratingStars.forEach((ratingStar) => {
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
  return { initApp };
}
