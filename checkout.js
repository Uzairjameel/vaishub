import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Elements =====
const totalEl = document.getElementById("total");
const shippingForm = document.getElementById("shippingForm");

// ===== Render Total =====
function renderTotal() {
    let total = 0;
    cart.forEach(item => total += item.price);
    totalEl.textContent = `$${total}`;
}

renderTotal();

// ===== Place Order =====
shippingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const order = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        items: cart,
        total: cart.reduce((sum, i) => sum + i.price, 0),
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, "orders"), order);
        alert("Order placed successfully!");

        localStorage.removeItem("cart");
        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
        alert("Error placing order");
    }
});
