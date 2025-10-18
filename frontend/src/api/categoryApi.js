/* eslint-disable no-unused-vars */
// src/api/categoryApi.js
import axios from "axios";

// ✅ Unified environment variable (consistent with backend)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const CATEGORY_API = `${API_BASE}/categories`;

/**
 * 🧩 Optional Auth Header (used later when protect/adminOnly are re-enabled)
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ============================================
   🟢 Get all categories (with optional count)
============================================ */
export const getCategoriesWithCount = async () => {
  try {
    const { data } = await axios.get(CATEGORY_API, {
      // headers: getAuthHeader(), // enable later for admin routes
    });

    // ✅ Normalize API response shape
    if (Array.isArray(data)) return data;
    if (data?.categories) return data.categories;
    if (data?.data) return data.data;

    console.warn("⚠️ Unexpected category API response format:", data);
    return [];
  } catch (error) {
    console.error(
      "❌ Error fetching categories:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.data?.message || "Failed to fetch categories"
    );
  }
};

/* ============================================
   🟡 Add new category (with optional image)
============================================ */
export const addCategory = async (categoryData) => {
  try {
    let formData;

    if (categoryData instanceof FormData) {
      formData = categoryData;
    } else {
      formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formData.append(key, value);
      });
    }

    const { data } = await axios.post(CATEGORY_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // ...getAuthHeader(),
      },
    });

    console.log("✅ Category added:", data);
    return data;
  } catch (error) {
    console.error(
      "❌ Error adding category:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
        (error.response?.status === 400
          ? "Invalid category data"
          : "Failed to add category")
    );
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
        if (value !== undefined && value !== null)
          formData.append(key, value);
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
    console.error(
      "❌ Error updating category:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.status === 404
        ? "Category not found"
        : "Failed to update category"
    );
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
    console.error(
      "❌ Error deleting category:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.status === 404
        ? "Category not found"
        : "Failed to delete category"
    );
  }
};

// ✅ Aliases for readability
export const getCategories = getCategoriesWithCount;
