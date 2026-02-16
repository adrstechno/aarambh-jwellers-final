/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Maximize2,
} from "lucide-react";
import {
  getAllGifts,
  addGift,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../../api/giftApi";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const SERVER_URL = API_BASE.replace("/api", ""); // ✅ Used for displaying image URLs

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editGift, setEditGift] = useState(null);
  const [deleteGiftData, setDeleteGiftData] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [imageError, setImageError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [newGift, setNewGift] = useState({
    name: "",
    code: "",
    description: "",
    conditionType: "None",
    conditionValue: "",
    stock: "",
    status: "Active",
    image: null,
  });

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch gifts
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const data = await getAllGifts();
        setGifts(data);
      } catch (err) {
        console.error("Error fetching gifts:", err);
        showToast("error", "Failed to load gifts.");
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  // ✅ Image Upload Handler
  const handleImageUpload = (e, setFn, gift) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must not exceed 2MB.");
        return;
      }
      setImageError("");
      setFn({
        ...gift,
        image: {
          file,
          preview: URL.createObjectURL(file),
        },
      });
    }
  };

  // ✅ Add new gift
  const handleAddGift = async (e) => {
    e.preventDefault();
    if (!newGift.name || !newGift.code) {
      showToast("error", "Please fill in all required fields.");
      return;
    }
    try {
      const data = await addGift(newGift);
      setGifts((prev) => [...prev, data.gift]);
      showToast("success", "Gift added successfully!");
      setShowForm(false);
      setNewGift({
        name: "",
        code: "",
        description: "",
        conditionType: "None",
        conditionValue: "",
        stock: "",
        status: "Active",
        image: null,
      });
    } catch (err) {
      console.error("Error adding gift:", err);
      showToast("error", "Failed to add gift.");
    }
  };

  // ✅ Update gift
  const handleEditGiftSubmit = async (e) => {
    e.preventDefault();
    try {
      const { gift } = await updateGift(editGift._id, editGift);
      setGifts((prev) => prev.map((g) => (g._id === gift._id ? gift : g)));
      showToast("success", "Gift updated successfully!");
      setEditGift(null);
    } catch (err) {
      console.error("Error updating gift:", err);
      showToast("error", "Failed to update gift.");
    }
  };

  // ✅ Delete gift
  const confirmDelete = async () => {
    if (!deleteGiftData) return;
    try {
      await deleteGift(deleteGiftData._id);
      setGifts((prev) => prev.filter((g) => g._id !== deleteGiftData._id));
      showToast("success", "Gift deleted successfully!");
    } catch (err) {
      console.error("Error deleting gift:", err);
      showToast("error", "Failed to delete gift.");
    } finally {
      setDeleteGiftData(null);
    }
  };

  // ✅ Toggle status
  const handleToggleStatus = async (id) => {
    try {
      const { gift } = await toggleGiftStatus(id);
      setGifts((prev) => prev.map((g) => (g._id === gift._id ? gift : g)));
      showToast("success", "Status updated successfully!");
    } catch (err) {
      console.error("Error toggling status:", err);
      showToast("error", "Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading gifts...</div>
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
        <h1 className="text-2xl font-bold">Gift Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-5 h-5" /> Add Gift
        </button>
      </div>

      {/* Gifts Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Condition</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {gifts.length > 0 ? (
              gifts.map((g) => (
                <tr key={g._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    {g.image ? (
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setPreviewImage(SERVER_URL + g.image)}
                      >
                        <img
                          src={SERVER_URL + g.image}
                          alt={g.name}
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                          className="h-12 w-12 rounded object-cover border border-gray-300 hover:opacity-80 transition"
                        />
                        <Maximize2
                          className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 text-white bg-black/40 rounded-full p-1 transition"
                          size={16}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-medium">{g.name}</td>
                  <td className="py-3 px-6">{g.code}</td>
                  <td className="py-3 px-6 text-sm text-gray-500">
                    {g.conditionType === "None"
                      ? "—"
                      : `${g.conditionType}: ${g.conditionValue}`}
                  </td>
                  <td className="py-3 px-6">{g.stock || 0}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleToggleStatus(g._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        g.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {g.status === "Active" ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {g.status}
                    </button>
                  </td>
                  <td className="py-3 px-6 flex justify-center gap-3">
                    <button
                      onClick={() => setEditGift(g)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteGiftData(g)}
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
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No gifts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🖼️ Full Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-8 right-0 text-white hover:text-red-400"
            >
              <X size={28} />
            </button>
            <img
              src={previewImage}
              alt="Full view"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <GiftForm
          title="Add Gift"
          gift={newGift}
          setGift={setNewGift}
          onSubmit={handleAddGift}
          onClose={() => setShowForm(false)}
          handleImageUpload={handleImageUpload}
        />
      )}
      {editGift && (
        <GiftForm
          title="Edit Gift"
          gift={editGift}
          setGift={setEditGift}
          onSubmit={handleEditGiftSubmit}
          onClose={() => setEditGift(null)}
          handleImageUpload={handleImageUpload}
        />
      )}

      {/* Delete Confirmation */}
      {deleteGiftData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Gift?</h3>
            <p className="text-gray-600 mb-4">{deleteGiftData.name}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteGiftData(null)}
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

// 🧱 Reusable Gift Form
function GiftForm({
  title,
  gift,
  setGift,
  onSubmit,
  onClose,
  handleImageUpload,
}) {
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
            placeholder="Gift Name"
            value={gift.name}
            onChange={(e) => setGift({ ...gift, name: e.target.value })}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Gift Code"
            value={gift.code}
            onChange={(e) =>
              setGift({ ...gift, code: e.target.value.toUpperCase() })
            }
            required
            className="px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={gift.description}
            onChange={(e) => setGift({ ...gift, description: e.target.value })}
            rows={3}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={gift.conditionType}
            onChange={(e) =>
              setGift({ ...gift, conditionType: e.target.value })
            }
            className="px-4 py-2 border rounded-lg"
          >
            <option value="None">No Condition</option>
            <option value="Amount">On Purchase Amount</option>
            <option value="Product">Specific Product</option>
            <option value="Category">Specific Category</option>
          </select>
          {gift.conditionType !== "None" && (
            <input
              type="text"
              placeholder="Condition Value"
              value={gift.conditionValue}
              onChange={(e) =>
                setGift({ ...gift, conditionValue: e.target.value })
              }
              className="px-4 py-2 border rounded-lg"
            />
          )}
          <input
            type="number"
            placeholder="Stock Quantity"
            value={gift.stock}
            onChange={(e) => setGift({ ...gift, stock: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon size={18} /> Gift Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setGift, gift)}
              className="px-2 py-1 border rounded-lg"
            />
            {gift.image?.preview && (
              <img
                src={gift.image.preview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded mt-2"
              />
            )}
          </div>
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
