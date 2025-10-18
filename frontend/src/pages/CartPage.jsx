import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCartAPI,
  updateQuantityAPI,
  clearCartAPI,
} from "../api/cartApi";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ Base URL for safe image paths
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // ✅ Normalize image URLs (handles /uploads/, uploads/, and full URLs)
  const fixImageURL = (image) => {
    if (!image) return "/placeholder.jpg";
    const clean = image.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return image;
  };

  // ✅ Load user cart on mount
  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart(user._id, user.token);

        // Normalize images for each product
        const normalizedCart = {
          ...data,
          items: data.items?.map((i) => ({
            ...i,
            product: {
              ...i.product,
              image: fixImageURL(i.product?.image),
            },
          })) || [],
        };

        setCart(normalizedCart);
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  // ✅ Quantity change handler
  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) return;
    try {
      const data = await updateQuantityAPI(user._id, productId, newQty, user.token);

      // Normalize again after update
      const normalized = {
        ...data,
        items: data.items.map((i) => ({
          ...i,
          product: { ...i.product, image: fixImageURL(i.product?.image) },
        })),
      };
      setCart(normalized);
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    }
  };

  // ✅ Remove single item
  const handleRemoveItem = async (productId) => {
    try {
      const data = await removeFromCartAPI(user._id, productId, user.token);
      const normalized = {
        ...data,
        items: data.items.map((i) => ({
          ...i,
          product: { ...i.product, image: fixImageURL(i.product?.image) },
        })),
      };
      setCart(normalized);
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  // ✅ Clear full cart
  const handleClearCart = async () => {
    try {
      await clearCartAPI(user._id, user.token);
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

  // 🟠 Not logged in
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

  // 🟡 Loading state
  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">
        Loading your cart...
      </div>
    );

  // 🔴 Empty cart
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

  // ✅ Cart UI
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
                src={fixImageURL(item.product.image)}
                alt={item.product.name}
                className="h-16 w-16 rounded object-cover border border-gray-200"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  ₹{item.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.product._id, parseInt(e.target.value))
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
