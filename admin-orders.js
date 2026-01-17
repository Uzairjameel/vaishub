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

    // Real-time listener: Order by createdAt Descending (Newest first)
    // Note: If you see "The query requires an index" in console, follow the link in the error to create one.
    // Fallback: If sorting fails initially due to missing field, try query without orderBy or handle error.
    const q = query(ordersCollection, orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        ordersList.innerHTML = "";

        if (snapshot.empty) {
            ordersList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const order = doc.data();

            // Safe Date Handling
            let dateDisplay = "N/A";
            if (order.createdAt) {
                if (order.createdAt.toDate) {
                    // Firestore Timestamp
                    dateDisplay = order.createdAt.toDate().toLocaleString();
                } else if (typeof order.createdAt === 'string') {
                    // ISO String
                    dateDisplay = new Date(order.createdAt).toLocaleString();
                }
            }

            // Handle 'products' (new) vs 'items' (old compatibility)
            const productsList = order.products || order.items || [];
            // Handle 'customerName' (new) vs 'name' (old)
            const customerName = order.customerName || order.name || "Unknown";

            const div = document.createElement("div");
            div.className = "order-card"; // ensuring style matches

            div.innerHTML = `
                <div style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px;">
                    <h3>Order #${doc.id.slice(0, 8)}...</h3>
                    <small>${dateDisplay}</small>
                </div>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.zip || ''}, ${order.country || ''}</p>
                <div style="background:#f9f9f9; padding:10px; margin:10px 0;">
                    <strong>Products:</strong>
                    <ul style="margin-top:5px; padding-left:20px;">
                        ${productsList.map(p => `<li>${p.name} (x${p.qty || 1}) - $${p.price * (p.qty || 1)}</li>`).join('')}
                    </ul>
                </div>
                <h4 style="text-align:right;">Total: $${order.total}</h4>
            `;

            ordersList.appendChild(div);
        });
    }, (error) => {
        console.error("Error fetching orders:", error);
        ordersList.innerHTML = `<p style="color:red; background:#ffe6e6; padding:10px;">
            <strong>Error:</strong> ${error.message}<br>
            <small>Check console. If "requires an index", click the link in the console.</small>
        </p>`;
    });
}
