import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const DASHBOARD_API = `${API_BASE}/dashboard`;

export const getDashboardData = async (token) => {
  const { data } = await axios.get(DASHBOARD_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
