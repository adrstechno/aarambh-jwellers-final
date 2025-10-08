import { useEffect, useState } from "react";
import { getUserOrders } from "../api/orderApi";
import { createReturnRequest } from "../api/returnApi";
import { useApp } from "../context/AppContext";

export default function Orders() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getUserOrders(user.token);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleReturn = async (orderId, productId) => {
    const reason = prompt("Enter reason for return:");
    if (!reason) return;
    await createReturnRequest({ orderId, productId, reason }, user.token);
    alert("Return request submitted!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 shadow rounded-lg">
              <div className="flex justify-between mb-3">
                <p className="font-semibold">Order #{order._id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {order.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center border-b py-3"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-700">
                      Qty: {item.quantity}
                    </p>
                    {order.status === "Delivered" && (
                      <button
                        onClick={() =>
                          handleReturn(order._id, item.product._id)
                        }
                        className="text-sm text-red-600 underline"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-4 font-semibold">
                <span>Total:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
