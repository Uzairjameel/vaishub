import { getAllProducts, addProduct, deleteProduct } from "./products-data.js";
import { login, logout, isAuthenticated } from "./auth.js";

// ===== Elements =====
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const addProductForm = document.getElementById("addProductForm");
const adminProductList = document.getElementById("adminProductList");

// ===== Auth Logic =====
function checkAuth() {
    if (isAuthenticated()) {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        renderAdminProducts();
    } else {
        loginSection.style.display = "block";
        dashboardSection.style.display = "none";
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (login(email, password)) {
        checkAuth();
        loginForm.reset();
    } else {
        alert("Invalid credentials!");
    }
});

logoutBtn.addEventListener("click", () => {
    logout();
});

// ===== Render products =====
function renderAdminProducts() {
    const products = getAllProducts();
    adminProductList.innerHTML = "";
    products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "admin-product-card";
        div.innerHTML = `
            <strong>${product.name}</strong> | $${product.price} | ${product.category}
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;
        adminProductList.appendChild(div);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            deleteProduct(id);
            renderAdminProducts();
        });
    });
}

// ===== Add product =====
addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value.trim();
    const image = document.getElementById("productImage").value.trim();

    addProduct({ name, price, category, image });
    renderAdminProducts();
    addProductForm.reset();
});

// ===== Initial Check =====
checkAuth();
