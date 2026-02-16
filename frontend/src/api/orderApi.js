import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const ORDER_API = `${API_BASE}/orders`;

/* ==========================================================
   👑 ADMIN ROUTES
   ========================================================== */

/* 🟢 Get all orders */
export const getAllOrders = async (token) => {
  try {
    const { data } = await axios.get(`${ORDER_API}/admin`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.response?.data || error);
    throw error;
  }
};

/* 🟡 Update order status */
export const updateOrderStatus = async (id, status, token) => {
  try {
    const { data } = await axios.put(
      `${ORDER_API}/${id}/status`,
      { status },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return data;
  } catch (error) {
    console.error("❌ Error updating order status:", error.response?.data || error);
    throw error;
  }
};

/* 🔴 Delete order */
export const deleteOrder = async (id, token) => {
  try {
    const { data } = await axios.delete(`${ORDER_API}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  } catch (error) {
    console.error("❌ Error deleting order:", error.response?.data || error);
    throw error;
  }
};

/* ==========================================================
   🧍 USER ROUTES
   ========================================================== */

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

// ✅ USER: Get orders by current user
export const getUserOrders = async (token, userId) => {
  try {
    if (!userId) throw new Error("Missing userId in getUserOrders");

    const { data } = await axios.get(`${API_BASE}/orders/my-orders`, {
      params: { userId },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return data;
  } catch (error) {
    console.error("❌ Error fetching user orders:", error.response?.data || error);
    throw error;
  }
};

/* ==========================================================
   🚫 USER: Cancel Order
   ========================================================== */
export const cancelUserOrder = async (orderId, token) => {
  try {
    if (!orderId) throw new Error("Missing orderId in cancelUserOrder");

    const { data } = await axios.put(
      `${ORDER_API}/${orderId}/cancel`,
      {}, // no body required
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    return data;
  } catch (error) {
    console.error("❌ Error cancelling order:", error.response?.data || error);
    throw error;
  }
};