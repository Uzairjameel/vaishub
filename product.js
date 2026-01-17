import { getProductById } from "./products-data.js";

// ===== Get Elements =====
const productContainer = document.getElementById("productContainer");
const cartCountEl = document.getElementById("cartcount");

// ===== Get Cart from LocalStorage =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Get product ID from URL =====
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id"); // Keep as string for loose comparison in getProductById

// ===== Find product =====
const product = getProductById(productId);

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

// ===== Render Product =====
function renderProduct() {
    if (!product) {
        productContainer.innerHTML = "<p>Product not found.</p>";
        return;
    }

    productContainer.innerHTML = `
        <div class="product-img">Image</div>
        <h2>${product.name}</h2>
        <p class="price">$${product.price}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.</p>
        <button id="addToCartBtn">Add to Cart</button>
    `;

    document.getElementById("addToCartBtn").addEventListener("click", () => addToCart(product));
}

// ===== Initial Render =====
renderProduct();
updateCartCount();
