import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("Checkout module loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // ===== Cart =====
    let cart = [];
    try {
        const storedCart = localStorage.getItem("cart");
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        cart = [];
    }
    console.log("Cart contents:", cart);

    // ===== Elements =====
    const totalEl = document.getElementById("checkoutTotal");
    const shippingForm = document.getElementById("shippingForm");

    // ===== Render Total =====
    function renderTotal() {
        if (!totalEl) {
            console.warn("Total element 'checkoutTotal' not found");
            return;
        }

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.qty) || 1;
            return sum + (price * qty);
        }, 0);

        console.log("Calculated Total:", total);
        totalEl.textContent = `${total.toFixed(2)}`;
    }

    renderTotal();

    // ===== Place Order =====
    if (shippingForm) {
        console.log("Shipping form found");

        shippingForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log("Submit triggered");

            if (cart.length === 0) {
                alert("Your cart is empty. Please add items.");
                return;
            }

            // Get values safely
            const val = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const order = {
                customerName: val("name"),
                phone: val("phone"),
                address: val("address"),
                city: val("city"),
                zip: val("zip"),
                country: val("country"),
                products: cart,
                total: parseFloat(totalEl.textContent) || 0,
                createdAt: new Date()
            };

            console.log("Attempting to save order:", order);

            try {
                // Submit to Firestore
                const docRef = await addDoc(collection(db, "orders"), order);
                console.log("Order successfully saved. ID:", docRef.id);

                alert("Order placed successfully!");

                // Clear cart and redirect
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            } catch (err) {
                console.error("Firebase Error:", err);
                alert("Failed to place order. Check console for details.\nError: " + err.message);
            }
        });
    } else {
        console.error("CRITICAL: Shipping form 'shippingForm' not found in DOM.");
    }
});
