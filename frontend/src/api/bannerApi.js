import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Get all banners
export const getBanners = async () => {
  const { data } = await axios.get(`${API_BASE}/banners`);
  return data;
};
