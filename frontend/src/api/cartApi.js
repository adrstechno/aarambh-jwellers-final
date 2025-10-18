import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const CART_API = `${API_BASE}/cart`;

// 🟢 Get cart
export const getCart = async (userId, token) => {
  const { data } = await axios.get(`${CART_API}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🟡 Add to cart
export const addToCartAPI = async (userId, productId, quantity, token) => {
  const { data } = await axios.post(
    `${CART_API}`,
    { userId, productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// 🟠 Update quantity
export const updateQuantityAPI = async (userId, productId, quantity, token) => {
  const { data } = await axios.put(
    `${CART_API}/update`,
    { userId, productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// 🔴 Remove item
export const removeFromCartAPI = async (userId, productId, token) => {
  const { data } = await axios.put(
    `${CART_API}/remove`,
    { userId, productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ⚫ Clear cart
export const clearCartAPI = async (userId, token) => {
  const { data } = await axios.delete(`${CART_API}/clear`, {
    data: { userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
