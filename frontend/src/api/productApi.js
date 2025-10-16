import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || `Failed to ${action}`);
};

// ✅ Get all products
export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
  } catch (error) {
    handleError("fetching all products", error);
  }
};

// ✅ Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const res = await axios.get(`${API_BASE}/products/category/${category}`);
    return res.data;
  } catch (error) {
    handleError("fetching products by category", error);
  }
};

// ✅ Get single product by ID
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE}/products/${id}`);
    return res.data;
  } catch (error) {
    handleError("fetching product by ID", error);
  }
};

// ✅ Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const res = await axios.get(`${API_BASE}/products/slug/${slug}`);
    return res.data;
  } catch (error) {
    handleError("fetching product by slug", error);
  }
};

// ✅ Add new product
export const addProduct = async (productData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/products`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    handleError("adding product", error);
  }
};

// ✅ Update product
export const updateProduct = async (id, productData) => {
  try {
    const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
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
