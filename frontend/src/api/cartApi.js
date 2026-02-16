import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const CART_API = `${API_BASE}/cart`;

/* =======================================================
   🧩 Helper: Handle Errors & Missing User
======================================================= */
const ensureUserId = (userId) => {
  if (!userId || userId === "undefined") {
    console.warn("⚠️ No valid userId provided for cart API call.");
    throw new Error("Invalid or missing user ID.");
  }
};

const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw error;
};

/* =======================================================
   🟢 Get Cart
======================================================= */
export const getCart = async (userId, token) => {
  try {
    ensureUserId(userId);
    const { data } = await axios.get(`${CART_API}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    handleError("fetching cart", err);
  }
};

/* =======================================================
   🟡 Add to Cart
======================================================= */
export const addToCartAPI = async (userId, productId, quantity, token) => {
  try {
    ensureUserId(userId);
    const { data } = await axios.post(
      `${CART_API}`,
      { userId, productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    handleError("adding to cart", err);
  }
};

/* =======================================================
   🟠 Update Quantity
======================================================= */
export const updateQuantityAPI = async (userId, productId, quantity, token) => {
  try {
    ensureUserId(userId);
    const { data } = await axios.put(
      `${CART_API}/update`,
      { userId, productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    handleError("updating quantity", err);
  }
};

/* =======================================================
   🔴 Remove from Cart
======================================================= */
export const removeFromCartAPI = async (userId, productId, token) => {
  try {
    ensureUserId(userId);
    const { data } = await axios.put(
      `${CART_API}/remove`,
      { userId, productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    handleError("removing from cart", err);
  }
};

/* =======================================================
   ⚫ Clear Cart
======================================================= */
export const clearCartAPI = async (userId, token) => {
  try {
    ensureUserId(userId);
    const { data } = await axios.delete(`${CART_API}/clear`, {
      data: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    handleError("clearing cart", err);
  }
};
