import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REVIEW_API = `${API_BASE}/reviews`;

/* ==========================================================
   🔧 Helper for error handling
========================================================== */
const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(
    error.response?.data?.message || `Failed to ${action}`
  );
};

/* ==========================================================
   🟢 Get all reviews (unpaginated — admin only)
========================================================== */
export const getAllReviews = async () => {
  try {
    const { data } = await axios.get(`${REVIEW_API}/all`);
    return data;
  } catch (error) {
    handleError("fetching all reviews", error);
  }
};

/* ==========================================================
   🟢 Get paginated reviews (admin dashboard)
========================================================== */
export const getPaginatedReviews = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(`${REVIEW_API}?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    handleError("fetching paginated reviews", error);
  }
};

/* ==========================================================
   ⭐ Get top-rated products
========================================================== */
export const getTopRatedProducts = async () => {
  try {
    const { data } = await axios.get(`${REVIEW_API}/top-products`);
    return data;
  } catch (error) {
    handleError("fetching top-rated products", error);
  }
};

/* ==========================================================
   🟡 Update review status (Approve/Reject/Pending)
========================================================== */
export const updateReviewStatus = async (id, status) => {
  try {
    const { data } = await axios.put(`${REVIEW_API}/${id}/status`, { status });
    return data;
  } catch (error) {
    handleError("updating review status", error);
  }
};

/* ==========================================================
   🔴 Delete a review
========================================================== */
export const deleteReview = async (id) => {
  try {
    const { data } = await axios.delete(`${REVIEW_API}/${id}`);
    return data;
  } catch (error) {
    handleError("deleting review", error);
  }
};

/* ==========================================================
   🧩 Get reviews for a specific product (public view)
========================================================== */
export const getReviewsByProduct = async (productId) => {
  try {
    const { data } = await axios.get(`${REVIEW_API}/product/${productId}`);
    return data;
  } catch (error) {
    handleError("fetching product reviews", error);
  }
};

/* ==========================================================
   ✍️ Add new product review (user/public)
========================================================== */
export const addReview = async (reviewData) => {
  try {
    const { data } = await axios.post(REVIEW_API, reviewData);
    return data;
  } catch (error) {
    handleError("submitting review", error);
  }
};
