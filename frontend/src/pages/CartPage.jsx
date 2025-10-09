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

  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const data = await getCart(user._id, user.token);
        setCart(data);
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const handleQuantityChange = async (productId, newQty) => {
    try {
      const data = await updateQuantityAPI(user._id, productId, newQty, user.token);
      setCart(data);
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const data = await removeFromCartAPI(user._id, productId, user.token);
      setCart(data);
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartAPI(user._id, user.token);
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

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

  if (loading)
    return <div className="text-center py-10 text-gray-600">Loading your cart...</div>;

  if (cart.items.length === 0)
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>
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
                className="w-16 text-center border rounded"
              />
              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:underline text-sm"
        >
          Clear Cart
        </button>

        <div className="text-lg font-semibold">
          Total: ₹{cart.total.toLocaleString()}
        </div>
      </div>

      <div className="mt-6 text-right">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
