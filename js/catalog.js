const products = [
  {
    id: 1,
    category: "coffee",
    name: "Irish coffee",
    desc: "Fragrant black coffee with Jameson Irish whiskey and whipped milk",
    price: 7.00,
    img: "images/Resources/coffee-1.jpg"
  },
  {
    id: 2,
    category: "coffee",
    name: "Kahlua coffee",
    desc: "Classic coffee with milk and Kahlua liqueur under a cap of frothed milk",
    price: 7.00,
    img: "images/Resources/coffee-2.jpg"
  },
  {
    id: 3,
    category: "coffee",
    name: "Honey raf",
    desc: "Espresso with frothed milk, cream and aromatic honey",
    price: 5.50,
    img: "images/Resources/coffee-3.jpg"
  },
  {
    id: 4,
    category: "coffee",
    name: "Ice cappuccino",
    desc: "Cappuccino with soft thick foam in summer version with ice",
    price: 5.00,
    img: "images/Resources/coffee-4.jpg"
  },
  {
    id: 5,
    category: "coffee",
    name: "Espresso",
    desc: "Classic black coffee",
    price: 4.50,
    img: "images/Resources/coffee-5.jpg"
  },
  {
    id: 6,
    category: "coffee",
    name: "Latte",
    desc: "Espresso coffee with the addition of steamed milk and dense milk foam",
    price: 5.50,
    img: "images/Resources/coffee-6.jpg"
  },
  {
    id: 7,
    category: "coffee",
    name: "Latte macchiato",
    desc: "Espresso with frothed milk and chocolate",
    price: 5.50,
    img: "images/Resources/coffee-7.jpg"
  },
  {
    id: 8,
    category: "coffee",
    name: "Coffee with cognac",
    desc: "Fragrant black coffee with cognac and whipped cream",
    price: 6.50,
    img: "images/Resources/coffee-8.jpg"
  }
];

const grid = document.querySelector(".menu-grid");

function createCard(product) {
  return `
    <article class="product-card">
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

renderProducts(products);