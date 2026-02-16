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
  requestPasswordReset,
  verifyOtpAndReset,
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
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
     🔑 AUTHENTICATION - logout (moved up so autoLogin can call it safely)
  ===================================================== */
  const logoutUser = async () => {
    try {
      await logoutAPI();
    } catch {
      /* ignore */
    } finally {
      setUser(null);
      setCart([]);
      setWishlist([]);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out 👋");
      navigate("/");
      setTimeout(() => window.location.reload(), 200);
    }
  };

  /* =====================================================
     🧠 AUTO LOGIN
  ===================================================== */
  useEffect(() => {
    const autoLogin = async () => {
      console.log("🔐 AppContext: Starting auto-login...");
      const token = localStorage.getItem("token");
      console.log("🔐 AppContext: Token from localStorage =", token ? "EXISTS" : "MISSING");
      
      if (!token) {
        console.log("🔐 AppContext: No token, skipping auto-login");
        setAuthLoading(false);
        return;
      }

      try {
        console.log("📡 AppContext: Fetching profile...");
        const data = await getProfile();
        console.log("✅ AppContext: Profile data =", data);
        const userData = data.user || data;
        const fullUser = { ...userData, token };
        console.log("✅ AppContext: Setting user =", fullUser);
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));

        // don't navigate here — centralized navigation handled below (after authLoading)
      } catch (err) {
        console.warn("⚠️ Auto-login failed:", err?.message || err);
        // use logoutUser safely
        try {
          await logoutUser();
        } catch (e) {
          /* ignore */
        }
      } finally {
        console.log("🔐 AppContext: Auto-login complete, setting authLoading = false");
        setAuthLoading(false);
      }
    };

    autoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     🧭 Redirect after user state changes (centralized)
     Ensures navigation happens *after* user is set and after auto-login finishes.
  ===================================================== */
  useEffect(() => {
    if (authLoading) return; // wait for auto-login
    if (!user) return;

    const role = user?.role?.toLowerCase();
    const currentPath = window.location.pathname;

    if (role === "admin" && !currentPath.startsWith("/admin")) {
      navigate("/admin", { replace: true });
    } else if (role !== "admin" && currentPath.startsWith("/admin")) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

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

      const updatedCart = await addToCartAPI(
        user._id,
        product._id,
        quantity,
        user.token
      );
      if (updatedCart?.items) {
        setCart([...updatedCart.items]);
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
      setCart((prev) => prev.filter((i) => i.product._id !== productId));
      toast.success("Item removed from cart 🗑️");
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
        prev.map((i) => (i.product._id === productId ? { ...i, quantity } : i))
      );
      const updatedCart = await updateQuantityAPI(
        user._id,
        productId,
        quantity,
        user.token
      );
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

  const getTotalPrice = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getTotalItems = () => cart.reduce((t, i) => t + i.quantity, 0);

  /* =====================================================
     ❤️ WISHLIST MANAGEMENT (Instant Update)
  ===================================================== */
  const addToWishlist = async (product) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const already = wishlist.some((p) => p._id === product._id);
      if (already) {
        toast("Product already in wishlist 💖", { icon: "ℹ️" });
        return;
      }

      setWishlist((prev) => [...prev, product]);
      const updated = await addToWishlistAPI(user._id, product._id, user.token);

      if (updated?.products) {
        setWishlist(updated.products.map((p) => p.product));
      }

      toast.success(`${product.name} added to wishlist 💖`);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Could not add to wishlist — try again";

      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("duplicate")) {
        toast("Product already in wishlist 💖", { icon: "ℹ️" });
        return;
      }

      setWishlist((prev) => prev.filter((p) => p._id !== product._id));
      console.error("❌ Add to wishlist failed:", err);
      toast.error(msg);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist 💔");
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

    // 🚀 Immediate navigation to avoid race condition between modal and context
    const role = fullUser.role?.toLowerCase();
    setTimeout(() => {
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, 80);
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

  /* =====================================================
     🧠 PASSWORD RESET
  ===================================================== */
  const handleRequestPasswordReset = async (identifier) => {
    try {
      const res = await requestPasswordReset({ identifier });
      toast.success(res.message || "OTP sent successfully!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to send OTP.");
      return false;
    }
  };

  const handleVerifyOtpReset = async (data) => {
    try {
      const res = await verifyOtpAndReset(data);
      toast.success(res.message || "Password reset successful!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to reset password.");
      return false;
    }
  };

  /* =====================================================
     🆕 AUTO CLOSE LOGIN MODAL ON SUCCESSFUL LOGIN
  ===================================================== */
  useEffect(() => {
    if (user && isLoginModalOpen) {
      setIsLoginModalOpen(false);
    }
  }, [user, isLoginModalOpen]);

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
        handleRequestPasswordReset,
        handleVerifyOtpReset,
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
