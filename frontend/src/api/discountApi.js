import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Get all active discounts
export const getDiscounts = async () => {
  const { data } = await axios.get(`${API_BASE}/discounts`);
  return data;
};

// Get discount by ID
export const getDiscountById = async (id) => {
  const { data } = await axios.get(`${API_BASE}/discounts/${id}`);
  return data;
};
