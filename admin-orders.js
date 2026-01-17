import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { requireAuth } from "./auth.js";

// ===== Auth Check =====
if (!requireAuth()) {
    window.location.href = "admin.html"; // Redirect to login if not authenticated
}

const ordersList = document.getElementById("ordersList");

if (ordersList) {
    const ordersCollection = collection(db, "orders");

    // Real-time listener with correct sorting (createdAt)
    onSnapshot(query(ordersCollection, orderBy("createdAt", "desc")), (snapshot) => {
        ordersList.innerHTML = "";

        if (snapshot.empty) {
            ordersList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const order = doc.data();
            // Convert Firestore Timestamp to Date if needed, or handle standard Date string
            const dateDisplay = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : new Date(order.createdAt).toLocaleString();

            const div = document.createElement("div");
            div.className = "order-card";

            div.innerHTML = `
                <h3>Order #${doc.id.slice(0, 8)}...</h3>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.zip}, ${order.country}</p>
                <p><strong>Total:</strong> $${order.total}</p>
                <p><strong>Date:</strong> ${dateDisplay}</p>
                <p><strong>Items:</strong></p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.price} (x${item.qty || 1})</li>`).join('')}
                </ul>
            `;

            ordersList.appendChild(div);
        });
    }, (error) => {
        console.error("Error fetching orders:", error);
        ordersList.innerHTML = `<p style="color:red">Error loading orders: ${error.message}</p>`;
    });
}
