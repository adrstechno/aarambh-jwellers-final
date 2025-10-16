import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REFUND_API = `${API_BASE}/refunds`;

/* =======================================================
   👨‍💼 ADMIN API FUNCTIONS
   ======================================================= */

// 🟢 Get all refunds (Admin)
export const getAllRefunds = async (token) => {
  try {
    const { data } = await axios.get(REFUND_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching all refunds:", error.response?.data || error);
    throw error;
  }
};

// 🟡 Create refund manually (Admin)
export const createRefund = async (refundData, token) => {
  try {
    const { data } = await axios.post(REFUND_API, refundData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error creating refund:", error.response?.data || error);
    throw error;
  }
};

// 🟠 Update refund status (Admin)
export const updateRefundStatus = async (id, updateData, token) => {
  try {
    const { data } = await axios.put(`${REFUND_API}/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error updating refund status:", error.response?.data || error);
    throw error;
  }
};

// 🔴 Delete refund (Admin)
export const deleteRefund = async (id, token) => {
  try {
    const { data } = await axios.delete(`${REFUND_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error deleting refund:", error.response?.data || error);
    throw error;
  }
};

/* =======================================================
   👤 USER API FUNCTIONS
   ======================================================= */

// 🟢 Get refund requests for logged-in user
export const getUserRefunds = async (token) => {
  try {
    const { data } = await axios.get(`${REFUND_API}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching user refunds:", error.response?.data || error);
    throw error;
  }
};

// 🟡 Create refund request (user-side)
export const createRefundRequest = async (refundData, token) => {
  try {
    const { data } = await axios.post(`${REFUND_API}/create`, refundData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error creating refund request:", error.response?.data || error);
    throw error;
  }
};
