/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { createOrder } from "../api/orderApi";
import { clearCartAPI } from "../api/cartApi";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, getTotalPrice, user, clearCart } = useApp();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Safe image path normalizer
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return img;
  };

  // 🧾 Place Order (Cash on Delivery)
  const handleOrder = async () => {
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Order payload matches backend model
      const orderData = {
        userId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
        shippingAddress: address,
        total: Math.round(getTotalPrice() * 1.18),
        paymentMethod: "COD",
        products: cart.map((item) => ({
          product: item.product?._id || item._id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createOrder(orderData, user.token);
      await clearCartAPI(user._id, user.token);
      clearCart();

      alert("✅ Order placed successfully! Your order will be delivered soon.");
      navigate("/orders?refresh=true");
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-gray-600 text-lg">Please login to checkout.</p>
      </div>
    );

  if (!cart.length)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </div>
    );

  // ✅ Calculate totals
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.18;
  const total = Math.round(subtotal + tax);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        🛍️ Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 🧾 Left: Shipping Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Shipping Address
          </h2>
          <textarea
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 min-h-[120px]"
            placeholder="Enter your complete address including city, state, and pincode."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Payment Method
            </h2>
            <div className="flex items-center gap-3 bg-gray-50 border p-3 rounded-lg">
              <input
                type="radio"
                id="cod"
                checked
                readOnly
                className="accent-red-600"
              />
              <label htmlFor="cod" className="font-medium text-gray-700">
                Cash on Delivery (COD)
              </label>
            </div>
          </div>
        </div>

        {/* 🧾 Right: Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          {/* Order Items List */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={fixImageURL(item.product.image)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md border"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-700">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t mt-6 pt-4 text-gray-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Confirm Order Button */}
          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all shadow-md"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
