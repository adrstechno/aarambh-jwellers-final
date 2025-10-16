import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const ORDER_API = `${API_BASE}/orders`;

/* 🟢 ADMIN: Get all orders */
export const getAllOrders = async (token) => {
  try {
    const { data } = await axios.get(`${ORDER_API}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.response?.data || error);
    throw error;
  }
};

/* 🟡 ADMIN: Update order status */
export const updateOrderStatus = async (id, status, token) => {
  try {
    const { data } = await axios.put(
      `${ORDER_API}/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("❌ Error updating order status:", error.response?.data || error);
    throw error;
  }
};

/* 🟣 USER: Create a new order */
export const createOrder = async (orderData, token) => {
  try {
    const { data } = await axios.post(`${ORDER_API}`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error creating order:", error.response?.data || error);
    throw error;
  }
};

/* 🔵 USER: Get orders by current user */
export const getUserOrders = async (userId, token) => {
  try {
    const { data } = await axios.get(`${ORDER_API}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching user orders:", error.response?.data || error);
    throw error;
  }
};

/* 🔴 ADMIN: Delete order (optional) */
export const deleteOrder = async (id, token) => {
  try {
    const { data } = await axios.delete(`${ORDER_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error deleting order:", error.response?.data || error);
    throw error;
  }
};
