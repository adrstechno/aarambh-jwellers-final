import axios from "axios";

const API_URL = "http://localhost:5000/api/categories"; // backend URL

// 🟢 Get all categories
export const getCategories = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// 🟡 Add category (only name)
export const addCategory = async (categoryData) => {
  const { data } = await axios.post(API_URL, {
    name: categoryData.name,
  });
  return data;
};

// 🟠 Update category (only name)
export const updateCategory = async (id, categoryData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, {
    name: categoryData.name,
  });
  return data;
};

// 🧮 Get categories with product count
export const getCategoriesWithCount = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// 🔴 Delete category
export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
