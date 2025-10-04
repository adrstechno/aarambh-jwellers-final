import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/**
 * Login user
 * @param {Object} credentials { email, password }
 */
export const login = async (credentials) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, credentials, {
    withCredentials: true,
  });
  return data;
};

/**
 * Register user
 * @param {Object} userData { name, email, password }
 */
export const register = async (userData) => {
  const { data } = await axios.post(`${API_BASE}/auth/register`, userData, {
    withCredentials: true,
  });
  return data;
};

/**
 * Logout user
 */
export const logout = async () => {
  const { data } = await axios.post(`${API_BASE}/auth/logout`, {}, {
    withCredentials: true,
  });
  return data;
};

/**
 * Get current user (session check)
 */
export const getCurrentUser = async () => {
  const { data } = await axios.get(`${API_BASE}/auth/me`, {
    withCredentials: true,
  });
  return data;
};
