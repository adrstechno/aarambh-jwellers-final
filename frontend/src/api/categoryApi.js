// src/api/categoryApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_URL = `${API_BASE}/categories`;

/**
 * 🟢 Get all categories (with optional product count + parent info)
 */
export const getCategoriesWithCount = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("❌ Error fetching categories with count:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch categories");
  }
};

/**
 * 🟢 Get categories (alias for consistency)
 */
export const getCategories = getCategoriesWithCount;

/**
 * 🟡 Add a new category (supports image + parent category)
 */
export const addCategory = async (categoryData) => {
  try {
    let formData;

    // If plain object — convert to FormData (for image + text fields)
    if (categoryData instanceof FormData) {
      formData = categoryData;
    } else {
      formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
    }

    const { data } = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Category added:", data);
    return data;
  } catch (error) {
    console.error("❌ Error adding category:", error?.response?.data || error.message);

    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Invalid category data");
    } else if (error.response?.status === 500) {
      throw new Error("Server error while adding category");
    } else {
      throw new Error("Failed to add category");
    }
  }
};

/**
 * 🟠 Update existing category (supports image + parent category)
 */
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

    const { data } = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Category updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating category:", error?.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error("Category not found");
    } else if (error.response?.status === 500) {
      throw new Error("Server error while updating category");
    } else {
      throw new Error("Failed to update category");
    }
  }
};

/**
 * 🔴 Delete category
 */
export const deleteCategory = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    console.log("🗑️ Category deleted:", data);
    return data;
  } catch (error) {
    console.error("❌ Error deleting category:", error?.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error("Category not found");
    } else {
      throw new Error("Failed to delete category");
    }
  }
};
