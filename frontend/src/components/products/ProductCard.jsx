/* eslint-disable react/prop-types */
import { useState } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "../../api/wishlistApi.js";
import { addToCartAPI } from "../../api/cartApi.js";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const { user } = useApp();
  const navigate = useNavigate();

  const isSoldOut = product.stock === 0 || product.status === "Inactive";

  // ✅ Unified image base URL
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // ✅ Safe image handling
  const productImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    "/placeholder.jpg";

  const imageSrc = productImage.startsWith("http")
    ? productImage
    : `${BASE_URL}${productImage}`;

  // 🛒 Add to Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please login to add to cart.");
    if (isSoldOut) return alert("Product is sold out.");

    try {
      setIsLoading(true);
      await addToCartAPI(user._id, product._id, 1, user.token);
      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      alert("Failed to add to cart. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  // ❤️ Wishlist Toggle
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please login to manage wishlist.");

    try {
      setIsLoading(true);
      if (isInWishlist) {
        await removeFromWishlistAPI(user._id, product._id, user.token);
        setIsInWishlist(false);
        alert("💔 Removed from wishlist!");
      } else {
        await addToWishlistAPI(user._id, product._id, user.token);
        setIsInWishlist(true);
        alert("❤️ Added to wishlist!");
      }
    } catch (err) {
      console.error("❌ Wishlist update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 👁 Quick View
  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer will-change-transform"
      style={{
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0px)",
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 🖼 Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2 z-20">
          {product.isFeatured && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              FEATURED
            </span>
          )}
          {isSoldOut && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className="absolute top-3 right-3 space-y-2 z-20"
          style={{
            transition: "all 0.4s ease",
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? "translateX(0px) scale(1)"
              : "translateX(16px) scale(0.8)",
          }}
        >
          <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition ${
              isInWishlist
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          </button>

          <button
            onClick={handleQuickView}
            className="bg-white/90 p-2 rounded-full shadow-lg text-gray-600 hover:bg-blue-50 hover:text-blue-500"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay Add to Cart */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            background: isHovered ? "rgba(0, 0, 0, 0.4)" : "transparent",
            transition: "all 0.4s ease",
            opacity: isHovered && !isSoldOut ? 1 : 0,
            visibility: isHovered && !isSoldOut ? "visible" : "hidden",
          }}
        >
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 flex items-center space-x-2 shadow-xl"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isLoading ? "Adding..." : "Quick Add"}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3
          className="text-lg font-semibold mb-2 line-clamp-2"
          style={{
            transition: "color 0.3s ease",
            color: isHovered ? "#dc2626" : "#111827",
          }}
        >
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price?.toLocaleString() || "N/A"}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isSoldOut || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium border transition ${
            isSoldOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {isSoldOut ? "SOLD OUT" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
