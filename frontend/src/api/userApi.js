// src/api/userApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const USER_API = `${API_BASE}/users`;

/* ================================
   🧩 Helper for Authorization
================================ */
const getAuthHeader = (token) => {
  const finalToken = token || localStorage.getItem("token");
  return { Authorization: `Bearer ${finalToken}` };
};

const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw error;
};

/* ================================
   🔐 AUTHENTICATION
================================ */

// ✅ Login User
export const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return data;
  } catch (error) {
    handleError("logging in", error);
  }
};

/* ================================
   👑 ADMIN ROUTES
================================ */

// ✅ Get all users (Admin)
export const getAllUsers = async (token) => {
  try {
    const { data } = await axios.get(`${USER_API}`, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching all users", error);
  }
};

// ✅ Get orders of a specific user (Admin)
export const getUserOrders = async (userId, token) => {
  try {
    const { data } = await axios.get(`${USER_API}/orders/user/${userId}`, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching user orders", error);
  }
};

// ✅ Toggle user Admin / Customer role
export const toggleUserRole = async (userId, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/${userId}/role`, {}, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("toggling user role", error);
  }
};

// ✅ Toggle user Active / Blocked status
export const toggleUserStatus = async (userId, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/${userId}/status`, {}, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("toggling user status", error);
  }
};

// ✅ Promote a user to Admin
export const makeAdmin = async (userId, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/make-admin/${userId}`, {}, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("promoting user to admin", error);
  }
};

// ✅ Remove Admin privileges
export const removeAdmin = async (userId, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/remove-admin/${userId}`, {}, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("removing admin privileges", error);
  }
};

/* ================================
   👤 USER ROUTES
================================ */

// ✅ Get user profile
export const getUserProfile = async (token) => {
  try {
    const { data } = await axios.get(`${USER_API}/profile`, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching user profile", error);
  }
};

// ✅ Update user profile
export const updateUserProfile = async (profileData, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/profile`, profileData, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("updating user profile", error);
  }
};

// ✅ Change password
export const updateUserPassword = async (passwordData, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/change-password`, passwordData, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("updating password", error);
  }
};
