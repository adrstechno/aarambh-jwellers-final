import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  MoreVertical,
  X,
  Download,
} from "lucide-react";
import {
  getAllRefunds,
  updateRefundStatus,
  deleteRefund,
} from "../../api/refundApi";

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewRefund, setViewRefund] = useState(null);
  const [actionRefund, setActionRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const dropdownRef = useRef(null);

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch refunds
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const data = await getAllRefunds();
        setRefunds(data);
      } catch (err) {
        console.error("Error fetching refunds:", err);
        showToast("error", "Failed to load refunds.");
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  // ✅ Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActionRefund(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle status update
  const handleStatusChange = async (id, status) => {
    try {
      const { refund } = await updateRefundStatus(id, { status });
      setRefunds((prev) =>
        prev.map((r) => (r._id === refund._id ? refund : r))
      );
      showToast("success", `Refund status changed to ${status}`);
    } catch (err) {
      console.error("Error updating refund status:", err);
      showToast("error", "Failed to update refund status.");
    }
  };

  // ✅ Delete refund
  const handleDeleteRefund = async (id) => {
    if (!window.confirm("Are you sure you want to delete this refund?")) return;
    try {
      await deleteRefund(id);
      setRefunds((prev) => prev.filter((r) => r._id !== id));
      showToast("success", "Refund deleted successfully!");
    } catch (err) {
      console.error("Error deleting refund:", err);
      showToast("error", "Failed to delete refund.");
    }
  };

  // ✅ Export refunds CSV
  const exportRefundsCSV = () => {
    if (refunds.length === 0) return showToast("error", "No refunds to export.");

    const headers = [
      "Refund ID",
      "Order ID",
      "User",
      "Product",
      "Reason",
      "Amount",
      "Method",
      "Status",
      "Date",
    ];
    const rows = refunds.map((r) => [
      r._id,
      r.order?._id || "N/A",
      r.user?.name || "N/A",
      r.product?.name || "N/A",
      `"${r.reason?.replace(/"/g, "'")}"`,
      r.refundAmount,
      r.refundMethod,
      r.status,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "refunds.csv";
    link.click();
    showToast("success", "Refunds exported successfully!");
  };

  // ✅ Filter refunds
  const filteredRefunds = refunds.filter((r) => {
    const matchSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.order?._id?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading refunds...</div>;

  return (
    <div className="p-6 relative">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Return & Refund Management</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order, user, or reason"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Refunded">Refunded</option>
          </select>
          <button
            onClick={exportRefundsCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">Refund ID</th>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Method</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredRefunds.length > 0 ? (
              filteredRefunds.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs text-gray-500">
                    {r._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-6">{r.order?._id || "N/A"}</td>
                  <td className="py-3 px-6">{r.user?.name || "N/A"}</td>
                  <td className="py-3 px-6">{r.product?.name || "N/A"}</td>
                  <td className="py-3 px-6 truncate max-w-xs">{r.reason}</td>
                  <td className="py-3 px-6 font-semibold">₹{r.refundAmount}</td>
                  <td className="py-3 px-6">{r.refundMethod}</td>
                  <td className="py-3 px-6">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                        r.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : r.status === "Refunded"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setActionRefund(actionRefund === r._id ? null : r._id)
                      }
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {actionRefund === r._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg z-10">
                        <button
                          onClick={() => {
                            setViewRefund(r);
                            setActionRefund(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4 text-blue-600" /> View Details
                        </button>
                        <button
                          onClick={() => handleDeleteRefund(r._id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 italic">
                  No refunds found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ View Refund Modal */}
      {viewRefund && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setViewRefund(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4">Refund Details</h2>
            <p><b>Order ID:</b> {viewRefund.order?._id}</p>
            <p><b>User:</b> {viewRefund.user?.name}</p>
            <p><b>Product:</b> {viewRefund.product?.name || "N/A"}</p>
            <p><b>Amount:</b> ₹{viewRefund.refundAmount}</p>
            <p><b>Method:</b> {viewRefund.refundMethod}</p>
            <p><b>Status:</b> {viewRefund.status}</p>
            <p><b>Reason:</b> {viewRefund.reason}</p>
            {viewRefund.adminNote && <p><b>Admin Note:</b> {viewRefund.adminNote}</p>}
            <p><b>Date:</b> {new Date(viewRefund.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
