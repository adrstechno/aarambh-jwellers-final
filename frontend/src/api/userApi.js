/* eslint-disable no-unused-vars */
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const USER_API = `${API_BASE}/users`;

/* ===========================================================
   🧠 Helper Functions
=========================================================== */

// ✅ Automatically include Bearer token in headers
const getAuthHeader = (token) => {
  const finalToken = token || localStorage.getItem("token");
  return finalToken ? { Authorization: `Bearer ${finalToken}` } : {};
};

// ✅ Consistent error handler
const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || `Failed to ${action}`);
};

/* ===========================================================
   👑 ADMIN ROUTES  (Protected)
=========================================================== */

// 🟢 Get all users
export const getAllUsers = async (token) => {
  try {
    const { data } = await axios.get(USER_API, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching all users", error);
  }
};

// 🟢 Get orders of a specific user
export const getUserOrders = async (userId, token) => {
  try {
    const { data } = await axios.get(`${USER_API}/${userId}/orders`, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching user orders", error);
  }
};

// 🟡 Toggle user role (Admin ↔ Customer)
export const toggleUserRole = async (userId, token) => {
  try {
    const { data } = await axios.put(
      `${USER_API}/${userId}/role`,
      {},
      { headers: getAuthHeader(token) }
    );
    return data;
  } catch (error) {
    handleError("toggling user role", error);
  }
};

// 🔴 Toggle user status (Active ↔ Blocked)
export const toggleUserStatus = async (userId, token) => {
  try {
    const { data } = await axios.put(
      `${USER_API}/${userId}/status`,
      {},
      { headers: getAuthHeader(token) }
    );
    return data;
  } catch (error) {
    handleError("toggling user status", error);
  }
};

// 👑 Promote user to Admin
export const makeAdmin = async (userId, token) => {
  try {
    const { data } = await axios.put(
      `${USER_API}/make-admin/${userId}`,
      {},
      { headers: getAuthHeader(token) }
    );
    return data;
  } catch (error) {
    handleError("promoting user to admin", error);
  }
};

// 🚫 Revoke Admin privileges
export const removeAdmin = async (userId, token) => {
  try {
    const { data } = await axios.put(
      `${USER_API}/remove-admin/${userId}`,
      {},
      { headers: getAuthHeader(token) }
    );
    return data;
  } catch (error) {
    handleError("revoking admin privileges", error);
  }
};

/* ===========================================================
   👤 USER ROUTES (Protected)
=========================================================== */

// ✅ Get logged-in user profile
export const getUserProfile = async (token) => {
  try {
    const { data } = await axios.get(`${USER_API}/me`, {
      headers: getAuthHeader(token),
    });
    return data;
  } catch (error) {
    handleError("fetching user profile", error);
  }
};

// ✅ Update profile
export const updateUserProfile = async (profile, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/me`, profile, {
      headers: {
        ...getAuthHeader(token),
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    handleError("updating user profile", error);
  }
};

// ✅ Change password
export const updateUserPassword = async (passwordData, token) => {
  try {
    const { data } = await axios.put(
      `${USER_API}/change-password`,
      passwordData,
      {
        headers: {
          ...getAuthHeader(token),
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    handleError("changing password", error);
  }
};
