# Project Overview and Audit

## 1. Project Overview
**Type:** E-commerce Frontend Application
**Summary:** This is a static web application for an online store ("Vaishub"). It allows users to browse products, filter by category/price, manage a shopping cart using LocalStorage, and place orders which are saved to a Firebase Firestore database.
**Architecture:** Client-side only (SPA-like behavior but with multi-page navigation). No custom backend server; relies on Firebase for persistence and LocalStorage for temporary state.

## 2. Technology Stack
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules).
*   **Backend / Database:** Firebase Firestore (v12 via CDN).
*   **State Management:** `localStorage` (for Cart and Client-side Product list).
*   **Styling:** Native CSS (`style.css`), no frameworks.
*   **Hosting/Runtime:** Runs directly in browser (e.g., Live Server).

## 3. File Interdependencies & Purpose

| File | Purpose | Key Dependencies |
| :--- | :--- | :--- |
| `firebase-config.js` | Firebase initialization and configuration. Exports `db`. | Used by `checkout.js`, `admin-orders.js`. |
| `index.html` / `script.js` | Main Landing Page & Catalog. Handles product display, filtering, and initial data loading. | Reads `localStorage` "products". Defaults to hardcoded list if empty. |
| `product.html` / `product.js` | Product Detail Page. Shows single product info based on URL ID. | **CRITICAL ISSUE:** Uses a separate hardcoded product list, ignoring `localStorage`. |
| `cart.html` / `cart.js` | Shopping Cart. Manages items, quantities, and totals. | Reads/Writes `localStorage` "cart". |
| `checkout.html` / `checkout.js` | Checkout Form. Collects user info and saves order to Firebase. | Imports `db` from `firebase-config.js`. Reads `localStorage` "cart". |
| `admin.html` / `admin.js` | Product Management. logic for adding/removing products. | Writes to `localStorage` "products". |
| `admin-orders.html` / `admin-orders.js` | Order Dashboard. Views orders from Firebase. | Imports `db`. Reads Firestore `orders` collection. |
| `style.css` | Global styles, responsive design, and layout. | Used by all HTML files. |

## 4. Functionality Mapping
*   **Product Browsing:** Users can see products, filter by Category or Price range.
*   **Cart System:**
    *   Add to cart (persist to LocalStorage).
    *   Adjust quantity / Remove items.
    *   Cart badge count updates dynamically.
*   **Checkout:**
    *   Validation of shipping details.
    *   Submitting order saves to Firestore `orders` collection.
    *   Clears cart upon success.
*   **Admin (Product):** Add new products (Title, Price, Category, Image) -> Saves to LocalStorage.
*   **Admin (Orders):** Real-time listener for new orders from Firestore.

## 5. Data Flow
1.  **Products:**
    *   **Source:** `script.js` checks `localStorage`. If empty, uses hardcoded array of 4 items.
    *   **Admin:** `admin.js` adds items to `localStorage`.
    *   **Risk:** `product.js` (Detail page) does **NOT** read `localStorage`. It uses its own hardcoded list. If an admin adds a product, clicking it on the home page will likely lead to a "Product not found" error on the detail page.

2.  **Cart:**
    *   Stored entirely in `localStorage` key `"cart"`.
    *   Shared across pages.

3.  **Orders:**
    *   **Write:** `checkout.js` writes to Firestore collection `orders`.
    *   **Read:** `admin-orders.js` listens to `orders`.

## 6. Critical Findings & Missing Parts
### 🛑 High Severity
*   **Product Data Synchronization:** The Detail Page (`product.js`) does not sync with the Home Page or Admin. New products added via Admin will break when clicked.
*   **Security:** **No Authentication.** The Admin Panel (`admin.html`) is publicly accessible to anyone who guesses the URL.
*   **Bug in Admin Orders:** `checkout.js` saves the timestamp field as `createdAt`, but `admin-orders.js` tries to sort by `date`. This may cause the orders list to be empty or unsorted.

### ⚠️ Medium Severity
*   **Hardcoded Fallbacks:** If LocalStorage is cleared, the app reverts to the 4 hardcoded items only on the Home page.
*   **Validation:** Minimal input validation on forms.

### ℹ️ Low Severity
*   **Date Storing:** Storing dates as raw strings or objects in Firestore can be tricky for sorting; native Firestore Timestamp is preferred.

## 7. Next Steps for Developer
1.  **Refactor Product Data:** Create a single `products.js` module or service that both `index.html` and `product.html` import to ensure they use the exact same data source (LocalStorage).
2.  **Fix Order Sorting:** Change `orderBy("date")` to `orderBy("createdAt")` in `admin-orders.js` to match the data written by `checkout.js`.
3.  **Implement Auth:** Add a simple login page for the Admin panel using Firebase Auth.
4.  **Deployment:** Configure Firestore Security Rules to allow public *writes* (orders) but restricting *reads* (orders list) to authenticated admins only.

