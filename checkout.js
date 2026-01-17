import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("Checkout script loaded");

// ===== Cart =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log("Cart loaded:", cart);

// ===== Elements =====
const totalEl = document.getElementById("checkoutTotal");
const shippingForm = document.getElementById("shippingForm");

// ===== Render Total =====
function renderTotal() {
    if (!totalEl) return;

    const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    totalEl.textContent = `$${total}`;
}

renderTotal();

// ===== Place Order =====
if (shippingForm) {
    console.log("Shipping form found, attaching listener");

    shippingForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Form submitted");

        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        // Get values
        const nameVal = document.getElementById("name").value;
        const phoneVal = document.getElementById("phone").value;
        const addressVal = document.getElementById("address").value;
        const cityVal = document.getElementById("city").value;
        const zipVal = document.getElementById("zip").value;
        const countryVal = document.getElementById("country").value;

        // Construct Order Object (matching User Request fields)
        const order = {
            customerName: nameVal, // User requested 'customerName'
            phone: phoneVal,
            address: addressVal,
            city: cityVal,
            zip: zipVal,
            country: countryVal,
            products: cart,        // User requested 'products'
            total: cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0),
            createdAt: new Date()  // Timestamp
        };

        console.log("Placing order:", order);

        try {
            const docRef = await addDoc(collection(db, "orders"), order);
            console.log("Order saved with ID:", docRef.id);
            alert("Order placed successfully! ID: " + docRef.id);

            localStorage.removeItem("cart");
            window.location.href = "index.html";
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Error placing order: " + err.message);
        }
    });
} else {
    console.error("Shipping form NOT found in DOM");
}
