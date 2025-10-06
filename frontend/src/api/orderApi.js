// src/api/orderApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// 🟢 Fetch all orders
export const getOrders = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// 🟠 Update order status
export const updateOrderStatus = async (id, status) => {
  const { data } = await axios.put(`${API_URL}/${id}/status`, { status });
  return data;
};

// 🟢 Create new order (customer checkout)
export const createOrder = async (orderData) => {
  const { data } = await axios.post(API_URL, orderData);
  return data;
};

// 🔴 Delete order (optional)
export const deleteOrder = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
