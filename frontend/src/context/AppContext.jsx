/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
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
import {
  getProfile,
  loginUser,
  registerUser,
  logoutUser as logoutAPI,
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  /* =====================================================
     🔐 AUTH HELPERS
  ===================================================== */
  const toggleLoginModal = () => setIsLoginModalOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token = user?.token || localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isAdmin = () => user?.role?.toLowerCase() === "admin";

  /* =====================================================
     🧠 AUTO LOGIN
  ===================================================== */
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        const userData = data.user || data;
        const fullUser = { ...userData, token };
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));

        if (userData.role?.toLowerCase() === "admin") navigate("/admin");
      } catch (err) {
        console.warn("⚠️ Auto-login failed:", err.message);
        logoutUser();
      } finally {
        setAuthLoading(false);
      }
    };

    autoLogin();
  }, []);

  /* =====================================================
     🧾 LOAD CART & WISHLIST
  ===================================================== */
  useEffect(() => {
    if (!user || !user._id) {
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

  /* =====================================================
     🛒 CART MANAGEMENT (Instant Update)
  ===================================================== */
  const addToCart = async (product, quantity = 1) => {
    if (!user) return setIsLoginModalOpen(true);

    try {
      // 🔥 Optimistic update (immediate UI feedback)
      setCart((prev) => {
        const existing = prev.find((i) => i.product._id === product._id);
        if (existing) {
          return prev.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, quantity, price: product.price }];
      });

      // 🧩 Sync with backend (without overwriting local instantly)
      const updatedCart = await addToCartAPI(user._id, product._id, quantity, user.token);
      if (updatedCart?.items) {
        setCart([...updatedCart.items]); // triggers re-render
      }

      toast.success(`${product.name} added to cart 🛒`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      toast.error("Could not add item to cart");
    }
  };

  const removeFromCart = async (productId) => {
  if (!user) return;
  try {
    // ✅ Instant optimistic removal
    setCart((prev) => prev.filter((i) => i.product._id !== productId));
    toast.success("Item removed from cart 🗑️");

    // ✅ Background sync (don’t overwrite UI)
    await removeFromCartAPI(user._id, productId, user.token);
  } catch (err) {
    console.error("❌ Failed to remove from cart:", err);
    toast.error("Could not remove from cart");
  }
};
  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity } : i
        )
      );
      const updatedCart = await updateQuantityAPI(user._id, productId, quantity, user.token);
      setCart(updatedCart.items || []);
    } catch (err) {
      console.error("❌ Update quantity failed:", err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      setCart([]);
      await clearCartAPI(user._id, user.token);
      toast.success("Cart cleared 🧹");
    } catch (err) {
      console.error("❌ Clear cart failed:", err);
    }
  };

  const getTotalPrice = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getTotalItems = () =>
    cart.reduce((t, i) => t + i.quantity, 0);

  /* =====================================================
     ❤️ WISHLIST MANAGEMENT (Instant Update)
  ===================================================== */
  const addToWishlist = async (product) => {
  if (!user) {
    setIsLoginModalOpen(true);
    return;
  }

  try {
    // If already in wishlist, inform user and skip API call
    const already = wishlist.some((p) => p._id === product._id);
    if (already) {
      toast("Product already in wishlist 💖", { icon: "ℹ️" });
      return;
    }

    // Optimistic update for instant UI feedback
    setWishlist((prev) => [...prev, product]);

    // Call backend to persist
    const updated = await addToWishlistAPI(user._id, product._id, user.token);

    // If backend returns canonical list, use it. Otherwise keep optimistic list.
    if (updated?.products) {
      // normalize to product objects
      setWishlist(updated.products.map((p) => p.product));
    } else {
      // fallback: keep optimistic list (already set)
      // (optional) re-fetch from server if you want canonical state
    }

    toast.success(`${product.name} added to wishlist 💖`);
  } catch (err) {
    // If backend signals duplicate (or other client-friendly reason), show friendly message
    const msg =
      err.response?.data?.message ||
      err.message ||
      "Could not add to wishlist — try again";

    // If API returned duplicate error, just show info and keep optimistic state
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("duplicate")) {
      toast("Product already in wishlist 💖", { icon: "ℹ️" });
      return;
    }

    // Otherwise rollback optimistic update and show error
    setWishlist((prev) => prev.filter((p) => p._id !== product._id));
    console.error("❌ Add to wishlist failed:", err);
    toast.error(msg);
  }
};

 const removeFromWishlist = async (productId) => {
  if (!user) return;
  try {
    // ✅ Instant optimistic removal
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    toast.success("Removed from wishlist 💔");

    // ✅ Background sync (don’t overwrite UI)
    await removeFromWishlistAPI(user._id, productId, user.token);
  } catch (err) {
    console.error("❌ Failed to remove from wishlist:", err);
    toast.error("Could not remove from wishlist");
  }
};

  /* =====================================================
     🔑 AUTHENTICATION
  ===================================================== */
  const saveUserSession = (data) => {
    const fullUser = { ...data.user, token: data.token };
    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", data.token);
    setUser(fullUser);
    setIsLoginModalOpen(false);

    toast.success(`Welcome ${fullUser.name || "back"}! 👋`);

    if (fullUser.role?.toLowerCase() === "admin") navigate("/admin");
    else navigate("/");
  };

  const handleLogin = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data) saveUserSession(data);
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
      throw err;
    }
  };

  const handleRegister = async (formData) => {
    try {
      const data = await registerUser(formData);
      if (data) saveUserSession(data);
    } catch (err) {
      toast.error("Registration failed.");
      throw err;
    }
  };

  const logoutUser = async () => {
  try {
    await logoutAPI();
  } catch {
    /* ignore server logout error */
  } finally {
    // ✅ Immediately clear all app state
    setUser(null);
    setCart([]);
    setWishlist([]);

    // ✅ Clear persistent storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    toast.success("Logged out 👋");

    // ✅ Navigate to user home
    navigate("/");

    // ✅ Ensure UI re-renders instantly across routes
    setTimeout(() => {
      window.location.reload(); // 👈 only reloads once to reset admin/user root
    }, 200);
  }
};

  /* =====================================================
     🧩 PROVIDER VALUE
  ===================================================== */
  return (
    <AppContext.Provider
      value={{
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,

        // Auth
        user,
        setUser,
        handleLogin,
        handleRegister,
        logoutUser,
        isLoginModalOpen,
        toggleLoginModal,
        getAuthHeader,
        isAdmin,
        authLoading,

        // Misc
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
