import { useState } from "react";
import { useApp } from "../context/AppContext";
import { createOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, getTotalPrice, user } = useApp();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleOrder = async () => {
    try {
      const orderData = {
        items: cart.map((c) => ({
          product: c._id,
          quantity: c.quantity,
          price: c.price,
        })),
        totalAmount: Math.round(getTotalPrice() * 1.18),
        shippingAddress: address,
      };
      await createOrder(orderData, user.token);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <textarea
        className="w-full border rounded-lg p-3 mb-6"
        placeholder="Enter shipping address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <p className="text-xl font-semibold mb-4">
        Total: ₹{Math.round(getTotalPrice() * 1.18).toLocaleString()}
      </p>
      <button
        onClick={handleOrder}
        className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700"
      >
        Place Order
      </button>
    </div>
  );
}
