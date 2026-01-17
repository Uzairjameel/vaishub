import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Elements =====
const totalEl = document.getElementById("checkoutTotal"); // Fixed ID
const shippingForm = document.getElementById("shippingForm");

// ===== Render Total =====
function renderTotal() {
    if (!totalEl) return;

    // Calculate total including quantities if they exist, otherwise assume 1
    const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    totalEl.textContent = `$${total}`;
}

renderTotal();

// ===== Place Order =====
if (shippingForm) {
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
            zip: document.getElementById("zip").value,
            country: document.getElementById("country").value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0),
            createdAt: new Date() // Used for sorting
        };

        try {
            const docRef = await addDoc(collection(db, "orders"), order);
            console.log("Document written with ID: ", docRef.id);
            alert("Order placed successfully!");

            localStorage.removeItem("cart");
            window.location.href = "index.html";
        } catch (err) {
            console.error("Error adding document: ", err);
            alert("Error placing order: " + err.message);
        }
    });
}
