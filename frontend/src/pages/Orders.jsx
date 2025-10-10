/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getUserOrders } from "../api/orderApi";
import { createReturnRequest, getUserReturns } from "../api/returnApi";
import { useApp } from "../context/AppContext";
import { X, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function Orders() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, returnData] = await Promise.all([
          getUserOrders(user.token),
          getUserReturns(user.token),
        ]);
        setOrders(orderData);
        setReturns(returnData);
      } catch (err) {
        showToast("error", "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  const openReturnModal = (orderId, product) => {
    setSelectedItem({ orderId, product });
    setShowModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return showToast("error", "Please enter a reason.");

    try {
      await createReturnRequest(
        {
          orderId: selectedItem.orderId,
          productId: selectedItem.product._id,
          reason,
        },
        user.token
      );
      showToast("success", "Return request submitted!");
      setShowModal(false);
      setReason("");
    } catch (err) {
      showToast("error", "Failed to submit return request.");
    }
  };

  const getReturnStatus = (orderId, productId) => {
    const req = returns.find(
      (r) =>
        r.order?._id === orderId &&
        r.product?._id === productId
    );
    return req ? req.status : null;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader className="animate-spin mr-2" /> Loading orders...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* ✅ Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

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

              {order.items.map((item) => {
                const returnStatus = getReturnStatus(order._id, item.product._id);
                return (
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
                      {order.status === "Delivered" && !returnStatus && (
                        <button
                          onClick={() => openReturnModal(order._id, item.product)}
                          className="text-sm text-red-600 underline"
                        >
                          Request Return
                        </button>
                      )}
                      {returnStatus && (
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            returnStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : returnStatus === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {returnStatus}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between mt-4 font-semibold">
                <span>Total:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧾 Return Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-3">Request a Return</h2>
            <p className="text-sm text-gray-600 mb-4">
              Product: <b>{selectedItem?.product?.name}</b>
            </p>
            <form onSubmit={handleReturnSubmit} className="space-y-3">
              <textarea
                placeholder="Enter reason for return..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
