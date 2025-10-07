// src/api/productAPI.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// ✅ Get all products
export const getProducts = async () => {
  try {
    const { data } = await axios.get(API_BASE);
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
};

// ✅ Add new product
export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });

    const { data } = await axios.post(API_BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw error;
  }
};

// ✅ Update product
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });

    const { data } = await axios.put(`${API_BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("❌ Error updating product:", error);
    throw error;
  }
};

// ✅ Delete product
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw error;
  }
};
// 🟢 Get all products
export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/api/products`);
  return res.data;
};

// 🟣 Get products by category
export const getProductsByCategory = async (category) => {
  const res = await axios.get(`${API_BASE}/api/products/category/${category}`);
  return res.data;
};

// 🟠 Get single product details
export const getProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/api/products/${id}`);
  return res.data;
};

// 🟣 Get product by slug (for ProductDetail.jsx)
export const getProductBySlug = async (slug) => {
  const res = await axios.get(`${API_BASE}/api/products/slug/${slug}`);
  return res.data;
};
