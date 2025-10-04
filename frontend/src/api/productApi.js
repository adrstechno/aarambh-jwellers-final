import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// 🟢 Get all products
export const getProducts = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};

// 🟡 Add new product (supports optional image)
export const addProduct = async (productData) => {
  try {
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        // Only append valid values
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      }
    });

    const { data } = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    console.error("❌ Error adding product:", error.response?.data || error.message);
    throw error;
  }
};

// 🟠 Update existing product (re-upload image optional)
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      }
    });

    const { data } = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    console.error("❌ Error updating product:", error.response?.data || error.message);
    throw error;
  }
};

// 🔴 Delete product
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Error deleting product:", error.response?.data || error.message);
    throw error;
  }
};
