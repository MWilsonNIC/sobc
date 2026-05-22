// Mobile menu toggle. Loaded with `defer` so the DOM is ready when this runs.
const button = document.getElementById("mobile-menu-toggle");
const menu = document.getElementById("mobile-menu");

if (button && menu) {
  const openIcon = button.querySelector('[data-icon="open"]');
  const closeIcon = button.querySelector('[data-icon="close"]');

  button.addEventListener("click", () => {
    const willOpen = menu.classList.contains("hidden");
    menu.classList.toggle("hidden");
    if (openIcon) openIcon.classList.toggle("hidden");
    if (closeIcon) closeIcon.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(willOpen));
  });
}
