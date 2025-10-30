// src/pages/WishlistPage.jsx
import { Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

export default function WishlistPage() {
  const { user, wishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();

  /* =======================================================
     🧩 Safe Image URL Resolver (Cloudinary + Local Support)
  ======================================================= */
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";

    const clean = img.replace(/\\/g, "/");

    // 🟢 Cloudinary / external URLs
    if (clean.startsWith("http")) return clean;

    // 🟡 Local fallback (for older uploads)
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;

    // 🔴 Default placeholder
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
        <p className="text-gray-500">Login to access your wishlist.</p>
      </div>
    );

  /* =======================================================
     🛍 Empty Wishlist
  ======================================================= */
  if (!wishlist || wishlist.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Save your favorite items to view them later!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );

  /* =======================================================
     ❌ Remove Wishlist Item
  ======================================================= */
  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      // Context automatically updates the wishlist state
    } catch (err) {
      console.error("❌ Failed to remove item from wishlist:", err);
    }
  };

  /* =======================================================
     🎨 Wishlist UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => {
            const normalized = {
              ...product,
              image: fixImageURL(product.image),
            };

            return (
              <div key={product._id} className="relative group">
                <ProductCard product={normalized} />
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow p-1 hover:bg-red-100 transition"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
