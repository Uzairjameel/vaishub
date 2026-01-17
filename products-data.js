
// ===== Default Products Data =====
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Wireless Headphones", price: 25, category: "Electronics", image: "images/headphones.jpeg" },
    { id: 2, name: "Smart Watch", price: 40, category: "Electronics", image: "images/smartwatch.jpeg" },
    { id: 3, name: "Bluetooth Speaker", price: 30, category: "Audio", image: "images/speaker.jpeg" },
    { id: 4, name: "Gaming Mouse", price: 15, category: "Accessories", image: "images/mouse.jpeg" }
];

// ===== Functions =====

/**
 * Retrieves all products from localStorage or returns defaults.
 * Also ensures localStorage is initialized.
 */
export function getAllProducts() {
    let products = JSON.parse(localStorage.getItem("products"));

    if (!products || products.length === 0) {
        products = DEFAULT_PRODUCTS;
        localStorage.setItem("products", JSON.stringify(products));
    }

    return products;
}

/**
 * Retrieves a single product by ID.
 * @param {number|string} id 
 */
export function getProductById(id) {
    const products = getAllProducts();
    // usage of == to allow string/number matching
    return products.find(p => p.id == id);
}

/**
 * Adds a new product to the list.
 * @param {object} product - { name, price, category, image }
 */
export function addProduct(product) {
    const products = getAllProducts();

    // Generate simple ID: max existing ID + 1
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = { ...product, id: maxId + 1 };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    return newProduct;
}

/**
 * Deletes a product by ID.
 * @param {number|string} id 
 */
export function deleteProduct(id) {
    let products = getAllProducts();
    products = products.filter(p => p.id != id);
    localStorage.setItem("products", JSON.stringify(products));
}
