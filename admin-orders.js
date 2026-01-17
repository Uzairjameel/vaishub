import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { requireAuth } from "./auth.js";

// ===== Auth Check (Immediate) =====
if (!requireAuth()) {
    window.location.href = "admin.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const ordersList = document.getElementById("ordersList");

    if (ordersList) {
        console.log("Initializing Admin Orders view...");
        const ordersCollection = collection(db, "orders");

        // Real-time listener: Order by createdAt Descending
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
                try {
                    if (order.createdAt && order.createdAt.toDate) {
                        dateDisplay = order.createdAt.toDate().toLocaleString();
                    } else if (order.createdAt) {
                        dateDisplay = new Date(order.createdAt).toLocaleString();
                    }
                } catch (e) {
                    dateDisplay = "Invalid Date";
                }

                // Handle legacy/new field names
                const productsList = order.products || order.items || [];
                const customerName = order.customerName || order.name || "Unknown";
                const totalDisplay = order.total ? parseFloat(order.total).toFixed(2) : "0.00";

                const div = document.createElement("div");
                div.className = "order-card";

                div.innerHTML = `
                    <div style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between;">
                        <span><strong>#${doc.id.slice(0, 6)}</strong></span>
                        <small style="color:#666;">${dateDisplay}</small>
                    </div>
                    
                    <div style="margin-bottom:10px;">
                        <div style="font-size:1.1em; font-weight:bold; color:#333;">${customerName}</div>
                        <div>${order.phone || ''}</div>
                        <div style="color:#555; font-size:0.9em;">
                            ${order.address || ''}<br>
                            ${order.city || ''} ${order.zip ? ', ' + order.zip : ''} ${order.country ? ', ' + order.country : ''}
                        </div>
                    </div>

                    <div style="background:#f5f5f5; padding:10px; border-radius:4px;">
                        <strong>Items:</strong>
                        <ul style="margin:5px 0 0 20px; padding:0;">
                            ${productsList.map(p => `
                                <li>
                                    ${p.name} 
                                    <span style="color:#666;">x${p.qty || 1}</span> 
                                    - $${((parseFloat(p.price) || 0) * (parseInt(p.qty) || 1)).toFixed(2)}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <h4 style="text-align:right; margin-top:10px; color:#131921;">
                        Total: $${totalDisplay}
                    </h4>
                `;

                ordersList.appendChild(div);
            });
        }, (error) => {
            console.error("Error fetching orders:", error);
            // Specific help for the 'missing index' error
            const isIndexError = error.message.includes("index");
            ordersList.innerHTML = `
                <div style="color:red; background:#ffe6e6; padding:15px; border-left:5px solid red;">
                    <strong>Error Loading Orders</strong><br>
                    ${error.message}
                    ${isIndexError ? '<br><br><em>Tip: Open Console (F12) and click the link provided by Firebase to create the required index.</em>' : ''}
                </div>
            `;
        });
    } else {
        console.error("ordersList element not found!");
    }
});
