import { getAllProducts } from "./products-data.js";

// ===== Product Data =====
// ===== Load products from centralized module =====
let products = getAllProducts();

// Note: We no longer need the fallback logic here as it is handled in getAllProducts()



// ===== Elements =====
const productGrid = document.getElementById("productGrid");
const cartCountEl = document.getElementById("cartcount");
const searchInput = document.getElementById("searchinput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

// ===== Cart from LocalStorage =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Update Cart Count =====
function updateCartCount() {
    cartCountEl.textContent = cart.length;
}

// ===== Add to Cart =====
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart!");
}

// ===== Render Products =====
function renderProducts(productList) {
    productGrid.innerHTML = "";

    productList.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        // Entire card clickable except Add to Cart button
        productCard.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-link">
        <div class="product-img">
            <img src="${product.image}" alt="${product.name}" />
        </div>
        <h3>${product.name}</h3>
    </a>
    <p class="price">$${product.price}</p>
`;


        // Add to Cart button
        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.onclick = (e) => {
            e.preventDefault(); // Prevent navigating when clicking button
            addToCart(product);
        };

        productCard.appendChild(button);
        productGrid.appendChild(productCard);
    });
}

// ===== Filter & Search Logic =====
function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;

    let filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            product => product.category === selectedCategory
        );
    }

    if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        filteredProducts = filteredProducts.filter(
            product => product.price >= min && product.price <= max
        );
    }

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p class="no-products">No products found.</p>`;
    } else {
        renderProducts(filteredProducts);
    }
}

window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
        header.style.padding = "5px 20px";
        header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    } else {
        header.style.padding = "10px 20px";
        header.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    }
});


// ===== Event Listeners =====
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

// ===== Initial Load =====
renderProducts(products);
updateCartCount();
