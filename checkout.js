// ===== Elements =====
const checkoutItemsEl = document.getElementById("checkoutItems");
const checkoutTotalEl = document.getElementById("checkoutTotal");
const cartCountEl = document.getElementById("cartcount");
const shippingForm = document.getElementById("shippingForm");

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

// ===== Render Checkout =====
// ===== Render Checkout =====
function renderCheckout() {
    const items = getCartWithQuantity();
    checkoutItemsEl.innerHTML = "";
    let total = 0;

    if (items.length === 0) {
        checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
        checkoutTotalEl.textContent = "0";
        updateCartCount();
        return;
    }

    items.forEach(item => {
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "checkout-item";

        div.innerHTML = `
            <div class="checkout-item-info">
                <h4>${item.name}</h4>
                <p class="price">$${item.price} × ${item.qty}</p>
            </div>
            <div class="checkout-item-actions">
                <button class="decrease" data-id="${item.id}">-</button>
                <button class="increase" data-id="${item.id}">+</button>
                <button class="remove" data-id="${item.id}">Remove</button>
            </div>
        `;

        checkoutItemsEl.appendChild(div);
    });

    checkoutTotalEl.textContent = total;
    updateCartCount();

    // ===== Event Listeners for buttons =====
    document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            cart.push(products.find(p => p.id === id));
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCheckout();
        });
    });

    document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const index = cart.findIndex(p => p.id === id);
            if (index !== -1) cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCheckout();
        });
    });

    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(p => p.id !== id);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCheckout();
        });
    });
}


// ===== Form Submission =====
// ===== Form Submission =====
shippingForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const order = {
    name: document.getElementById("name").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    zip: document.getElementById("zip").value.trim(),
    country: document.getElementById("country").value.trim(),
    phone: document.getElementById("phone").value.trim(), // new field
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    date: new Date().toLocaleString()
};


    // Store order in localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Thank you ${order.name}! Your order has been placed successfully.`);

    // Clear cart
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
    shippingForm.reset();
});

// ===== Initial Render =====
renderCheckout();
