import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REFUND_API = `${API_BASE}/refunds`;

// 🟢 Get all refund requests
export const getAllRefunds = async () => {
  const { data } = await axios.get(REFUND_API);
  return data;
};

// 🟡 Create refund request
export const createRefund = async (refundData) => {
  const { data } = await axios.post(REFUND_API, refundData);
  return data;
};

// 🟠 Update refund status
export const updateRefundStatus = async (id, updateData) => {
  const { data } = await axios.put(`${REFUND_API}/${id}`, updateData);
  return data;
};

// 🔴 Delete refund
export const deleteRefund = async (id) => {
  const { data } = await axios.delete(`${REFUND_API}/${id}`);
  return data;
};

// 🟢 Get refund requests for a specific user
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

// 🟡 Create new return/refund request
export const createReturnRequest = async (formData, token) => {
  try {
    const { data } = await axios.post(`${REFUND_API}/create`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error creating return request:", error.response?.data || error);
    throw error;
  }
};