import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const getCart = async (userId, token) => {
  const { data } = await axios.get(`${API_BASE}/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addToCartAPI = async (userId, productId, quantity, token) => {
  const { data } = await axios.post(
    `${API_BASE}/cart/add`,
    { userId, productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const updateQuantityAPI = async (userId, productId, quantity, token) => {
  const { data } = await axios.put(
    `${API_BASE}/cart/update`,
    { userId, productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const removeFromCartAPI = async (userId, productId, token) => {
  const { data } = await axios.post(
    `${API_BASE}/cart/remove`,
    { userId, productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const clearCartAPI = async (userId, token) => {
  const { data } = await axios.post(
    `${API_BASE}/cart/clear`,
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
