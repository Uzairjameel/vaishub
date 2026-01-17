# Deployment & Verification Guide

## 1. Hosting on GitHub Pages
Since this is a static website (HTML/CSS/JS), GitHub Pages is the easiest way to host it.

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of refactored integration"
    ```
2.  **Push to GitHub**:
    - Create a new repository on GitHub.
    - Follow the instructions to push your local code.
3.  **Enable Pages**:
    - Go to Repository Settings -> Pages.
    - Select `main` (or `master`) branch as the source.
    - Save. You will get a live URL (e.g., `https://username.github.io/repo-name/`).

## 2. Firebase Configuration
Ensure your `firebase-config.js` has the correct `authDomain` and `projectId`.
- If you see "Permission Missing" errors in the console when placing orders, you need to update your Firestore Security Rules in the Firebase Console.

**Recommended Rules (for this stage):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{order} {
      allow read: if true;  // WARNING: Ideally restrict this to admin only in production
      allow write: if true; // Allow anyone to place an order
    }
  }
}
```
*Note: The Admin Panel code now requires a password ("admin123") to view orders, adding a layer of client-side security.*

## 3. Verification Checklist
### 🛒 Shopper Flow
1.  **Home Page**: Verify products are visible. (Should see 4 defaults).
2.  **Cart**: Add 2 different items. Go to Cart. Verify quantity and total.
3.  **Checkout**: Click Checkout. Fill form. Click "Place Order".
    - Success Alert should appear.
    - Cart should be empty afterwards.
    - Redirect to Home.

### 🔐 Admin Flow
1.  **Login**: Go to `admin.html`. You should see a Login Prompt.
    - Enter `admin@vaishub.com` / `admin123`.
    - Dashboard should appear.
2.  **Add Product**: Fill the form to add a test product.
    - Verify it appears in the "Existing Products" list below.
3.  **Verify New Product**: Go to Home Page (`index.html`).
    - The new product should be visible!
    - Click it. It should open `product.html` with correct details (no "Product not found" error).
4.  **View Orders**: In Admin, click "View Orders".
    - You should see the order you placed earlier at the top of the list.

## 4. Troubleshooting
- **Images not loading?** Ensure the `images/` folder is committed and paths are relative (e.g., `images/headphones.jpeg`).
- **Update Delay?** GitHub Pages can take 1-2 minutes to update after a push.
