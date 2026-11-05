/* ==========================================================================
   main.js — theme toggle and mobile menu. Nothing else needs JavaScript.
   The page is fully readable and navigable without this file: it only
   reveals two buttons that are hidden in the HTML, and wires them up.
   A one-line inline script in <head> runs earlier: it adds the "js" class and
   applies the saved theme before first paint, so there is no flash of the
   wrong theme and no layout shift when the mobile nav collapses.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  root.classList.add("js");

  const THEME_KEY = "theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* ---- Theme toggle ------------------------------------------------------ */
  const themeButton = document.querySelector("[data-theme-toggle]");

  const isDark = () => {
    const chosen = root.dataset.theme;
    return chosen ? chosen === "dark" : prefersDark.matches;
  };

  const syncThemeButton = () => {
    if (themeButton) themeButton.setAttribute("aria-pressed", String(isDark()));
  };

  if (themeButton) {
    themeButton.hidden = false;
    syncThemeButton();

    themeButton.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* Storage blocked (private mode etc.): the choice lasts for this page view. */
      }
      syncThemeButton();
    });

    // If the visitor never chose, keep the button state in step with the system.
    prefersDark.addEventListener("change", syncThemeButton);
  }

  /* ---- Mobile menu ------------------------------------------------------- */
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("site-nav");

  if (menuButton && nav) {
    const desktop = window.matchMedia("(min-width: 40rem)");

    const setOpen = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    menuButton.hidden = false;
    setOpen(false);

    menuButton.addEventListener("click", () => {
      setOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    // Following an in-page link should reveal the section, not leave the menu covering it.
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        menuButton.focus();
      }
    });

    // Leaving the small layout resets the menu state.
    desktop.addEventListener("change", () => setOpen(false));
  }
})();
