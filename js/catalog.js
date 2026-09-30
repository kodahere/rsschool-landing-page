const grid = document.querySelector(".menu-grid");
const tabs = document.querySelectorAll(".tab");
const refreshBtn = document.querySelector(".refresh-btn");

let allProducts = [];
let currentCategory = "coffee";

const isMobileQuery = window.matchMedia("(max-width: 1024px)");
const STEP = 4;
let visibleCount = isMobileQuery.matches ? 4 : Infinity;

async function loadProducts() {
  try {
    const response = await fetch("js/products.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    const counters = {};

    allProducts = data.map((item) => {
      counters[item.category] = (counters[item.category] || 0) + 1;

      return {
        id: counters[item.category],
        category: item.category,
        name: item.name,
        desc: item.description,
        price: Number(item.price),
        img: `images/Resources/${item.category}-${counters[item.category]}.jpg`,
        sizes: item.sizes,
        additives: item.additives
      };
    });

    renderProducts(getByCategory(currentCategory));
  } catch (err) {
    console.error("Ошибка загрузки меню:", err);
    grid.innerHTML = `<p class="error">Не удалось загрузить меню</p>`;
  }
}

function getByCategory(category) {
  return allProducts.filter((p) => p.category === category);
}

function createCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-body">
        <img class="product-image" src="${product.img}" alt="${product.name}">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(list) {
  const visible = list.slice(0, visibleCount);
  grid.innerHTML = visible.map(createCard).join("");

  attachCardHandlers();

  const isNarrow = isMobileQuery.matches;
  const hasMore = isNarrow && list.length > visibleCount;
  refreshBtn.parentElement.style.display = hasMore ? "flex" : "none";

  const cards = grid.querySelectorAll(".product-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.06}s`;
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("active")) return;

    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    currentCategory = tab.id.replace("tab-", "");
    visibleCount = isMobileQuery.matches ? 4 : Infinity;
    renderProducts(getByCategory(currentCategory));
  });
});

refreshBtn?.addEventListener("click", () => {
  visibleCount += STEP;
  renderProducts(getByCategory(currentCategory));
});

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalSizes = document.getElementById("modal-sizes");
const modalAdditives = document.getElementById("modal-additives");
const modalPrice = document.getElementById("modal-price");

let currentProduct = null;
let selectedSize = "s";
let selectedAdditives = [];

function attachCardHandlers() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.id);
      const product = getByCategory(currentCategory).find((p) => p.id === id);
      if (product) openModal(product);
    });
  });
}

function openModal(product) {
  currentProduct = product;
  selectedSize = "s";
  selectedAdditives = [];

  modalImage.src = product.img;
  modalImage.alt = product.name;
  modalName.textContent = product.name;
  modalDesc.textContent = product.desc;

  renderSizeOptions();
  renderAdditiveOptions();
  updateModalPrice();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

function renderSizeOptions() {
  modalSizes.innerHTML = Object.entries(currentProduct.sizes)
    .map(
      ([key, value]) => `
        <button
          class="modal-option${key === selectedSize ? " active" : ""}"
          data-size="${key}"
        >
          <span class="option-badge">${key.toUpperCase()}</span>
          ${value.size}
        </button>
      `
    )
    .join("");

  modalSizes.querySelectorAll(".modal-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      renderSizeOptions();
      updateModalPrice();
    });
  });
}

function renderAdditiveOptions() {
  modalAdditives.innerHTML = currentProduct.additives
    .map((add, index) => {
      const active = selectedAdditives.includes(add.name) ? " active" : "";
      return `
        <button class="modal-option${active}" data-additive="${add.name}">
          <span class="option-badge">${index + 1}</span>
          ${add.name}
        </button>
      `;
    })
    .join("");

  modalAdditives.querySelectorAll(".modal-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.additive;
      if (selectedAdditives.includes(name)) {
        selectedAdditives = selectedAdditives.filter((n) => n !== name);
      } else {
        selectedAdditives.push(name);
      }
      renderAdditiveOptions();
      updateModalPrice();
    });
  });
}

function updateModalPrice() {
  let total = currentProduct.price;

  const sizeAdd = Number(currentProduct.sizes[selectedSize]["add-price"]);
  total += sizeAdd;

  currentProduct.additives.forEach((add) => {
    if (selectedAdditives.includes(add.name)) {
      total += Number(add["add-price"]);
    }
  });

  modalPrice.textContent = `$${total.toFixed(2)}`;
}

modal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

isMobileQuery.addEventListener("change", (e) => {
  visibleCount = e.matches ? 4 : Infinity;
  renderProducts(getByCategory(currentCategory));
});

loadProducts();