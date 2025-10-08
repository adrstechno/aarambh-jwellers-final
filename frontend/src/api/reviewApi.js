import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/reviews";

// 🟢 Get all reviews for a product
export const getReviewsByProduct = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}`);
  return res.data;
};

// 🟢 Add new review
export const addReview = async (productId, reviewData, token) => {
  const res = await axios.post(`${API_BASE}`, 
    { productId, ...reviewData },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// 🟢 Get average rating
export const getAverageRating = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}/average`);
  return res.data;
};
