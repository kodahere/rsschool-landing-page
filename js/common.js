(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  if (theme === "dark") document.documentElement.classList.add("theme-dark");
})();

const switchEl = document.querySelector(".theme-switch");
const sun = switchEl.querySelector(".sun");
const moon = switchEl.querySelector(".moon");
const root = document.documentElement;

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.classList.toggle("theme-dark", isDark);
  localStorage.setItem("theme", theme);
  sun.classList.toggle("active", !isDark);
  moon.classList.toggle("active", isDark);
}

applyTheme(root.classList.contains("theme-dark") ? "dark" : "light");

sun.addEventListener("click", (e) => {
  e.stopPropagation();
  applyTheme("light");
});

moon.addEventListener("click", (e) => {
  e.stopPropagation();
  applyTheme("dark");
});

const burgerToggle = document.getElementById("burger-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

let scrollPosition = 0;

function openMenu() {
  scrollPosition = window.scrollY;

  mobileMenu.classList.add("open");
  burgerToggle.classList.add("is-open");
  burgerToggle.setAttribute("aria-label", "Закрыть меню");
  mobileMenu.removeAttribute("aria-hidden");

  document.body.classList.add("menu-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
}

function closeMenu() {
  mobileMenu.classList.remove("open");
  burgerToggle.classList.remove("is-open");
  burgerToggle.setAttribute("aria-label", "Открыть меню");
  mobileMenu.setAttribute("aria-hidden", "true");

  document.body.classList.remove("menu-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollPosition);
}

function toggleMenu() {
  if (mobileMenu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

burgerToggle?.addEventListener("click", toggleMenu);

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
    closeMenu();
  }
});

mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMenu();
});