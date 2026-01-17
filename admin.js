// ===== Elements =====
const addProductForm = document.getElementById("addProductForm");
const adminProductList = document.getElementById("adminProductList");

// ===== Load products from localStorage =====
let products = JSON.parse(localStorage.getItem("products")) || [];

// ===== Render products =====
function renderAdminProducts() {
    adminProductList.innerHTML = "";
    products.forEach((product, index) => {
        const div = document.createElement("div");
        div.className = "admin-product-card";
        div.innerHTML = `
            <strong>${product.name}</strong> | $${product.price} | ${product.category}
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        adminProductList.appendChild(div);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            products.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(products));
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

    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    products.push({ id, name, price, category, image });
    localStorage.setItem("products", JSON.stringify(products));
    renderAdminProducts();
    addProductForm.reset();
});

// ===== Initial render =====
renderAdminProducts();
