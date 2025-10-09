import { useState, useEffect, useRef } from "react";
import {
  Star,
  Eye,
  Trash2,
  Search,
  MoreVertical,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getPaginatedReviews,
  getTopRatedProducts,
  updateReviewStatus,
  deleteReview,
} from "../../api/reviewApi";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewReview, setViewReview] = useState(null);
  const [actionReview, setActionReview] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });
  const dropdownRef = useRef(null);

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch reviews with pagination
  const fetchReviews = async (pageNum = 1) => {
    try {
      const { reviews, total, totalPages } = await getPaginatedReviews(pageNum);
      setReviews(reviews);
      setTotalPages(totalPages);
      setTotalReviews(total);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      showToast("error", "Failed to load reviews.");
    }
  };

  // ✅ Fetch top-rated products
  const fetchTopRatedProducts = async () => {
    try {
      const data = await getTopRatedProducts();
      setTopProducts(data);
    } catch (err) {
      console.error("Error fetching top-rated products:", err);
    }
  };

  useEffect(() => {
    fetchReviews(page);
    fetchTopRatedProducts();
  }, [page]);

  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const { review } = await updateReviewStatus(id, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? review : r))
      );
      showToast("success", `Review marked as ${newStatus}`);
    } catch (err) {
      console.error("Failed to update review status:", err);
      showToast("error", "Failed to update review status.");
    }
  };

  // ✅ Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      showToast("success", "Review deleted successfully!");
    } catch (err) {
      console.error("Failed to delete review:", err);
      showToast("error", "Failed to delete review.");
    }
  };

  // ✅ Export CSV
  const exportToCSV = () => {
    if (reviews.length === 0) return showToast("error", "No reviews to export.");

    const headers = [
      "Review ID",
      "User",
      "Product",
      "Rating",
      "Comment",
      "Status",
      "Date",
    ];
    const rows = reviews.map((r) => [
      r._id,
      r.user?.name || "N/A",
      r.product?.name || "N/A",
      r.rating,
      `"${r.comment?.replace(/"/g, "'")}"`,
      r.status,
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "reviews.csv";
    link.click();
    showToast("success", "Reviews exported successfully!");
  };

  // ✅ Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ✅ Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActionReview(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 relative">
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

      {/* ⭐ Top Rated Products Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {topProducts.length > 0 ? (
          topProducts.map((p) => (
            <div
              key={p._id._id}
              className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {p._id?.name || "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  {p.count} Reviews
                </p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star fill="#facc15" size={18} />
                <span className="font-semibold text-gray-800">
                  {p.avgRating.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-400">
            No top-rated products found.
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Manage Reviews</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user, product, comment"
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
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">Review ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Rating</th>
              <th className="py-3 px-6 text-left">Comment</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs text-gray-500">
                    {r._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-6">{r.user?.name || "N/A"}</td>
                  <td className="py-3 px-6">{r.product?.name || "N/A"}</td>
                  <td className="py-3 px-6 flex items-center gap-1 text-yellow-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" />
                    ))}
                  </td>
                  <td className="py-3 px-6 truncate max-w-xs">
                    {r.comment || "—"}
                  </td>
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
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="py-3 px-6 text-center relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setActionReview(actionReview === r._id ? null : r._id)
                      }
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {actionReview === r._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg z-10 animate-fadeIn">
                        <button
                          onClick={() => {
                            setViewReview(r);
                            setActionReview(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4 text-blue-600" /> View Details
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center text-gray-500 italic"
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          Showing{" "}
          <b>{(page - 1) * 10 + 1}</b>–<b>{Math.min(page * 10, totalReviews)}</b>{" "}
          of <b>{totalReviews}</b> reviews
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-lg flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-lg flex items-center gap-1 disabled:opacity-50"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ✅ View Review Modal */}
      {viewReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setViewReview(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-4">Review Details</h2>
            <p><b>User:</b> {viewReview.user?.name || "N/A"}</p>
            <p><b>Product:</b> {viewReview.product?.name || "N/A"}</p>
            <p><b>Rating:</b> {viewReview.rating} ⭐</p>
            <p><b>Status:</b> {viewReview.status}</p>
            <p className="mt-3"><b>Comment:</b></p>
            <p className="text-gray-700 bg-gray-50 p-2 rounded-md">
              {viewReview.comment || "No comment provided."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
