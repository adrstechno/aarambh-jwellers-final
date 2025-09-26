// auth.js
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  updateProfile
} from "firebase/auth";
import { setDoc, doc, collection, serverTimestamp } from "firebase/firestore";

// Initialize Firestore user data (profile + empty cart & wishlist)
const initializeUserData = async (user, name) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    profile: {
      name: name || user.displayName || "",
      email: user.email
    }
  }, { merge: true });

  

  const cartRef = collection(db, "users", user.uid, "cart");
  const wishlistRef = collection(db, "users", user.uid, "wishlist");

  // create dummy docs so collections appear in Firebase
  await setDoc(doc(cartRef, "init"), { createdAt: serverTimestamp() });
  await setDoc(doc(wishlistRef, "init"), { createdAt: serverTimestamp() });
};

// Signup with email/password
export const signup = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update displayName in Firebase Auth
  await updateProfile(user, { displayName: name });

  // Initialize Firestore data
  await initializeUserData(user, name);

  return user;
};

// Login with email/password
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Login with Google
export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Initialize Firestore data (first time login)
  await initializeUserData(user);

  return user;
};

// Logout
export const logout = () => signOut(auth);
