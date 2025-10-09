import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const registerUserAPI = async (formData) => {
  const { data } = await axios.post(`${API_BASE}/auth/register`, formData);
  return data.user;
};

export const loginUserAPI = async (credentials) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
  return data.user;
};
