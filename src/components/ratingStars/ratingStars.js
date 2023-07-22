export default function ratingStarsComponentFactory(starFill, starStroke) {
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
    const maxColorizedStar = objectThatsRated.querySelector(
      `[data-star-number="${rating}"]`
    );

    maxColorizedStar.setAttribute("fill", `hsl(${starFill})`);
    maxColorizedStar.setAttribute("stroke", `hsl(${starStroke})`);
    let nextSibling = maxColorizedStar.nextElementSibling;
    while (nextSibling) {
      nextSibling.setAttribute("fill", `hsl(${starFill})`);
      nextSibling.setAttribute("stroke", `hsl(${starStroke})`);
      nextSibling = nextSibling.nextElementSibling;
    }

    function decolorAllStars() {
      objectThatsRated
        .querySelectorAll("[data-star-number]")
        .forEach((star) => star.setAttribute("fill", "none"));
    }
  }
  return { returnRatingStarsHTML, colorizeRatingStars };
}
