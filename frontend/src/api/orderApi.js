// src/api/orderApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Get all orders (Admin)
export const getAllOrders = async (token) => {
  const res = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update order status (Admin)
export const updateOrderStatus = async (id, status, token) => {
  const res = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};


// Create order
export const createOrder = async (orderData, token) => {
  const res = await axios.post(API_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔴 Delete order (optional)
export const deleteOrder = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

// Get user orders
export const getUserOrders = async (token) => {
  const res = await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};