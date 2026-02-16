/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";


export default function CartPage() {
  const {
    user,
    cart: ctxCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useApp();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ==========================================================
     🧩 Safe Image URL Resolver (Cloudinary + Local)
  ========================================================== */
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  /* ==========================================================
     🛒 Prepare cart with normalized image URLs
  ========================================================== */
  const cart = useMemo(() => {
    const items = (ctxCart || []).map((i) => ({
      ...i,
      product: {
        ...i.product,
        image: fixImageURL(i.product?.image),
      },
    }));
    const total = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    return { items, total };
  }, [ctxCart]);

  /* ==========================================================
     ⚙️ Quantity Actions
  ========================================================== */
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) return;
    try {
      setLoading(true);
      await updateCartQuantity(productId, newQty);
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      await removeFromCart(productId);
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCart();
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     🔒 Not Logged In
  ========================================================== */
  if (!user)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 mb-3 text-lg">
          Please login to view your cart.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Go Shopping
        </button>
      </div>
    );

  /* ==========================================================
     ⏳ Loading State
  ========================================================== */
  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Updating cart...</div>
    );

  /* ==========================================================
     🛍 Empty Cart
  ========================================================== */
  if (!cart.items?.length)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <p className="text-2xl font-bold text-gray-700">Your cart is empty</p>
        <p className="text-gray-500">Start adding some beautiful jewelry!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );

  /* ==========================================================
     🧾 Cart UI
  ========================================================== */
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        <AnimatePresence>
          {cart.items.map((item) => (
            <motion.div
              key={item.product._id}
              className="flex items-center justify-between bg-white p-4 shadow rounded-lg hover:shadow-lg transition cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Clickable Product Section */}
              <div
                className="flex items-center gap-4"
                onClick={() =>
                  navigate(`/product/${item.product.slug || item.product._id}`)
                }
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-red-600 transition">
                    {item.product.name}
                  </h3>

                  {Array.isArray(item.product.materials) &&
                    item.product.materials.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {item.product.materials
                          .map((m) => `${m.type} (${m.weight}g)`)
                          .join(", ")}
                      </p>
                    )}
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    ₹{(item.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quantity & Remove Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-gray-800 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <motion.div
        className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:underline text-sm"
        >
          Clear Cart
        </button>

        <motion.div
          key={cart.total}
          className="text-lg font-semibold text-gray-800"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Total: ₹{cart.total?.toLocaleString() || 0}
        </motion.div>
      </motion.div>

      {/* Checkout Button */}
      <div className="mt-6 text-right sticky bottom-4">
       <motion.button
  whileTap={{ scale: 0.95 }}
  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 shadow-md transition"
  onClick={() => {
    toast.success("🛒 Redirecting to checkout — please review your details.", {
      duration: 2500,
    });

    // Small delay before navigation for smoother UX
    setTimeout(() => navigate("/checkout"), 1000);
  }}
>
  Proceed to Checkout
</motion.button>
      </div>
    </motion.div>
  );
}
