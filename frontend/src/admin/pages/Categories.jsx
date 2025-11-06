/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getCategoriesWithCount,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../../api/categoryApi.js";

const API_BASE = import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", parentCategory: "", image: null });
  const [editedCategory, setEditedCategory] = useState({ name: "", parentCategory: "", image: null });

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategoriesWithCount();
      const sorted = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setCategories(sorted);
    } catch (err) {
      console.error("❌ Failed to load categories", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Handle image upload
  const handleImageUpload = (e, setFn, category) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Only image files allowed!");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB!");
    setFn({ ...category, image: { file, preview: URL.createObjectURL(file) } });
  };

  // 🔹 Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) return toast.error("Category name cannot be empty!");
    if (!newCategory.image?.file) return toast.error("Please upload a category image!");

    const loadingToast = toast.loading("Adding category...");
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      if (newCategory.parentCategory)
        formData.append("parentCategory", newCategory.parentCategory);
      formData.append("image", newCategory.image.file);

      await addCategory(formData);
      toast.dismiss(loadingToast);
      toast.success("✅ Category added successfully!");
      setNewCategory({ name: "", parentCategory: "", image: null });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("❌ Failed to add category.");
    }
  };

// ✅ True centered custom delete confirmation modal (independent of toast container)
const handleDelete = (id, name) => {
  // Create a custom portal element for the modal
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]";
  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
  };

  // Render modal manually
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm text-center border border-gray-200 animate-enter">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
      <p class="text-gray-600 text-sm mb-6 leading-relaxed">
        Are you sure you want to delete <span class="font-semibold text-red-600">"${name}"</span>?<br />
        This action cannot be undone.
      </p>
      <div class="flex justify-center gap-3">
        <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition">Delete</button>
        <button id="cancelDelete" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition">Cancel</button>
      </div>
    </div>
  `;

  // Bind actions
  modal.querySelector("#cancelDelete").onclick = closeModal;

  modal.querySelector("#confirmDelete").onclick = async () => {
    closeModal();
    const loadingToast = toast.loading(`Deleting "${name}"...`);
    try {
      await deleteCategory(id);
      toast.dismiss(loadingToast);
      toast.success(`✅ "${name}" deleted successfully!`);
      fetchCategories();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("❌ Failed to delete:", err);
      toast.error("Failed to delete category.");
    }
  };
};



  // 🔹 Edit category modal open
  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setEditedCategory({
      ...cat,
      image: cat.image
        ? cat.image.startsWith("http")
          ? cat.image
          : `${API_BASE}${cat.image}`
        : null,
    });
  };

  // 🔹 Save edit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editedCategory.name.trim()) return toast.error("Category name cannot be empty!");

    const loadingToast = toast.loading("Updating category...");
    try {
      const formData = new FormData();
      formData.append("name", editedCategory.name);
      if (editedCategory.parentCategory)
        formData.append("parentCategory", editedCategory.parentCategory);
      if (editedCategory.image?.file)
        formData.append("image", editedCategory.image.file);

      await updateCategory(editingId, formData);
      toast.dismiss(loadingToast);
      toast.success("✅ Category updated successfully!");
      setEditingId(null);
      setEditedCategory({ name: "", parentCategory: "", image: null });
      fetchCategories();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("❌ Failed to update category.");
    }
  };

  // 🔹 Handle drag reorder
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(categories);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((cat, index) => ({
      ...cat,
      order: index,
    }));
    setCategories(updated);

    try {
      const payload = updated.map((c) => ({ _id: c._id, order: c.order }));
      await reorderCategories(payload, localStorage.getItem("token"));
      toast.success("✅ Categories reordered successfully!");
    } catch (err) {
      console.error("❌ Reorder failed:", err);
      toast.error("Failed to update order.");
      fetchCategories(); // Revert list on error
    }
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Table with reorder */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <table
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-10"></th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Parent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Products</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filtered.map((cat, index) => (
                    <Draggable key={cat._id} draggableId={cat._id} index={index}>
                      {(provided, snapshot) => (
                        <motion.tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${
                            snapshot.isDragging
                              ? "bg-gray-100 shadow-xl scale-[1.01]"
                              : "hover:bg-gray-50"
                          }`}
                          transition={{ duration: 0.2 }}
                        >
                          <td {...provided.dragHandleProps} className="text-gray-400 pl-3 cursor-grab">
                            <GripVertical size={16} />
                          </td>
                          <td className="px-4 py-2">
                            {cat.image ? (
                              <img
                                src={
                                  cat.image.startsWith("http")
                                    ? cat.image
                                    : `${API_BASE}${cat.image}`
                                }
                                alt={cat.name}
                                className="w-14 h-14 rounded object-cover border"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-200 rounded"></div>
                            )}
                          </td>
                          <td className="px-4 py-2">{cat.name}</td>
                          <td className="px-4 py-2 text-gray-500">
                            {cat.parentCategory?.name || "—"}
                          </td>
                          <td className="px-4 py-2 text-gray-500">{cat.slug}</td>
                          <td className="px-4 py-2 text-center text-gray-600">
                            {cat.productCount || 0}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleEdit(cat)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat._id, cat.name)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 🧩 Add Category Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="grid gap-3">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={newCategory.parentCategory}
                onChange={(e) => setNewCategory({ ...newCategory, parentCategory: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">No Parent (Main)</option>
                {categories
                  .filter((c) => !c.parentCategory)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} /> Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setNewCategory, newCategory)}
                  className="px-2 py-1 border rounded-lg"
                />
                {newCategory.image && (
                  <img
                    src={newCategory.image.preview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 🧩 Edit Category Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
          >
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <form onSubmit={handleSave} className="grid gap-3">
              <input
                type="text"
                value={editedCategory.name}
                onChange={(e) =>
                  setEditedCategory({ ...editedCategory, name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={editedCategory.parentCategory || ""}
                onChange={(e) =>
                  setEditedCategory({ ...editedCategory, parentCategory: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">No Parent (Main)</option>
                {categories
                  .filter((c) => !c.parentCategory)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} /> Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, setEditedCategory, editedCategory)
                  }
                  className="px-2 py-1 border rounded-lg"
                />
                {editedCategory.image && (
                  <img
                    src={
                      editedCategory.image.preview
                        ? editedCategory.image.preview
                        : editedCategory.image
                    }
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
