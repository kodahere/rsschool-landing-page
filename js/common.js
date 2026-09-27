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
