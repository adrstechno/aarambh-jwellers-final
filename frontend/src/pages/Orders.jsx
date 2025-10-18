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

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch user orders (Safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserOrders(user?.token, user?._id);
        // backend returns an array directly
        setOrders(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchData();
  }, [user?._id]);

  // ✅ Handle return request
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

  // ✅ Get return status
  const getReturnStatus = (orderId, productId) => {
    const req = returns.find(
      (r) => r.order?._id === orderId && r.product?._id === productId
    );
    return req ? req.status : null;
  };

  // ✅ Fix image URLs safely
  const fixImage = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader className="animate-spin mr-2" /> Loading your orders...
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
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-8">
          {(orders || []).map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow border border-gray-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Products */}
              <div className="divide-y">
                {(order.products || []).map((item) => {
                  const returnStatus = getReturnStatus(order._id, item.product?._id);
                  const image = fixImage(item.product?.image);

                  return (
                    <div
                      key={item.product?._id || Math.random()}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={item.product?.name || "Product"}
                          className="w-16 h-16 rounded object-cover border"
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                        />
                        <div>
                         <p className="font-medium text-gray-800">
  {item.product?.name || item.name || "Unnamed Product"}
</p>
                          <p className="text-gray-500 text-sm">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {order.status === "Delivered" && !returnStatus && (
                          <button
                            onClick={() =>
                              openReturnModal(order._id, item.product)
                            }
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
              </div>

              {/* Summary */}
              <div className="flex justify-between mt-4 font-semibold text-gray-800">
                <span>Total Amount:</span>
                <span>₹{order.total?.toLocaleString() || 0}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Payment Method:{" "}
                <span className="font-medium">
                  {order.paymentMethod || "COD"}
                </span>
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
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
