
import { db } from "./firebase-config.js";
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===== Default Products Data (for seeding) =====
const DEFAULT_PRODUCTS = [
    { name: "Wireless Headphones", price: 25, category: "Electronics", image: "images/headphones.jpeg" },
    { name: "Smart Watch", price: 40, category: "Electronics", image: "images/smartwatch.jpeg" },
    { name: "Bluetooth Speaker", price: 30, category: "Audio", image: "images/speaker.jpeg" },
    { name: "Gaming Mouse", price: 15, category: "Accessories", image: "images/mouse.jpeg" }
];

const PRODUCTS_COLLECTION = "products";

/**
 * Subscribes to real-time updates of the products collection.
 * @param {function} onUpdate - Callback function receiving array of products
 */
export function subscribeToProducts(onUpdate) {
    const colRef = collection(db, PRODUCTS_COLLECTION);

    // Check for seeding ONCE (helper logic)
    // We don't want to seed every time, but checking once per session is okay-ish.
    // Better: If snapshot is empty, we seed.
    let seeding = false;

    return onSnapshot(colRef, async (snapshot) => {
        if (snapshot.empty && !seeding) {
            console.log("No products found. Seeding defaults...");
            seeding = true; // Prevent multiple triggers
            try {
                for (const p of DEFAULT_PRODUCTS) {
                    await addDoc(colRef, p);
                }
                // The snapshot will fire again automatically after adds
            } catch (e) {
                console.error("Seeding failed:", e);
            }
            seeding = false;
            return;
        }

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        onUpdate(products);
    }, (error) => {
        console.error("Error subscribing to products:", error);
    });
}

/**
 * Subscribes to real-time updates of a SINGLE product.
 * @param {string} id 
 * @param {function} onUpdate 
 * @returns {function} unsubscribe callback
 */
export function subscribeToProduct(id, onUpdate) {
    if (!id) return () => { };
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            onUpdate({ id: docSnap.id, ...docSnap.data() });
        } else {
            onUpdate(null); // Product deleted or doesn't exist
        }
    }, (error) => {
        console.error("Error subscribing to product:", error);
    });
}

/**
 * Retrieves a single product by ID (One-time fetch).
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function getProductById(id) {
    if (!id) return null;
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting product by ID:", error);
        return null;
    }
}

/**
 * Adds a new product.
 * @param {object} product 
 * @returns {Promise<Object>}
 */
export async function addProduct(product) {
    try {
        const colRef = collection(db, PRODUCTS_COLLECTION);
        const docRef = await addDoc(colRef, product);
        return { id: docRef.id, ...product };
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}

/**
 * Deletes a product by ID.
 * @param {string} id 
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
