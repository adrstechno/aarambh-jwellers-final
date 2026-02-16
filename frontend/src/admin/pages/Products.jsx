/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { getReviewsByProduct } from "../../api/reviewApi";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Products() {
  const navigate = useNavigate();
  const { user } = useApp();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductData, setDeleteProductData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    materials: [{ type: "", weight: "" }],
    images: [],
  });

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // ✅ Fetch categories + products
  const fetchData = async () => {
    if (!user?.token) return;
    try {
      const [cats, prodsResponse] = await Promise.all([
        getCategories(), 
        getAllProducts(1, 1000) // Get all products for admin
      ]);
      setCategories(cats);
      setProducts(prodsResponse.products || []);
    } catch (err) {
      console.error("Error loading data:", err);
      showToast("error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.token]);

  // ✅ Image upload handler (multi-file)
  const handleImageUpload = (e, setFn, product) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFn({ ...product, images: [...(product.images || []), ...previews] });
  };

  const removeImage = (index, setFn, product) => {
    const updated = [...product.images];
    updated.splice(index, 1);
    setFn({ ...product, images: updated });
  };

  // ✅ Material helpers
  const addMaterial = (setFn, product) => {
    setFn({
      ...product,
      materials: [...(product.materials || []), { type: "", weight: "" }],
    });
  };

  const updateMaterial = (index, field, value, setFn, product) => {
    const updated = [...product.materials];
    updated[index][field] = value;
    setFn({ ...product, materials: updated });
  };

  const removeMaterial = (index, setFn, product) => {
    const updated = [...product.materials];
    updated.splice(index, 1);
    setFn({ ...product, materials: updated });
  };

  // ✅ Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("status", newProduct.status);
      formData.append("description", newProduct.description);
      formData.append("materials", JSON.stringify(newProduct.materials || []));

      newProduct.images.forEach((img) => formData.append("images", img.file));

      await addProduct(formData);
      showToast("success", "Product added successfully!");

      setTimeout(async () => {
        setShowForm(false);
        await fetchData();
        navigate("/admin/products");
      }, 1000);

      setNewProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        materials: [{ type: "", weight: "" }],
        status: "Active",
        images: [],
      });
    } catch (err) {
      console.error("❌ Failed to add product:", err);
      showToast("error", "Failed to add product.");
    }
  };

  // ✅ Update Product
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("category", editProduct.category?._id || editProduct.category);
      formData.append("price", editProduct.price);
      formData.append("stock", editProduct.stock);
      formData.append("status", editProduct.status);
      formData.append("description", editProduct.description);
      formData.append("materials", JSON.stringify(editProduct.materials || []));

      if (editProduct.images && editProduct.images.length > 0) {
        editProduct.images.forEach((img) => {
          if (img.file) formData.append("images", img.file);
        });
      }

      await updateProduct(editProduct._id, formData);
      showToast("success", "Product updated successfully!");

      setTimeout(async () => {
        setEditProduct(null);
        await fetchData();
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("❌ Failed to update product:", err);
      showToast("error", "Failed to update product.");
    }
  };

  // ✅ Delete Product
  const confirmDelete = async () => {
    if (!deleteProductData) return;
    try {
      await deleteProduct(deleteProductData._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteProductData._id));
      showToast("success", "Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("error", "Failed to delete product.");
    } finally {
      setDeleteProductData(null);
    }
  };

  // ✅ Toggle Status
  const toggleStatus = async (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      const payload = new FormData();
      payload.append("status", newStatus);
      payload.append("category", product.category?._id || product.category);
      await updateProduct(id, payload);
      showToast("success", `Product status changed to ${newStatus.toLowerCase()}`);
      fetchData();
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("error", "Failed to update status.");
    }
  };

  // ✅ Reviews
  const viewProductReviews = async (productId) => {
    try {
      const data = await getReviewsByProduct(productId);
      setSelectedProduct(productId);
      setReviews(data);
    } catch {
      showToast("error", "Failed to load product reviews.");
    }
  };

  // ✅ Filter
  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.status === filter);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading products...</div>;

  return (
    <div className="p-6 relative">
       {/* Toast */}
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

      {/* 🧾 Delete Confirmation Modal */}
      {deleteProductData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">Delete Product?</h3>
            <p className="text-gray-600 mb-4">{deleteProductData.name}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteProductData(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
          >
            <option value="All">All Products</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      {/* 🧩 Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

            <form onSubmit={handleAddProduct} className="grid gap-4">
              {/* Product Name */}
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />

              {/* Category */}
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Price */}
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />

              {/* Stock */}
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />

             {/* 🧱 Materials Section */}
<div className="border p-3 rounded-lg">
  <div className="flex justify-between mb-2">
    <h3 className="font-semibold">Materials</h3>
    <button
      type="button"
      onClick={() => addMaterial(setNewProduct, newProduct)}
      className="text-sm text-blue-600"
    >
      + Add
    </button>
  </div>

  {newProduct.materials.map((mat, i) => (
    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
      <input
        type="text"
        placeholder="Type"
        value={mat.type}
        onChange={(e) =>
          updateMaterial(i, "type", e.target.value, setNewProduct, newProduct)
        }
        className="px-2 py-1 border rounded"
      />
      <input
        type="number"
        placeholder="Weight (g)"
        value={mat.weight}
        onChange={(e) =>
          updateMaterial(i, "weight", e.target.value, setNewProduct, newProduct)
        }
        className="px-2 py-1 border rounded"
      />
      <button
        type="button"
        onClick={() => removeMaterial(i, setNewProduct, newProduct)}
        className="text-red-600 hover:text-red-800"
      >
        ✕
      </button>
    </div>
  ))}
</div>

              {/* Description */}
              <textarea
                placeholder="Enter product description..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                rows={3}
              />

              {/* Status */}
              <select
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, status: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* 🖼️ Multiple Image Upload */}
<div className="border p-3 rounded-lg">
  <label className="font-medium flex items-center gap-2 mb-2">
    <ImageIcon size={18} /> Product Images
  </label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => handleImageUpload(e, setNewProduct, newProduct)}
    className="px-2 py-1 border rounded"
  />

  {/* Previews */}
  <div className="flex flex-wrap gap-3 mt-3">
    {newProduct.images.map((img, i) => (
      <div key={i} className="relative">
        <img
          src={img.preview}
          alt="Preview"
          className="h-20 w-20 rounded object-cover border"
        />
        <button
          type="button"
          onClick={() => removeImage(i, setNewProduct, newProduct)}
          className="absolute top-0 right-0 bg-black/60 text-white text-xs p-1 rounded-bl"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🧾 Products Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
         <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredProducts.map((prod) => (
              <tr
                key={prod._id}
                className={`border-b hover:bg-gray-50 ${prod.stock < 5 ? "bg-red-50" : ""}`}
              >
                <td className="py-3 px-6">
                  <img
                    src={prod.images?.[0] || prod.image || "/placeholder.jpg"}
                    alt={prod.name}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                </td>
                <td className="py-3 px-6 font-medium">{prod.name}</td>
                <td className="py-3 px-6">{prod.category?.name || "Uncategorized"}</td>
                <td className="py-3 px-6">₹{prod.price}</td>
                <td className="py-3 px-6">{prod.stock}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => toggleStatus(prod._id)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      prod.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {prod.status}
                  </button>
                </td>
                <td className="py-3 px-6 flex justify-center gap-3">
                  <button
                    onClick={() => viewProductReviews(prod._id)}
                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditProduct(prod)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteProductData(prod)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {filteredProducts.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No products found.
          </div>
        )}
      </div>

      {/* 🧩 Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setEditProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

            <form onSubmit={handleEditProductSubmit} className="grid gap-4">
  {/* Product Name */}
  <input
    type="text"
    placeholder="Product Name"
    value={editProduct.name || ""}
    onChange={(e) =>
      setEditProduct({ ...editProduct, name: e.target.value })
    }
    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
    required
  />

  {/* Category */}
  <select
    value={editProduct.category?._id || editProduct.category}
    onChange={(e) =>
      setEditProduct({ ...editProduct, category: e.target.value })
    }
    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
    required
  >
    <option value="">Select Category</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>

  {/* Price + Stock */}
  <div className="grid grid-cols-2 gap-3">
    <input
      type="number"
      placeholder="Price"
      value={editProduct.price || ""}
      onChange={(e) =>
        setEditProduct({ ...editProduct, price: e.target.value })
      }
      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
      required
    />
    <input
      type="number"
      placeholder="Stock Quantity"
      value={editProduct.stock || ""}
      onChange={(e) =>
        setEditProduct({ ...editProduct, stock: e.target.value })
      }
      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
      required
    />
  </div>

  {/* 🧱 Materials Section */}
  <div className="border p-3 rounded-lg">
    <div className="flex justify-between mb-2">
      <h3 className="font-semibold">Materials</h3>
      <button
        type="button"
        onClick={() => addMaterial(setEditProduct, editProduct)}
        className="text-sm text-blue-600"
      >
        + Add
      </button>
    </div>

    {(editProduct.materials || []).map((mat, i) => (
      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
        <input
          type="text"
          placeholder="Type"
          value={mat.type}
          onChange={(e) =>
            updateMaterial(i, "type", e.target.value, setEditProduct, editProduct)
          }
          className="px-2 py-1 border rounded"
        />
        <input
          type="number"
          placeholder="Weight (g)"
          value={mat.weight}
          onChange={(e) =>
            updateMaterial(i, "weight", e.target.value, setEditProduct, editProduct)
          }
          className="px-2 py-1 border rounded"
        />
        <button
          type="button"
          onClick={() => removeMaterial(i, setEditProduct, editProduct)}
          className="text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    ))}
  </div>

  {/* Description */}
  <textarea
    placeholder="Enter product description..."
    value={editProduct.description || ""}
    onChange={(e) =>
      setEditProduct({ ...editProduct, description: e.target.value })
    }
    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
    rows={3}
  />

  {/* Status */}
  <select
    value={editProduct.status}
    onChange={(e) =>
      setEditProduct({ ...editProduct, status: e.target.value })
    }
    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>

  {/* 🖼️ Multiple Image Upload */}
  <div className="border p-3 rounded-lg">
    <label className="font-medium flex items-center gap-2 mb-2">
      <ImageIcon size={18} /> Product Images
    </label>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => handleImageUpload(e, setEditProduct, editProduct)}
      className="px-2 py-1 border rounded"
    />

    {/* Image Previews */}
    <div className="flex flex-wrap gap-3 mt-3">
      {(editProduct.images || []).map((img, i) => (
        <div key={i} className="relative">
          <img
            src={
              img.preview
                ? img.preview
                : img.startsWith?.("http")
                ? img
                : `${API_BASE}${img}`
            }
            alt="Preview"
            className="h-20 w-20 rounded object-cover border"
          />
          <button
            type="button"
            onClick={() => removeImage(i, setEditProduct, editProduct)}
            className="absolute top-0 right-0 bg-black/60 text-white text-xs p-1 rounded-bl"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Save Button */}
  <button
    type="submit"
    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
  >
    Update Product
  </button>
</form>
          </div>
        </div>
      )}

      {/* ⭐ Reviews Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-3">Product Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.map((r) => (
                  <div key={r._id} className="border p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-900">
                      {r.user.name} — ⭐ {r.rating}
                    </p>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
