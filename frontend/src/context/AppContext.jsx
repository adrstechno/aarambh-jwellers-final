/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCartAPI,
  updateQuantityAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../api/cartApi";
import {
  getWishlist,
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "../api/wishlistApi";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // 🧠 Load user’s cart and wishlist when logged in
  useEffect(() => {
  if (!user) {
    setCart([]);
    setWishlist([]);
    return;
  }

  // 🟢 Skip fetching cart/wishlist for hardcoded admin
  if (user._id === "hardcoded-admin") {
    setCart([]);
    setWishlist([]);
    return;
  }

  const fetchData = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        getCart(user._id, user.token),
        getWishlist(user._id, user.token),
      ]);
      setCart(cartData.items || []);
      setWishlist(wishlistData.products?.map((p) => p.product) || []);
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
    }
  };

  fetchData();
}, [user]);
  /* ======================
     🛒 CART MANAGEMENT
  ====================== */
  const addToCart = async (product, quantity = 1) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      const updatedCart = await addToCartAPI(
        user._id,
        product._id,
        quantity,
        user.token
      );
      setCart(updatedCart.items);
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const updatedCart = await removeFromCartAPI(
        user._id,
        productId,
        user.token
      );
      setCart(updatedCart.items);
    } catch (err) {
      console.error("❌ Failed to remove from cart:", err);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      const updatedCart = await updateQuantityAPI(
        user._id,
        productId,
        quantity,
        user.token
      );
      setCart(updatedCart.items);
    } catch (err) {
      console.error("❌ Failed to update cart quantity:", err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await clearCartAPI(user._id, user.token);
      setCart([]);
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  /* ======================
     ❤️ WISHLIST MANAGEMENT
  ====================== */
  const addToWishlist = async (product) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      const updated = await addToWishlistAPI(user._id, product._id, user.token);
      setWishlist(updated.products.map((p) => p.product));
    } catch (err) {
      console.error("❌ Failed to add to wishlist:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const updated = await removeFromWishlistAPI(
        user._id,
        productId,
        user.token
      );
      setWishlist(updated.products.map((p) => p.product));
    } catch (err) {
      console.error("❌ Failed to remove from wishlist:", err);
    }
  };

  /* ======================
     🔐 AUTHENTICATION
  ====================== */
  const toggleLoginModal = () => setIsLoginModalOpen((prev) => !prev);

  // ✅ Login
  const loginUser = (data) => {
    // Combine token + user info properly
    const fullUser = { ...data.user, token: data.token };

    // Save both in memory & localStorage
    setUser(fullUser);
    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", data.token);
  };

  // ✅ Logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ✅ Helper — Get Authorization header for API calls
  const getAuthHeader = () => {
    const token = user?.token || localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ Helper — Check if current user is admin
  const isAdmin = () => user?.role === "Admin" || user?.isAdmin === true;

  return (
    <AppContext.Provider
      value={{
        // 🛒 Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,

        // ❤️ Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,

        // 🔐 Auth
        user,
        loginUser,
        logoutUser,
        isLoginModalOpen,
        toggleLoginModal,
        getAuthHeader,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
