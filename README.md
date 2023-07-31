# What I learned

- tricks for creating MVCish app with Vanilla JS
- generic Event Delegation by adding general Event listeners to parent element and then delegate handling to children to come
- SVG pointer-events behaviour for visible and non visible paths. Gotya: pointer-event is "auto" per default which means that
  things like stroke, fill need to be non-"none" in order to be clickable, Also a gotya: when selector for "click" event is svg,
  but svg contains a path that is fill non-"none", the click event wont be triggered, because the path is "shadowing" the svg con-
  tainer.

## Resources

- Vanilla MVC tricks: https://frontendmasters.com/blog/vanilla-javascript-todomvc/
- SVG pointer-events-behaviour: https://www.smashingmagazine.com/2018/05/svg-interaction-pointer-events-property/
- Event debouncing for search function, when interacting with Database
