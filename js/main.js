const sliderMenu = document.getElementById("slider-menu");
const leftBtn = document.querySelector(".left-button");
const rightBtn = document.querySelector(".right-button");

let slides = [];
let currentSlide = 0;
let isAnimating = false;

async function loadSlides() {
  try {
    const response = await fetch("js/slider.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    slides = await response.json();
    preloadImages();
    renderSlide(currentSlide);
  } catch (err) {
    console.error("Ошибка загрузки слайдов:", err);
    sliderMenu.innerHTML = `<p class="error">Не удалось загрузить слайды</p>`;
  }
}

function preloadImages() {
  slides.forEach((slide) => {
    const img = new Image();
    img.src = slide.img;
  });
}

function renderSlide(index) {
  if (!sliderMenu) return;

  const slide = slides[index];
  if (!slide) return;

  sliderMenu.innerHTML = `
    <img src="${slide.img}" alt="${slide.name}">
    <div class="content-text">
      <p class="coffee-name">${slide.name}</p>
      <p class="coffee-desc">${slide.description}</p>
      <p class="coffee-price">$${Number(slide.price).toFixed(2)}</p>
    </div>
    <div class="slider-indicators">
      ${slides
        .map(
          (_, i) =>
            `<span class="indicator${i === index ? " active" : ""}" data-slide="${i}"></span>`
        )
        .join("")}
    </div>
  `;

  attachIndicatorHandlers();
}

function attachIndicatorHandlers() {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.slide);
      const direction = target > currentSlide ? "right" : "left";
      goToSlide(target, direction);
    });
  });
}

function goToSlide(index, direction = "right") {
  if (isAnimating) return;
  isAnimating = true;

  currentSlide = (index + slides.length) % slides.length;

  sliderMenu.classList.add(
    direction === "right" ? "fade-out-right" : "fade-out-left"
  );

  setTimeout(() => {
    renderSlide(currentSlide);
    sliderMenu.classList.remove("fade-out-right", "fade-out-left");

    sliderMenu.classList.remove("slide-in-right", "slide-in-left");
    void sliderMenu.offsetWidth;
    sliderMenu.classList.add(
      direction === "right" ? "slide-in-right" : "slide-in-left"
    );

    isAnimating = false;
  }, 250);
}

leftBtn?.addEventListener("click", () => goToSlide(currentSlide - 1, "left"));
rightBtn?.addEventListener("click", () => goToSlide(currentSlide + 1, "right"));

loadSlides();