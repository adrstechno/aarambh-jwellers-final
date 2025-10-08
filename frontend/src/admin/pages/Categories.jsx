/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  CheckCircle,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import {
  getCategoriesWithCount,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

const API_BASE = import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ name: "" });
  const [viewCategory, setViewCategory] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategoriesWithCount();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Image upload handler
  const handleImageUpload = (e, setFn, category) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    setError("");
    setFn({
      ...category,
      image: { file, preview: URL.createObjectURL(file) },
    });
  };

  // 🔹 Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      if (newCategory.parentCategory)
        formData.append("parentCategory", newCategory.parentCategory);
      if (newCategory.image?.file)
        formData.append("image", newCategory.image.file);

      await addCategory(formData);
      setNewCategory({ name: "", parentCategory: "", image: null });
      setError("");
      setSuccess("✅ Category added successfully");
      fetchCategories();
      setTimeout(() => setSuccess(""), 2500);
      setShowForm(false);
    } catch (err) {
      setError("Failed to add category.");
    }
  };

  // 🔹 Delete category
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // 🔹 Edit category
  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setEditedCategory({ name: cat.name });
  };

  const handleSave = async (id) => {
    if (!editedCategory.name.trim()) return;
    try {
      await updateCategory(id, editedCategory);
      setEditingId(null);
      setEditedCategory({ name: "" });
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category", err);
    }
  };

  // 🔍 Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Count */}
      <p className="text-gray-500 mb-4">
        Showing <strong>{filteredCategories.length}</strong> categories
      </p>

      {/* Category Grid */}
      {filteredCategories.length > 0 ? (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white shadow-md rounded-lg p-5 relative flex flex-col justify-between hover:shadow-lg transition ${
                  editingId === cat._id
                    ? "border-2 border-yellow-400 bg-yellow-50"
                    : ""
                }`}
              >
                {cat.image && (
                  <img
                    src={
                      cat.image.startsWith("http")
                        ? cat.image
                        : `${API_BASE}${cat.image}`
                    }
                    alt={cat.name}
                    className="h-32 w-full object-cover rounded mb-3"
                  />
                )}

                <span className="absolute top-3 right-3 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {cat.productCount || 0}{" "}
                  {cat.productCount === 1 ? "product" : "products"}
                </span>

                {editingId === cat._id ? (
                  <div className="flex flex-col gap-2 mb-4">
                    <input
                      type="text"
                      value={editedCategory.name}
                      onChange={(e) =>
                        setEditedCategory({
                          ...editedCategory,
                          name: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(cat._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Save size={16} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold">{cat.name}</h2>
                    {cat.parentCategory && (
                      <p className="text-sm text-gray-500">
                        Parent: {cat.parentCategory.name}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mb-4">
                      Slug: {cat.slug}
                    </p>

                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setViewCategory(cat)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No categories found.
        </div>
      )}

      {/* 🧩 Add Category Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="grid gap-3">
              {/* Name */}
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />

              {/* Parent Category */}
              <select
                value={newCategory.parentCategory}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    parentCategory: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">No Parent (Main Category)</option>
                {categories
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} /> Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, setNewCategory, newCategory)
                  }
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

              {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
              {success && (
                <p className="text-sm text-green-600 mb-2">{success}</p>
              )}

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

      {/* 🧾 View Category Modal */}
      {viewCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
          >
            <h2 className="text-xl font-bold mb-4">Category Details</h2>

            {viewCategory.image && (
              <img
                src={
                  viewCategory.image.startsWith("http")
                    ? viewCategory.image
                    : `${API_BASE}${viewCategory.image}`
                }
                alt={viewCategory.name}
                className="h-32 w-full object-cover rounded mb-3"
              />
            )}

            <p>
              <strong>Name:</strong> {viewCategory.name}
            </p>
            {viewCategory.parentCategory && (
              <p>
                <strong>Parent:</strong> {viewCategory.parentCategory.name}
              </p>
            )}
            <p>
              <strong>Slug:</strong> {viewCategory.slug}
            </p>
            <p>
              <strong>Products:</strong> {viewCategory.productCount || 0}
            </p>

            <button
              onClick={() => setViewCategory(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}

      {/* 🧩 Edit Category Modal */}
{editingId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[80vh] overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData();
          formData.append("name", editedCategory.name);
          if (editedCategory.parentCategory)
            formData.append("parentCategory", editedCategory.parentCategory);
          if (editedCategory.image?.file)
            formData.append("image", editedCategory.image.file);

          try {
            await updateCategory(editingId, formData);
            setEditingId(null);
            setEditedCategory({ name: "", parentCategory: "", image: null });
            fetchCategories();
            setSuccess("✅ Category updated successfully");
            setTimeout(() => setSuccess(""), 2500);
          } catch (err) {
            setError("Failed to update category.");
          }
        }}
        className="grid gap-3"
      >
        {/* Name */}
        <input
          type="text"
          value={editedCategory.name}
          onChange={(e) =>
            setEditedCategory({ ...editedCategory, name: e.target.value })
          }
          placeholder="Enter category name"
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
          required
        />

        {/* Parent Category */}
        <select
          value={editedCategory.parentCategory || ""}
          onChange={(e) =>
            setEditedCategory({
              ...editedCategory,
              parentCategory: e.target.value,
            })
          }
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
        >
          <option value="">No Parent (Main Category)</option>
          {categories
            .filter((cat) => !cat.parentCategory)
            .map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        {/* Image Upload */}
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
                  : `${API_BASE}${editedCategory.image}`
              }
              alt="Preview"
              className="h-20 w-20 object-cover rounded mt-2"
            />
          )}
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-2">{success}</p>}

        <div className="flex justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
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
