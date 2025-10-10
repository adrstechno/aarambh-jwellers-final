import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const USER_API = `${API_BASE}/users`;

const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw error;
};

export const loginUser = async (email, password) => {
  const { data } = await axios.post(`${USER_API}/login`, { email, password });
  return data;
};

// ✅ Get all users
export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(USER_API);
    return data;
  } catch (error) {
    handleError("fetching users", error);
  }
};

// ✅ Get orders for a specific user
export const getUserOrders = async (userId) => {
  try {
    const { data } = await axios.get(`${USER_API}/orders/user/${userId}`);
    return data;
  } catch (error) {
    handleError(`fetching orders for user ${userId}`, error);
  }
};

// ✅ Toggle user role
export const toggleUserRole = async (id) => {
  try {
    const { data } = await axios.put(`${USER_API}/${id}/role`);
    return data;
  } catch (error) {
    handleError("updating user role", error);
  }
};

// ✅ Toggle user status
export const toggleUserStatus = async (id) => {
  try {
    const { data } = await axios.put(`${USER_API}/${id}/status`);
    return data;
  } catch (error) {
    handleError("updating user status", error);
  }
};


// ✅ Get user profile
export const getUserProfile = async (token) => {
  try {
    const { data } = await axios.get(`${USER_API}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update user profile
export const updateUserProfile = async (profileData, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error updating profile:", error.response?.data || error);
    throw error;
  }
};

// ✅ Change password
export const updateUserPassword = async (passwordData, token) => {
  try {
    const { data } = await axios.put(`${USER_API}/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error updating password:", error.response?.data || error);
    throw error;
  }
};