/* eslint-disable no-unused-vars */
// src/admin/pages/Banners.jsx
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from "../../api/bannerApi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    link: "",
    active: true,
    image: null,
  });

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Load banners (admin)
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
      setFilteredBanners(data);
    } catch (err) {
      showToast("error", "Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Filter banners
  useEffect(() => {
    let result = [...banners];
    if (search.trim()) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.subtitle?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus !== "All") {
      result = result.filter((b) =>
        filterStatus === "Active" ? b.active : !b.active
      );
    }
    setFilteredBanners(result);
  }, [search, filterStatus, banners]);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else if (name === "active") setForm({ ...form, active: value === "true" });
    else setForm({ ...form, [name]: value });
  };

  // ✅ Submit Add/Edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editing) {
        await updateBanner(editing._id, form);
        showToast("success", "Banner updated successfully!");
      } else {
        await addBanner(form);
        showToast("success", "Banner added successfully!");
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: "", subtitle: "", link: "", active: true, image: null });
      fetchBanners();
    } catch {
      showToast("error", "Failed to save banner.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (banner) => {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      link: banner.link || "/",
      active: banner.active,
      image: null,
    });
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      setBanners(banners.filter((b) => b._id !== id));
      showToast("success", "Banner deleted successfully!");
    } catch {
      showToast("error", "Failed to delete banner.");
    }
  };

  // ✅ Toggle active/inactive
  const toggleStatus = async (banner) => {
    try {
      const newActive = !banner.active;
      await updateBanner(banner._id, { active: newActive });
      setBanners((prev) =>
        prev.map((b) =>
          b._id === banner._id ? { ...b, active: newActive } : b
        )
      );
      showToast(
        "success",
        `Banner ${newActive ? "Activated" : "Deactivated"}`
      );
    } catch {
      showToast("error", "Failed to update status.");
    }
  };

  // ✅ Handle drag-and-drop reorder
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(filteredBanners);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update local order visually
    setFilteredBanners(reordered);

    // Persist new order to backend
    try {
      const reorderedList = reordered.map((b, idx) => ({
        _id: b._id,
        order: idx,
      }));
      await reorderBanners({ banners: reorderedList });
      showToast("success", "Order updated successfully!");
      fetchBanners();
    } catch (err) {
      console.error("❌ Error reordering:", err);
      showToast("error", "Failed to update order.");
    }
  };

  return (
    <div className="p-6">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Banners</h1>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search banners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-56"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={() => {
              setShowModal(true);
              setEditing(null);
              setForm({
                title: "",
                subtitle: "",
                link: "",
                active: true,
                image: null,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Table with drag-and-drop */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="banners">
            {(provided) => (
              <table
                className="min-w-full table-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-6 text-left">Order</th>
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Subtitle</th>
                    <th className="py-3 px-6 text-left">Image</th>
                    <th className="py-3 px-6 text-left">Active</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {filteredBanners.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500"
                      >
                        No banners found.
                      </td>
                    </tr>
                  ) : (
                    filteredBanners.map((banner, index) => (
                      <Draggable
                        key={banner._id}
                        draggableId={banner._id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border-b hover:bg-gray-50 cursor-move"
                          >
                            <td className="py-3 px-6 font-semibold">
                              {index + 1}
                            </td>
                            <td className="py-3 px-6">{banner.title}</td>
                            <td className="py-3 px-6">
                              {banner.subtitle || "-"}
                            </td>
                            <td className="py-3 px-6">
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-24 h-12 object-cover rounded"
                              />
                            </td>
                            <td className="py-3 px-6">
                              <button onClick={() => toggleStatus(banner)}>
                                {banner.active ? (
                                  <ToggleRight className="w-6 h-6 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-6 text-center space-x-3">
                              <button
                                onClick={() => handleEdit(banner)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(banner._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Banner" : "Add Banner"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Banner Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="link"
                placeholder="Redirect Link (e.g. /category/necklace)"
                value={form.link}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="active"
                value={form.active}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-full h-40 object-cover mt-3 rounded-lg"
                  />
                ) : (
                  editing?.image && (
                    <img
                      src={editing.image}
                      alt="Existing"
                      className="w-full h-40 object-cover mt-3 rounded-lg"
                    />
                  )
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                {loading ? "Saving..." : editing ? "Update Banner" : "Add Banner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
