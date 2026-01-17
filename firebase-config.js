// using version 10.8.0 for stability
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8ti8Fxho2YUf-dFuQnuTE1ESHp6t0ne4",
  authDomain: "vaishub-87982.firebaseapp.com",
  projectId: "vaishub-87982",
  storageBucket: "vaishub-87982.firebasestorage.app",
  messagingSenderId: "165899643819",
  appId: "1:165899643819:web:fef72f0b84ee3f459700ee",
  measurementId: "G-DN6X1JR9MD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase v10.8.0 Initialized. DB:", db);

export { app, db };
