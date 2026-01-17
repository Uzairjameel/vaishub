import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("Checkout module running...");

// ===== Initialize =====
async function initCheckout() {
    // 1. Load Cart
    let cart = [];
    try {
        const storedCart = localStorage.getItem("cart");
        cart = storedCart ? JSON.parse(storedCart) : [];
        console.log("Cart loaded with " + cart.length + " items.");
    } catch (e) {
        console.error("Cart error:", e);
    }

    // 2. Elements
    const totalEl = document.getElementById("checkoutTotal");
    const shippingForm = document.getElementById("shippingForm");

    if (!totalEl) console.error("Total Element not found!");
    if (!shippingForm) console.error("Shipping Form not found!");

    // 3. Render Total
    if (totalEl) {
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.qty) || 1;
            return sum + (price * qty);
        }, 0);
        totalEl.textContent = `${total.toFixed(2)}`;
    }

    // 4. Attach Listener
    if (shippingForm) {
        // Remove any existing listeners by cloning (optional hack, but safe here)
        // const newForm = shippingForm.cloneNode(true);
        // shippingForm.parentNode.replaceChild(newForm, shippingForm);
        // Actually, let's just add the listener.

        shippingForm.onsubmit = async (e) => {
            e.preventDefault();
            console.log("Submit detected!");

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            const submitBtn = shippingForm.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Processing...";
            }

            const val = (id) => document.getElementById(id)?.value.trim() || "";

            const order = {
                customerName: val("name"),
                phone: val("phone"),
                address: val("address"),
                city: val("city"),
                zip: val("zip"),
                country: val("country"),
                products: cart,
                total: parseFloat(totalEl?.textContent) || 0,
                createdAt: new Date()
            };

            try {
                const docRef = await addDoc(collection(db, "orders"), order);
                console.log("Success:", docRef.id);
                alert("Order placed successfully!");
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            } catch (err) {
                console.error("Firebase Error:", err);
                alert("Error: " + err.message);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Place Order";
                }
            }
        };
        console.log("Form listener attached.");
    } else {
        console.error("CRITICAL: Form not found. Retrying in 500ms...");
        setTimeout(initCheckout, 500); // Retry mechanism if DOM isn't ready for some reason
    }
}

// Run initialization
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCheckout);
} else {
    initCheckout();
}
