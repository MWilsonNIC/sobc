// Mobile menu, header scroll-state, gallery "Load more".
// Loaded with `defer`.

// --- Gallery: reveal the hidden batch of photo tiles on "Load more".
// One-shot for now — once clicked, the button is removed.
const loadMoreBtn = document.getElementById("gallery-load-more");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    document.querySelectorAll("#gallery-grid [data-more]").forEach((li) => {
      li.removeAttribute("hidden");
      li.removeAttribute("data-more");
    });
    loadMoreBtn.remove();
  });
}


// --- Homepage "Make a Difference": highlight the chosen donation amount.
// Clicking an amount only toggles its selected state (aria-pressed); it does
// NOT navigate. Only the "Donate Now" button opens the CrowdChange page.
const donateAmounts = document.getElementById("donate-amounts");
if (donateAmounts) {
  const pills = donateAmounts.querySelectorAll("button[data-amount]");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.setAttribute("aria-pressed", "false"));
      pill.setAttribute("aria-pressed", "true");
    });
  });
}

// --- Homepage "Our Sponsors" carousel: prev/next scroll the logo track
// by roughly one visible page. Buttons are disabled at the track ends and
// hidden via CSS at xl (where all seven logos fit at once).
const sponsorTrack = document.getElementById("sponsor-track");
if (sponsorTrack) {
  const prevBtn = document.getElementById("sponsor-prev");
  const nextBtn = document.getElementById("sponsor-next");

  const updateButtons = () => {
    const maxScroll = sponsorTrack.scrollWidth - sponsorTrack.clientWidth;
    if (prevBtn) prevBtn.disabled = sponsorTrack.scrollLeft <= 1;
    if (nextBtn) nextBtn.disabled = sponsorTrack.scrollLeft >= maxScroll - 1;
  };

  const scrollByPage = (direction) => {
    sponsorTrack.scrollBy({
      left: direction * sponsorTrack.clientWidth,
      behavior: "smooth",
    });
  };

  prevBtn?.addEventListener("click", () => scrollByPage(-1));
  nextBtn?.addEventListener("click", () => scrollByPage(1));
  sponsorTrack.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

// --- Header: add .is-scrolled past a small scroll threshold so the
// header can shrink and gain a divider once the user moves down the page.
// Uses two thresholds (hysteresis) so the class doesn't ping-pong when the
// user lingers near a single trigger point — that restart-the-transition
// loop reads as flashing.
const header = document.getElementById("site-header");
if (header) {
  const SCROLL_ON = 120;
  const SCROLL_OFF = 40;
  let isScrolled = false;
  const updateScrollState = () => {
    const shouldBeScrolled = isScrolled
      ? window.scrollY > SCROLL_OFF
      : window.scrollY > SCROLL_ON;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      header.classList.toggle("is-scrolled", isScrolled);
    }
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();
}

// --- Mobile menu: full-screen overlay with fade, body scroll lock,
// Escape-to-close, focus trap, and focus restoration.
const openButton = document.getElementById("mobile-menu-toggle");
const closeButton = document.getElementById("mobile-menu-close");
const menu = document.getElementById("mobile-menu");

if (openButton && closeButton && menu) {
  const openIcon = openButton.querySelector('[data-icon="open"]');
  const closeIcon = openButton.querySelector('[data-icon="close"]');
  const TRANSITION_MS = 200;

  const isOpen = () => !menu.hidden;

  const openMenu = () => {
    menu.hidden = false;
    // Force a reflow before removing opacity-0 so the transition runs.
    requestAnimationFrame(() => menu.classList.remove("opacity-0"));
    document.body.style.overflow = "hidden";
    openButton.setAttribute("aria-expanded", "true");
    openIcon?.classList.add("hidden");
    closeIcon?.classList.remove("hidden");
    // Send focus into the menu so keyboard users can navigate it immediately.
    closeButton.focus();
  };

  const closeMenu = () => {
    menu.classList.add("opacity-0");
    document.body.style.overflow = "";
    openButton.setAttribute("aria-expanded", "false");
    openIcon?.classList.remove("hidden");
    closeIcon?.classList.add("hidden");
    setTimeout(() => {
      menu.hidden = true;
    }, TRANSITION_MS);
    openButton.focus();
  };

  openButton.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  closeButton.addEventListener("click", closeMenu);

  // Escape closes the menu from anywhere on the page.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      closeMenu();
    }
  });

  // Focus trap — keep Tab cycling within the menu while it's open.
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = menu.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
