// AppContext.js
import { createContext, useContext, useReducer, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const AppContext = createContext();

const CART_KEY = "myshop_cart";
const WISHLIST_KEY = "myshop_wishlist";

const initialState = {
  cart: [],
  wishlist: [],
  user: null,
  isLoginModalOpen: false,
};

// --- Firestore Helpers ---
const saveCartToFirestore = async (userId, cart) => {
  if (!userId || !cart.length) return; // exit if invalid
  const cartRef = collection(db, "users", userId, "cart");
  for (let item of cart) {
    await setDoc(doc(cartRef, item.id), { ...item, updatedAt: serverTimestamp() });
  }
};

const saveWishlistToFirestore = async (userId, wishlist) => {
  if (!userId) return;
  const wishlistRef = collection(db, "users", userId, "wishlist");
  for (let item of wishlist) {
    await setDoc(doc(wishlistRef, item.id), { ...item, addedAt: serverTimestamp() });
  }
};

// --- Reducer ---
function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "TOGGLE_LOGIN_MODAL":
      return { ...state, isLoginModalOpen: !state.isLoginModalOpen };

    case "LOAD_CART":
      return { ...state, cart: action.payload };

    case "LOAD_WISHLIST":
      return { ...state, wishlist: action.payload };

    default:
      return state;
  }
}

// --- Provider ---
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // --- Cart Operations ---
  const saveCart = async (newCart) => {
    dispatch({ type: "LOAD_CART", payload: newCart });
    if (state.user) {
      await saveCartToFirestore(state.user.uid, newCart);
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    }
  };

  const addToCart = (product) => {
    const existing = state.cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = state.cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...state.cart, { ...product, quantity: 1 }];
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = state.cart.filter((item) => item.id !== productId);
    saveCart(newCart);
  };

  const updateCartQuantity = (productId, quantity) => {
    let newCart;
    if (quantity <= 0) {
      newCart = state.cart.filter((item) => item.id !== productId);
    } else {
      newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    }
    saveCart(newCart);
  };

  // --- Wishlist Operations ---
  const saveWishlist = async (newWishlist) => {
    dispatch({ type: "LOAD_WISHLIST", payload: newWishlist });
    if (state.user) {
      await saveWishlistToFirestore(state.user.uid, newWishlist);
    } else {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
    }
  };

  const addToWishlist = (product) => {
    const exists = state.wishlist.find((item) => item.id === product.id);
    if (exists) return;
    saveWishlist([...state.wishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    saveWishlist(state.wishlist.filter((item) => item.id !== productId));
  };

  // --- Utility Functions ---
  const toggleLoginModal = () => dispatch({ type: "TOGGLE_LOGIN_MODAL" });

  const getTotalPrice = () =>
    state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    state.cart.reduce((total, item) => total + item.quantity, 0);

  // --- Auth Listener ---
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      dispatch({ type: "SET_USER", payload: currentUser });

      // --- Merge localStorage (guest) with Firestore ---
      const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

      // Load Firestore cart/wishlist
      const cartSnap = await getDocs(collection(db, "users", currentUser.uid, "cart"));
      const wishlistSnap = await getDocs(collection(db, "users", currentUser.uid, "wishlist"));

      const firestoreCart = cartSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const firestoreWishlist = wishlistSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Merge guest + Firestore data (avoid duplicates)
      const mergedCart = [
        ...firestoreCart,
        ...localCart.filter(
          (lcItem) => !firestoreCart.find((fcItem) => fcItem.id === lcItem.id)
        ),
      ];

      const mergedWishlist = [
        ...firestoreWishlist,
        ...localWishlist.filter(
          (lwItem) => !firestoreWishlist.find((fwItem) => fwItem.id === lwItem.id)
        ),
      ];

      // Save merged data back to Firestore
      await saveCartToFirestore(currentUser.uid, mergedCart);
      await saveWishlistToFirestore(currentUser.uid, mergedWishlist);

      // Dispatch merged data
      dispatch({ type: "LOAD_CART", payload: mergedCart });
      dispatch({ type: "LOAD_WISHLIST", payload: mergedWishlist });

      // Clear localStorage after merging
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(WISHLIST_KEY);
    } else {
      // Guest user, load from localStorage
      dispatch({
        type: "SET_USER",
        payload: null,
      });

      const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

      dispatch({ type: "LOAD_CART", payload: localCart });
      dispatch({ type: "LOAD_WISHLIST", payload: localWishlist });
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <AppContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        toggleLoginModal,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
