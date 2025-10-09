import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REVIEW_API = `${API_BASE}/reviews`;

export const getAllReviews = async () => {
  const { data } = await axios.get(REVIEW_API);
  return data;
};

export const updateReviewStatus = async (id, status) => {
  const { data } = await axios.put(`${REVIEW_API}/${id}/status`, { status });
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await axios.delete(`${REVIEW_API}/${id}`);
  return data;
};

export const getPaginatedReviews = async (page = 1, limit = 10) => {
  const { data } = await axios.get(`${REVIEW_API}?page=${page}&limit=${limit}`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await axios.get(`${REVIEW_API}/top-rated`);
  return data;
};

// ✅ Fetch reviews by product (for Products.jsx)
export const getReviewsByProduct = async (productId) => {
  const { data } = await axios.get(`${REVIEW_API}/product/${productId}`);
  return data;
};