
import { db } from "./firebase-config.js";
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===== Default Products Data (for seeding) =====
const DEFAULT_PRODUCTS = [
    { name: "Wireless Headphones", price: 25, category: "Electronics", image: "images/headphones.jpeg" },
    { name: "Smart Watch", price: 40, category: "Electronics", image: "images/smartwatch.jpeg" },
    { name: "Bluetooth Speaker", price: 30, category: "Audio", image: "images/speaker.jpeg" },
    { name: "Gaming Mouse", price: 15, category: "Accessories", image: "images/mouse.jpeg" }
];

const PRODUCTS_COLLECTION = "products";

/**
 * Retrieves all products from Firestore.
 * If empty, seeds default products.
 * @returns {Promise<Array>}
 */
export async function getAllProducts() {
    try {
        const colRef = collection(db, PRODUCTS_COLLECTION);
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
            console.log("No products in Firestore. Seeding defaults...");
            // Seed sequentially to avoid flooding
            const seeded = [];
            for (const p of DEFAULT_PRODUCTS) {
                const docRef = await addDoc(colRef, p);
                seeded.push({ id: docRef.id, ...p });
            }
            return seeded;
        }

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error("Error getting products:", error);
        return [];
    }
}

/**
 * Retrieves a single product by ID.
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
            console.warn("No such product!");
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
