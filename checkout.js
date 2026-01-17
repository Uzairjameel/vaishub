// ===== Product Data =====
const products = [
    { id: 1, name: "Wireless Headphones", price: 25, category: "Electronics" },
    { id: 2, name: "Smart Watch", price: 40, category: "Electronics" },
    { id: 3, name: "Bluetooth Speaker", price: 30, category: "Audio" },
    { id: 4, name: "Gaming Mouse", price: 15, category: "Accessories" }
];

// ===== Elements =====
const cartCountEl = document.getElementById("cartcount");
const shippingForm = document.getElementById("shippingForm");

// ===== Cart from LocalStorage =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Firebase Firestore =====
import { db } from "./firebase-config.js"; // Firebase script exported db
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== Update Cart Count =====
function updateCartCount() {
    cartCountEl.textContent = cart.length;
}

// ===== Add to Cart =====
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// ===== Render Products =====


// ===== Initial Load =====

updateCartCount();

// ===== Search Functionality =====
const searchInput = document.getElementById("searchinput");
searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p class="no-products">No products found.</p>`;
    } else {
        renderProducts(filteredProducts);
    }
});

// ===== Checkout Form Submit =====
if (shippingForm) {
    shippingForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const order = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            city: document.getElementById("city").value.trim(),
            zip: document.getElementById("zip").value.trim(),
            country: document.getElementById("country").value.trim(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + item.price, 0),
            date: new Date().toLocaleString()
        };

        try {
            await addDoc(collection(db, "orders"), order);
            alert(`Thank you ${order.name}! Your order has been placed successfully.`);

            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            shippingForm.reset();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong. Try again!");
        }
    });
}
