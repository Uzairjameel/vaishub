const ordersList = document.getElementById("ordersList");

// ===== Load Orders from localStorage =====
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ===== Render Orders =====
function renderOrders() {
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    orders.forEach((order, index) => {
        const div = document.createElement("div");
        div.className = "order-card";

        div.innerHTML = `
    <h3>Order #${index + 1}</h3>
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Phone:</strong> ${order.phone}</p> <!-- new -->
    <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.zip}, ${order.country}</p>
    <p><strong>Total:</strong> $${order.total}</p>
    <p><strong>Date:</strong> ${order.date}</p>
    <p><strong>Items:</strong></p>
    <ul>
        ${order.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
    </ul>
`;


        ordersList.appendChild(div);
    });
}

// ===== Initial Render =====
renderOrders();
