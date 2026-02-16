// src/pages/WishlistPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const { user, wishlist, removeFromWishlist, addToCart } = useApp();
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState(null);

  /* =======================================================
     🧩 Safe Image URL Resolver (Cloudinary + Local)
  ======================================================= */
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

  /* =======================================================
     🧭 Auth Check
  ======================================================= */
  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Heart className="w-16 h-16 text-gray-300 mb-3" />
        <h2 className="text-2xl font-semibold">Please Login</h2>
        <p className="text-gray-500 mb-4">Login to access your wishlist.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Go Shopping
        </button>
      </div>
    );

  /* =======================================================
     🛍 Empty Wishlist
  ======================================================= */
  if (!wishlist || wishlist.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white shadow-lg rounded-2xl"
        >
          <Heart className="w-20 h-20 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Save your favorite jewelry to view them later!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );

  /* =======================================================
     ❌ Remove Wishlist Item
  ======================================================= */
  const handleRemove = async (productId) => {
    try {
      setLoadingId(productId);
      await removeFromWishlist(productId);
    } catch (err) {
      console.error("❌ Failed to remove item from wishlist:", err);
    } finally {
      setLoadingId(null);
    }
  };

  /* =======================================================
     🛒 Move to Cart
  ======================================================= */
  const handleMoveToCart = async (product) => {
    try {
      setLoadingId(product._id);
      await addToCart(product, 1);
      await removeFromWishlist(product._id);
    } catch (err) {
      console.error("❌ Failed to move to cart:", err);
    } finally {
      setLoadingId(null);
    }
  };

  /* =======================================================
     🎨 Wishlist UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} items</p>
        </div>

        {/* Wishlist Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => {
              const normalized = {
                ...product,
                image: fixImageURL(product.image),
              };

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden relative group transition"
                >
                  {/* Clickable Product */}
                  <div
                    onClick={() =>
                      navigate(`/product/${product.slug || product._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <img
                      src={normalized.image}
                      alt={normalized.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-red-600 transition">
                        {normalized.name}
                      </h3>

                      {Array.isArray(normalized.materials) &&
                        normalized.materials.length > 0 && (
                          <p className="text-sm text-gray-500 mb-2">
                            {normalized.materials
                              .map((m) => `${m.type} (${m.weight}g)`)
                              .join(", ")}
                          </p>
                        )}

                      <p className="text-gray-800 font-medium text-lg">
                        ₹{normalized.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="bg-white rounded-full shadow p-2 hover:bg-red-100 transition"
                      title="Remove from Wishlist"
                      disabled={loadingId === product._id}
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="bg-white rounded-full shadow p-2 hover:bg-green-100 transition"
                      title="Move to Cart"
                      disabled={loadingId === product._id}
                    >
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
