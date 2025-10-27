// src/api/jewellerySectionApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const getJewellerySection = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/jewellery-section`);
    return data;
  } catch (err) {
    console.error("❌ Error fetching jewellery section:", err);
    throw err;
  }
};

export const updateJewellerySection = async (formData, token) => {
  try {
    const { data } = await axios.post(
      `${API_BASE}/jewellery-section/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return data;
  } catch (err) {
    console.error("❌ Error updating jewellery section:", err);
    throw err;
  }
};
