// src/api/authApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const AUTH_API = `${API_BASE}/auth`; // ✅ FIXED: Added /auth prefix

// 🟢 Register new user
export const registerUser = async (userData) => {
  const { data } = await axios.post(`${AUTH_API}/register`, userData);
  return data;
};

// 🔵 Login existing user
export const loginUser = async (userData) => {
  const { data } = await axios.post(`${AUTH_API}/login`, userData);
  return data;
};
