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
  const [loadingData, setLoadingData] = useState(false);

  /* ========================================
     🔐 AUTH HELPERS
  ======================================== */
  const toggleLoginModal = () => setIsLoginModalOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token = user?.token || localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isAdmin = () => user?.role === "Admin" || user?.isAdmin === true;

  /* ========================================
     🧠 LOAD USER CART & WISHLIST
  ======================================== */
  useEffect(() => {
    if (!user || !user._id || user._id === "hardcoded-admin") {
      setCart([]);
      setWishlist([]);
      return;
    }

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [cartData, wishlistData] = await Promise.all([
          getCart(user._id, user.token),
          getWishlist(user._id, user.token),
        ]);
        setCart(cartData.items || []);
        setWishlist(wishlistData.products?.map((p) => p.product) || []);
      } catch (err) {
        console.error("❌ Failed to load user data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user?._id]);

  /* ========================================
     🛒 CART MANAGEMENT
  ======================================== */
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

  /* ========================================
     ❤️ WISHLIST MANAGEMENT
  ======================================== */
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

  /* ========================================
     🔑 AUTHENTICATION (Simplified)
  ======================================== */
  // ✅ Save user session from API response
  const saveUserSession = (data) => {
    const fullUser = { ...data.user, token: data.token };
    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", data.token);
    setUser(fullUser);
    setIsLoginModalOpen(false);
  };

  const handleLogin = (data) => saveUserSession(data);
  const handleRegister = (data) => saveUserSession(data);

  const logoutUser = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* ========================================
     PROVIDER VALUE
  ======================================== */
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
        handleLogin,
        handleRegister,
        logoutUser,
        isLoginModalOpen,
        toggleLoginModal,
        getAuthHeader,
        isAdmin,

        // 🔄 State
        loadingData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
