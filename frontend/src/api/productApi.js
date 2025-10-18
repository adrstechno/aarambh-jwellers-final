import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// ✅ Helper: Uniform backend base (no `/api` for file URLs)
const BASE_URL = API_BASE.replace("/api", "");

// ✅ Handle and format errors consistently
const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || `Failed to ${action}`);
};

/* =======================================================
   🧩 IMAGE NORMALIZATION HELPER
   Adds backend URL prefix to product.image or product.images[]
======================================================= */
const normalizeProductImages = (product) => {
  if (!product) return product;

  const prefixImage = (img) => {
    if (!img) return "/placeholder.jpg";
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images = product.images.map((img) => prefixImage(img));
  }

  if (product.image) {
    product.image = prefixImage(product.image);
  }

  return product;
};

/* =======================================================
   🟢 PRODUCT API FUNCTIONS
======================================================= */

// ✅ Get all products
export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products`);
    const products = Array.isArray(res.data)
      ? res.data.map(normalizeProductImages)
      : res.data.products?.map(normalizeProductImages) || [];
    return products;
  } catch (error) {
    handleError("fetching all products", error);
  }
};

// ✅ Get products by category (slug or name)
export const getProductsByCategory = async (category) => {
  try {
    const res = await axios.get(`${API_BASE}/products/category/${category}`);
    const products = Array.isArray(res.data)
      ? res.data.map(normalizeProductImages)
      : res.data.products?.map(normalizeProductImages) || [];
    return products;
  } catch (error) {
    handleError("fetching products by category", error);
  }
};

// ✅ Get single product by ID
export const getProductById = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/${id}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by ID", error);
  }
};

// ✅ Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/slug/${slug}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by slug", error);
  }
};

// ✅ Add new product (supports multipart/form-data)
export const addProduct = async (productData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/products`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProductImages(data);
  } catch (error) {
    handleError("adding product", error);
  }
};

// ✅ Update existing product
export const updateProduct = async (id, productData) => {
  try {
    const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProductImages(data);
  } catch (error) {
    handleError("updating product", error);
  }
};

// ✅ Delete product
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/products/${id}`);
    return data;
  } catch (error) {
    handleError("deleting product", error);
  }
};
