/* eslint-disable no-unused-vars */
// src/api/categoryApi.js
import axios from "axios";

// ✅ Unified environment variable (same as other API files)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CATEGORY_API = `${API_BASE}/categories`;

/**
 * 🧩 Optional Auth Header (use later when protect/adminOnly are re-enabled)
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ============================================
   🟢 Get all categories (with product count)
============================================ */
export const getCategoriesWithCount = async () => {
  try {
    const { data } = await axios.get(CATEGORY_API, {
      // headers: getAuthHeader(), // Uncomment once auth is enabled
    });
    return data;
  } catch (error) {
    console.error(
      "❌ Error fetching categories with count:",
      error?.response?.data || error.message
    );
    throw new Error(error?.response?.data?.message || "Failed to fetch categories");
  }
};

/* ============================================
   🟡 Add new category (with image)
============================================ */
export const addCategory = async (categoryData) => {
  try {
    let formData;
    if (categoryData instanceof FormData) {
      formData = categoryData;
    } else {
      formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
    }

    const { data } = await axios.post(CATEGORY_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // ...getAuthHeader(), // Uncomment when auth required
      },
    });

    console.log("✅ Category added:", data);
    return data;
  } catch (error) {
    console.error("❌ Error adding category:", error?.response?.data || error.message);
    const msg =
      error.response?.data?.message ||
      (error.response?.status === 400
        ? "Invalid category data"
        : "Failed to add category");
    throw new Error(msg);
  }
};

/* ============================================
   🟠 Update existing category
============================================ */
export const updateCategory = async (id, categoryData) => {
  try {
    let formData;
    if (categoryData instanceof FormData) {
      formData = categoryData;
    } else {
      formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
    }

    const { data } = await axios.put(`${CATEGORY_API}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // ...getAuthHeader(),
      },
    });

    console.log("✅ Category updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating category:", error?.response?.data || error.message);
    const msg =
      error.response?.status === 404
        ? "Category not found"
        : "Failed to update category";
    throw new Error(msg);
  }
};

/* ============================================
   🔴 Delete category
============================================ */
export const deleteCategory = async (id) => {
  try {
    const { data } = await axios.delete(`${CATEGORY_API}/${id}`, {
      // headers: getAuthHeader(),
    });
    console.log("🗑️ Category deleted:", data);
    return data;
  } catch (error) {
    console.error("❌ Error deleting category:", error?.response?.data || error.message);
    const msg =
      error.response?.status === 404
        ? "Category not found"
        : "Failed to delete category";
    throw new Error(msg);
  }
};

// Optional alias for clarity
export const getCategories = getCategoriesWithCount;
