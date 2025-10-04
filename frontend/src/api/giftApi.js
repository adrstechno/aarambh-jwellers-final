import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Get gift categories
export const getGiftCategories = async () => {
  const { data } = await axios.get(`${API_BASE}/gifts`);
  return data;
};
