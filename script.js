import { subscribeToProducts } from "./products-data.js";

// ===== Global State =====
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Elements =====
const productGrid = document.getElementById("productGrid");
const cartCountEl = document.getElementById("cartcount");
const searchInput = document.getElementById("searchinput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

// ===== Update Cart Count =====
function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = cart.length;
}

// ===== Add to Cart =====
function addToCart(product) {
    // Basic duplicates check can be added here if needed
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart!");
}

// ===== Render Products =====
function renderProducts(productList) {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    productList.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        // Entire card clickable except Add to Cart button
        productCard.innerHTML = `
        <a href="product.html?id=${product.id}" class="product-link">
            <div class="product-img">
                <img src="${product.image || 'images/mouse.jpeg'}" alt="${product.name}" onerror="this.src='images/mouse.jpeg'"/>
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
    if (!products.length) return;

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

// ===== Scroll Effect =====
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (!header) return;
    if (window.scrollY > 50) {
        header.style.padding = "5px 20px";
        header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    } else {
        header.style.padding = "10px 20px";
        header.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    }
});

// ===== Event Listeners =====
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (priceFilter) priceFilter.addEventListener("change", applyFilters);

// ===== Initial Load with Real-time Sync =====
import { subscribeToProducts } from "./products-data.js";

// Make products global so filters can use it
// products variable is already declared at the top as 'let products = []'

function init() {
    updateCartCount();
    console.log("Subscribing to products...");

    // Subscribe to real-time updates
    subscribeToProducts((updatedProducts) => {
        console.log("Products updated:", updatedProducts);
        products = updatedProducts;

        // If we have filters active, apply them. Otherwise render all.
        const keyword = searchInput ? searchInput.value : "";
        const cat = categoryFilter ? categoryFilter.value : "";
        const price = priceFilter ? priceFilter.value : "";

        if (keyword || cat || price) {
            applyFilters();
        } else {
            renderProducts(products);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
