/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductData, setDeleteProductData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    image: null,
  });

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  // 🔹 Fetch categories & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Error loading data:", err);
        showToast("error", "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Image upload validation
  const handleImageUpload = (e, setFn, product) => {
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
        ...product,
        image: {
          file,
          preview: URL.createObjectURL(file),
        },
      });
    }
  };

  // 🔹 Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category) {
      showToast("error", "Please fill in all fields.");
      return;
    }

    try {
      const data = await addProduct({
        ...newProduct,
        image: newProduct.image?.file || null,
      });
      setProducts((prev) => [...prev, data.product]);
      setShowForm(false);
      showToast("success", "Product added successfully!");
      setNewProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "Active",
        image: null,
      });
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast("error", "Failed to add product.");
    }
  };

  // 🔹 Update product
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editProduct,
        // ensure category is an ID (backend expects ObjectId)
        category: editProduct.category?._id || editProduct.category,
        image: editProduct.image?.file || null,
      };

      const updated = await updateProduct(editProduct._id, payload);

      setProducts((prev) =>
        prev.map((p) => (p._id === updated.product._id ? updated.product : p))
      );
      setEditProduct(null);
      showToast("success", "Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast("error", "Failed to update product.");
    }
  };

  // 🔹 Delete product
  const confirmDelete = async () => {
    if (!deleteProductData) return;
    try {
      await deleteProduct(deleteProductData._id);
      // use functional update to avoid stale closure
      setProducts((prev) => prev.filter((p) => p._id !== deleteProductData._id));
      showToast("success", "Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("error", "Failed to delete product.");
    } finally {
      setDeleteProductData(null);
    }
  };

  // 🔹 Toggle product status
  const toggleStatus = async (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      // send only the fields backend expects (avoid nested objects)
      const payload = {
        status: newStatus,
        category: product.category?._id || product.category,
      };
      const updated = await updateProduct(id, payload);

      setProducts((prev) =>
        prev.map((p) => (p._id === updated.product._id ? updated.product : p))
      );
      showToast(
        "success",
        `Product status changed to ${newStatus.toLowerCase()}`
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("error", "Failed to update status.");
    }
  };

  // 🔹 Filter products
  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading products...</div>
    );
  }

  return (
    <div className="p-6 relative">
      {/* ✅ Toast Notification */}
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

      {/* 🔴 Delete Confirmation Modal */}
      {deleteProductData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">
              Delete product?
            </h3>
            <p className="text-gray-600 mb-4">{deleteProductData.name}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteProductData(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Existing Add Product Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

            <form onSubmit={handleAddProduct} className="grid gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />

              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />

              <select
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, status: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} /> Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, setNewProduct, newProduct)
                  }
                  className="px-2 py-1 border rounded-lg"
                  required
                />
                {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
                {newProduct.image && (
                  <img
                    src={newProduct.image.preview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded mt-2"
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Form */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setEditProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

            <form onSubmit={handleEditProductSubmit} className="grid gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />
              <select
                value={editProduct.category?._id || editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                required
              />
              <select
                value={editProduct.status}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, status: e.target.value })
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon size={18} /> Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, setEditProduct, editProduct)
                  }
                  className="px-2 py-1 border rounded-lg"
                />
                {editProduct.image && (
                  <img
                    src={
                      editProduct.image.preview
                        ? editProduct.image.preview
                        : `http://localhost:5000${editProduct.image}`
                    }
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded mt-2"
                  />
                )}
              </div>
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

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">ID</th>
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
              <tr key={prod._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {prod.image ? (
                    <img
                      src={`http://localhost:5000${prod.image}`}
                      alt={prod.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="py-3 px-6">{prod._id.slice(-6).toUpperCase()}</td>
                <td className="py-3 px-6 font-medium">{prod.name}</td>
                <td className="py-3 px-6">
                  {prod.category?.name || "Uncategorized"}
                </td>
                <td className="py-3 px-6">₹{prod.price}</td>
                <td className="py-3 px-6">{prod.stock}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => toggleStatus(prod._id)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      prod.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {prod.status}
                  </button>
                </td>
                <td className="py-3 px-6 text-center flex justify-center space-x-3">
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
            No products found in "{filter}" status.
          </div>
        )}
      </div>
    </div>
  );
}
