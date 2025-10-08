// src/api/productApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// ✅ Get all products (Admin + Public)
export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

// ✅ Get products by category (Public)
export const getProductsByCategory = async (category) => {
  const res = await axios.get(`${API_BASE}/products/category/${category}`);
  return res.data;
};

// ✅ Get single product by ID (for admin or detail page)
export const getProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};

// ✅ Get product by slug (ProductDetail.jsx)
export const getProductBySlug = async (slug) => {
  const res = await axios.get(`${API_BASE}/products/slug/${slug}`);
  return res.data;
};

// ✅ Add product (Admin)
export const addProduct = async (productData) => {
  const { data } = await axios.post(`${API_BASE}/products`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ✅ Update product (Admin)
export const updateProduct = async (id, productData) => {
  const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ✅ Delete product (Admin)
export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/products/${id}`);
  return data;
};
