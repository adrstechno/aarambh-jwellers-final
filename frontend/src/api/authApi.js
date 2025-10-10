import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const AUTH_API = `${API_BASE}/auth`;

// ✅ Login
export const loginUserAPI = async (payload) => {
  const { data } = await axios.post(`${AUTH_API}/login`, payload);
  return data;
};

// ✅ Register
export const registerUserAPI = async (payload) => {
  const { data } = await axios.post(`${AUTH_API}/register`, payload);
  return data;
};
