import { subscribeToProduct } from "./products-data.js";

// ===== Elements =====
const productContainer = document.getElementById("productContainer");
const cartCountEl = document.getElementById("cartcount");

// ===== Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Update Cart Count =====
function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = cart.length;
}

// ===== Add to Cart =====
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart!");
}

// ===== State for Cleanup =====
let unsubscribeProduct = null;

function initProductPage() {
    updateCartCount();

    // Get ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        if (productContainer) productContainer.innerHTML = "<p>No product ID specified.</p>";
        return;
    }

    // Cleanup previous listener if strict mode/re-run happens
    if (unsubscribeProduct) unsubscribeProduct();

    // Subscribe to Realtime Updates
    unsubscribeProduct = subscribeToProduct(productId, (product) => {
        if (!product) {
            if (productContainer) productContainer.innerHTML = "<p>Product not found (it may have been deleted).</p>";
            return;
        }

        // Render
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="product-img">
                     <img src="${product.image || 'images/mouse.jpeg'}" alt="${product.name}" style="max-width:100%; border-radius:8px;" onerror="this.src='images/mouse.jpeg'" />
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="category">${product.category}</p>
                    <p class="price">$${product.price}</p>
                    <p class="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. High quality ${product.category}.</p>
                    <button id="addToCartBtn" class="add-btn">Add to Cart</button>
                </div>
            `;

            // Re-select button after innerHTML write
            const btn = document.getElementById("addToCartBtn");
            if (btn) {
                btn.addEventListener("click", () => addToCart(product));
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", initProductPage);
