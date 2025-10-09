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
