const grid = document.querySelector(".menu-grid");
const tabs = document.querySelectorAll(".tab");
const refreshBtn = document.querySelector(".refresh-btn");

let allProducts = [];
let currentCategory = "coffee";

// подгрузка моего Json файла
async function loadProducts() {
  try {
    const response = await fetch("js/products.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // счётчик элементов внутри каждой категории
    const counters = {};

    // нормализуем данные под удобный формат
    allProducts = data.map((item) => {
      counters[item.category] = (counters[item.category] || 0) + 1;

      return {
        id: counters[item.category],
        category: item.category,
        name: item.name,
        desc: item.description,
        price: Number(item.price),
        // картинки
        img: `images/Resources/${item.category}-${counters[item.category]}.jpg`,
        // сохраним размеры и добавки пригодятся для модалки
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

// Отфильтруем по категории
function getByCategory(category) {
  return allProducts.filter((p) => p.category === category);
}

// рендер карточки
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
  grid.innerHTML = list.map(createCard).join("");
}

// подключаем табы
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // id таба: tab-coffee / tab-tea / tab-dessert
    currentCategory = tab.id.replace("tab-", "");
    renderProducts(getByCategory(currentCategory));
  });
});

// Кнопка refresh
refreshBtn?.addEventListener("click", () => {
  renderProducts(getByCategory(currentCategory));
});


loadProducts();