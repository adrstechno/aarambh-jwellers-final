// src/pages/CartPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const {
    user,
    cart: ctxCart, // array of items from context
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useApp();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Base URL for safe image paths
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // Normalize image URLs (handles /uploads/, uploads/, and full URLs)
  const fixImageURL = (image) => {
    if (!image) return "/placeholder.jpg";
    const clean = image.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return image;
  };

  // derive normalized cart items for UI (memoized)
  const cart = useMemo(() => {
    const items = (ctxCart || []).map((i) => ({
      ...i,
      // in your context each item likely has shape { product: {...}, quantity, price }
      product: {
        ...i.product,
        image: fixImageURL(i.product?.image),
      },
    }));
    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
    return { items, total };
  }, [ctxCart]);

  // helpers that call context actions and provide small local loading indicator
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) return;
    try {
      setLoading(true);
      // context action should update global cart and header instantly
      await updateCartQuantity(productId, newQty);
      // no local setState required — cart comes from context
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
      // context updates; no local set needed
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

  // Not logged in
  if (!user)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 mb-3 text-lg">Please login to view your cart.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Go Shopping
        </button>
      </div>
    );

  // Loading state (optional, show while update is in-flight)
  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">
        Updating cart...
      </div>
    );

  // Empty cart
  if (!cart.items?.length)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <p className="text-2xl font-bold mb-3">Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Continue Shopping
        </button>
      </div>
    );

  // Cart UI
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between bg-white p-4 shadow rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image || "/placeholder.jpg"}
                alt={item.product.name}
                className="h-16 w-16 rounded object-cover border border-gray-200"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  ₹{(item.price || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.product._id, parseInt(e.target.value, 10))
                }
                className="w-16 text-center border rounded-md focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:underline text-sm"
        >
          Clear Cart
        </button>

        <div className="text-lg font-semibold">
          Total: ₹{cart.total?.toLocaleString() || 0}
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 text-right">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
