// src/api/wishlistApi.js
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// ✅ Get wishlist
export const getWishlist = async (userId, token) => {
  const { data } = await axios.get(`${API_BASE}/wishlist/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Add to wishlist
export const addToWishlistAPI = async (userId, productId, token) => {
  const { data } = await axios.post(
    `${API_BASE}/wishlist/add`,
    { userId, productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// ✅ Remove from wishlist
export const removeFromWishlistAPI = async (userId, productId, token) => {
  const { data } = await axios.post(
    `${API_BASE}/wishlist/remove`,
    { userId, productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
