// ===== Elements =====
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartcount");

// ===== Get Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Group items with quantity =====
function getCartWithQuantity() {
    const map = {};

    cart.forEach(item => {
        if (map[item.id]) {
            map[item.id].qty++;
        } else {
            map[item.id] = { ...item, qty: 1 };
        }
    });

    return Object.values(map);
}

// ===== Update Cart Count =====
function updateCartCount() {
    cartCountEl.textContent = cart.length;
}

// ===== Render Cart =====
function renderCart() {
    const items = getCartWithQuantity();
    cartItemsEl.innerHTML = "";
    let total = 0;

    if (items.length === 0) {
        cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalEl.textContent = "0";
        updateCartCount();
        return;
    }

    items.forEach(item => {
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p class="price">$${item.price}</p>
            </div>

            <div class="quantity">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>

            <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        `;

        cartItemsEl.appendChild(div);
    });

    cartTotalEl.textContent = total;
    updateCartCount();
}

// ===== Change Quantity =====
function changeQty(id, change) {
    if (change === -1) {
        const index = cart.findIndex(i => i.id === id);
        if (index !== -1) cart.splice(index, 1);
    } else {
        const item = cart.find(i => i.id === id);
        if (item) cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ===== Remove Item =====
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ===== Initial =====
renderCart();
