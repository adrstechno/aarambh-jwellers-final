import { useEffect, useState } from "react";
import { getUserReturns } from "../api/returnApi";
import { getUserRefunds } from "../api/refundApi";
import { useApp } from "../context/AppContext";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function MyRefunds() {
  const { user } = useApp();
  const [returns, setReturns] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [returnRes, refundRes] = await Promise.all([
          getUserReturns(user.token),
          getUserRefunds(user.token),
        ]);

        // Handle both array and object API responses
        const returnData = Array.isArray(returnRes)
          ? returnRes
          : returnRes?.data || [];

        const refundData = Array.isArray(refundRes)
          ? refundRes
          : refundRes?.data || [];

        setReturns(returnData);
        setRefunds(refundData);
      } catch (err) {
        console.error("❌ Error loading refunds:", err);
        showToast("error", "Failed to load refund data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user?.token]);

  // Match refunds based on order + product
  const getRefundForReturn = (orderId, productId) => {
    return refunds.find(
      (r) =>
        String(r.order?._id) === String(orderId) &&
        String(r.product?._id) === String(productId)
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader className="animate-spin mr-2" /> Loading refund data...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
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

      <h1 className="text-3xl font-bold mb-6">My Returns & Refunds</h1>

      {returns.length === 0 ? (
        <p className="text-gray-500">No return requests yet.</p>
      ) : (
        <div className="space-y-6">
          {returns.map((r) => {
            const refund = getRefundForReturn(r.order?._id, r.product?._id);

            return (
              <div
                key={r._id}
                className="bg-white p-6 shadow rounded-lg border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-lg">
                    {r.product?.name || "Unnamed Product"}
                  </h2>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      r.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Requested on:{" "}
                  {new Date(r.createdAt).toLocaleDateString()} <br />
                  Reason: {r.reason}
                </p>

                {refund ? (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-700">
                      <b>Refund ID:</b> {refund._id}
                    </p>
                    <p className="text-sm text-gray-700">
                      <b>Amount:</b> ₹{refund.refundAmount || 0}
                    </p>
                    <p className="text-sm text-gray-700">
                      <b>Method:</b> {refund.refundMethod}
                    </p>
                    <p className="text-sm text-gray-700">
                      <b>Status:</b>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          refund.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : refund.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {refund.status}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No refund processed yet.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
