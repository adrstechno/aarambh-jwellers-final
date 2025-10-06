// src/api/productAPI.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE}/api/products`;

// ✅ Get all products
export const getProducts = async () => {
  try {
    const { data } = await axios.get(API_URL);
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

    const { data } = await axios.post(API_URL, formData, {
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

    const { data } = await axios.put(`${API_URL}/${id}`, formData, {
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
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw error;
  }
};
