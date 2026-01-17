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
        renderAdminProducts(); // Now async, but fire-and-forget is ok for initial load
    } else {
        loginSection.style.display = "block";
        dashboardSection.style.display = "none";
    }
}

if (loginForm) {
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
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logout();
    });
}

// ===== Render products =====
async function renderAdminProducts() {
    if (!adminProductList) return;
    adminProductList.innerHTML = "<p>Loading products...</p>";

    try {
        const products = await getAllProducts();
        adminProductList.innerHTML = "";

        products.forEach((product) => {
            const div = document.createElement("div");
            div.className = "admin-product-card";
            div.innerHTML = `
                <div>
                    <strong>${product.name}</strong><br>
                    <small>$${product.price} | ${product.category}</small>
                </div>
                <button class="delete-btn" data-id="${product.id}" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">Delete</button>
            `;
            adminProductList.appendChild(div);
        });

        // Attach listeners
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (confirm("Are you sure you want to delete this product?")) {
                    const id = btn.dataset.id;
                    await deleteProduct(id);
                    await renderAdminProducts(); // Refresh list
                }
            });
        });

    } catch (e) {
        console.error(e);
        adminProductList.innerHTML = "<p>Error loading products.</p>";
    }
}

// ===== Add product =====
if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value);
        const category = document.getElementById("productCategory").value.trim();
        const image = document.getElementById("productImage").value.trim();

        // Basic validation
        if (!name || !price || !category) {
            alert("Please fill in required fields");
            return;
        }

        const submitBtn = addProductForm.querySelector("button[type='submit']");
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Saving...";
            }

            await addProduct({ name, price, category, image });

            alert("Product added!");
            addProductForm.reset();
            await renderAdminProducts();

        } catch (e) {
            alert("Error adding product: " + e.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Add Product";
            }
        }
    });
}

// ===== Initial Check =====
document.addEventListener("DOMContentLoaded", checkAuth);
