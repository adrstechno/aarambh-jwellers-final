import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// ✅ For consistent image URLs
const BASE_URL = API_BASE.replace("/api", "");

// ✅ Central error handler
const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || `Failed to ${action}`);
};

/* =======================================================
   🧩 IMAGE NORMALIZATION HELPER
======================================================= */
const normalizeProductImages = (product) => {
  if (!product) return product;

  const fixPath = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return clean;
  };

  // Single image
  if (product.image) product.image = fixPath(product.image);

  // Multiple images (optional future use)
  if (Array.isArray(product.images)) {
    product.images = product.images.map((i) => fixPath(i));
  }

  return product;
};

/* =======================================================
   🟢 PRODUCT API FUNCTIONS
======================================================= */

// ✅ Get all public (active) products
export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/products`);
    const products = Array.isArray(data)
      ? data.map(normalizeProductImages)
      : [];
    return products;
  } catch (error) {
    handleError("fetching all products", error);
  }
};

// ✅ Get products by category slug
export const getProductsByCategory = async (category) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/category/${category}`);
    const products = Array.isArray(data)
      ? data.map(normalizeProductImages)
      : [];
    return products;
  } catch (error) {
    handleError("fetching products by category", error);
  }
};

// ✅ Get product by ID
export const getProductById = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/${id}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by ID", error);
  }
};

// ✅ Get product by Slug
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/slug/${slug}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by slug", error);
  }
};

// ✅ Search products
export const searchProducts = async (query) => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/products/search?q=${encodeURIComponent(query)}`
    );

    const products = Array.isArray(data)
      ? data.map(normalizeProductImages)
      : [];
    return products;
  } catch (error) {
    handleError("searching products", error);
  }
};

// ✅ Add product (Admin)
export const addProduct = async (productData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/products`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProductImages(data.product || data);
  } catch (error) {
    handleError("adding product", error);
  }
};

// ✅ Update product (Admin)
export const updateProduct = async (id, productData) => {
  try {
    const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProductImages(data.product || data);
  } catch (error) {
    handleError("updating product", error);
  }
};

// ✅ Delete product (Admin)
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/products/${id}`);
    return data;
  } catch (error) {
    handleError("deleting product", error);
  }
};
