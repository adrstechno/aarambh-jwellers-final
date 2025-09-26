// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBDH40x0wiNwiHEEM0v-BQ4tcOVtC8PCpw",
  authDomain: "ved9-fde36.firebaseapp.com",
  projectId: "ved9-fde36",
  storageBucket: "ved9-fde36.firebasestorage.app",
  messagingSenderId: "578278475387",
  appId: "1:578278475387:web:29ba4b164fd73cc01004de",
  measurementId: "G-93NZ5QH3RP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize and export Auth
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
