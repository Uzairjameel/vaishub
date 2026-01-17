import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const ordersList = document.getElementById("ordersList");

if (ordersList) {
    const ordersCollection = collection(db, "orders");

    // Real-time listener
    onSnapshot(query(ordersCollection, orderBy("date", "desc")), (snapshot) => {
        ordersList.innerHTML = "";

        snapshot.forEach(doc => {
            const order = doc.data();

            const div = document.createElement("div");
            div.className = "order-card";

            div.innerHTML = `
                <h3>Order</h3>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
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
    });
}
