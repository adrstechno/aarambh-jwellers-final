/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getAllDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../../api/discountApi";

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDiscount, setEditDiscount] = useState(null);
  const [deleteDiscountData, setDeleteDiscountData] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "Percentage",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    status: "Active",
    description: "",
  });

  // ✅ Toast Helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch Discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await getAllDiscounts();
        setDiscounts(data);
      } catch (err) {
        console.error("Error fetching discounts:", err);
        showToast("error", "Failed to load discounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  // ✅ Add New Discount
  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      const data = await addDiscount(newDiscount);
      setDiscounts((prev) => [...prev, data.discount]);
      showToast("success", "Discount added successfully!");
      setShowForm(false);
      setNewDiscount({
        code: "",
        type: "Percentage",
        value: "",
        minPurchase: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        status: "Active",
        description: "",
      });
    } catch (err) {
      console.error("Error adding discount:", err);
      showToast("error", "Failed to add discount.");
    }
  };

  // ✅ Update Discount
  const handleEditDiscountSubmit = async (e) => {
    e.preventDefault();
    try {
      const { discount } = await updateDiscount(editDiscount._id, editDiscount);
      setDiscounts((prev) =>
        prev.map((d) => (d._id === discount._id ? discount : d))
      );
      showToast("success", "Discount updated successfully!");
      setEditDiscount(null);
    } catch (err) {
      console.error("Error updating discount:", err);
      showToast("error", "Failed to update discount.");
    }
  };

  // ✅ Delete Discount
  const confirmDelete = async () => {
    if (!deleteDiscountData) return;
    try {
      await deleteDiscount(deleteDiscountData._id);
      setDiscounts((prev) =>
        prev.filter((d) => d._id !== deleteDiscountData._id)
      );
      showToast("success", "Discount deleted successfully!");
    } catch (err) {
      console.error("Error deleting discount:", err);
      showToast("error", "Failed to delete discount.");
    } finally {
      setDeleteDiscountData(null);
    }
  };

  // ✅ Toggle Status
  const handleToggleStatus = async (id) => {
    try {
      const { discount } = await toggleDiscountStatus(id);
      setDiscounts((prev) =>
        prev.map((d) => (d._id === discount._id ? discount : d))
      );
      showToast("success", "Status updated successfully!");
    } catch (err) {
      console.error("Error toggling status:", err);
      showToast("error", "Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading discounts...</div>
    );

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Discount Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-5 h-5" /> Add Discount
        </button>
      </div>

      {/* Discounts Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Value</th>
              <th className="py-3 px-6 text-left">Min Purchase</th>
              <th className="py-3 px-6 text-left">Max Discount</th>
              <th className="py-3 px-6 text-left">Validity</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {discounts.length > 0 ? (
              discounts.map((d) => (
                <tr key={d._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs text-gray-600">
                    {d.code}
                  </td>
                  <td className="py-3 px-6">{d.type}</td>
                  <td className="py-3 px-6">
                    {d.type === "Percentage" ? `${d.value}%` : `₹${d.value}`}
                  </td>
                  <td className="py-3 px-6">₹{d.minPurchase || 0}</td>
                  <td className="py-3 px-6">
                    {d.maxDiscount ? `₹${d.maxDiscount}` : "—"}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500">
                    {new Date(d.startDate).toLocaleDateString()} →{" "}
                    {new Date(d.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleToggleStatus(d._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        d.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status === "Active" ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {d.status}
                    </button>
                  </td>
                  <td className="py-3 px-6 flex justify-center gap-3">
                    <button
                      onClick={() => setEditDiscount(d)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteDiscountData(d)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No discounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🧩 Add Discount Modal */}
      {showForm && (
        <DiscountForm
          title="Add Discount"
          discount={newDiscount}
          setDiscount={setNewDiscount}
          onSubmit={handleAddDiscount}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* ✏️ Edit Discount Modal */}
      {editDiscount && (
        <DiscountForm
          title="Edit Discount"
          discount={editDiscount}
          setDiscount={setEditDiscount}
          onSubmit={handleEditDiscountSubmit}
          onClose={() => setEditDiscount(null)}
        />
      )}

      {/* 🗑️ Delete Modal */}
      {deleteDiscountData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Discount?</h3>
            <p className="text-gray-600 mb-4">{deleteDiscountData.code}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteDiscountData(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🧱 Reusable Form Component
function DiscountForm({ title, discount, setDiscount, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Discount Code"
            value={discount.code}
            onChange={(e) =>
              setDiscount({ ...discount, code: e.target.value.toUpperCase() })
            }
            required
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={discount.type}
            onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="Percentage">Percentage</option>
            <option value="Flat">Flat</option>
          </select>

          <input
            type="number"
            placeholder="Value"
            value={discount.value}
            onChange={(e) => setDiscount({ ...discount, value: e.target.value })}
            required
            className="px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Minimum Purchase Amount"
            value={discount.minPurchase}
            onChange={(e) =>
              setDiscount({ ...discount, minPurchase: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Maximum Discount Amount"
            value={discount.maxDiscount}
            onChange={(e) =>
              setDiscount({ ...discount, maxDiscount: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} /> Start Date
              </label>
              <input
                type="date"
                value={discount.startDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setDiscount({ ...discount, startDate: e.target.value })
                }
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} /> End Date
              </label>
              <input
                type="date"
                value={discount.endDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setDiscount({ ...discount, endDate: e.target.value })
                }
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
          </div>

          <textarea
            placeholder="Description"
            value={discount.description}
            onChange={(e) =>
              setDiscount({ ...discount, description: e.target.value })
            }
            rows={3}
            className="px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
