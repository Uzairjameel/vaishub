
// Simple client-side auth state management
const AUTH_KEY = "admin_logged_in";

/**
 * Logs in the admin (Simple hardcoded check for demo purposes).
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean} true if successful
 */
export function login(email, password) {
    // Hardcoded credentials for this frontend-only project
    // User can customize these or we could hook up to Firebase Auth later
    if (email === "admin@vaishub.com" && password === "admin123") {
        sessionStorage.setItem(AUTH_KEY, "true");
        return true;
    }
    return false;
}

/**
 * Logs out the admin.
 */
export function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
}

/**
 * Checks if admin is logged in.
 * @returns {boolean}
 */
export function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
}

/**
 * Enforces auth on a page - redirects to home if not logged in.
 * Optionally can be used to show/hide UI sections.
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        // You might want to just return false to let the specific page handle UI
        return false;
    }
    return true;
}
