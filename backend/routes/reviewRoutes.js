// backend/routes/reviewRoutes.js
import express from "express";
import {
  getAllReviews,
  getPaginatedReviews,
  getTopRatedProducts,
  updateReviewStatus,
  deleteReview, getReviewsByProduct,
} from "../controllers/reviewController.js";

const router = express.Router();

// 🟢 All reviews (for admin view)
router.get("/all", getAllReviews);

// 🟢 Paginated reviews
router.get("/", getPaginatedReviews);

// 🟢 Top-rated products (used in dashboard)
router.get("/top-rated", getTopRatedProducts);

// 🟠 Update review status (approve/reject)
router.put("/:id/status", updateReviewStatus);

// 🔴 Delete a review
router.delete("/:id", deleteReview);

router.get("/product/:productId", getReviewsByProduct); 

export default router;
