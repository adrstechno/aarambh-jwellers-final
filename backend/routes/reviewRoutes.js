// backend/routes/reviewRoutes.js
import express from "express";
import {
  getAllReviews,
  getPaginatedReviews,
  getTopRatedProducts,
  updateReviewStatus,
  deleteReview, getReviewsByProduct, createReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = express.Router();

// 🟢 All reviews (for admin view)
router.get("/all", getAllReviews);

// 🟢 Paginated reviews
router.get("/", getPaginatedReviews);

// 🟢 Top-rated products (used in dashboard)
router.get("/top-rated", getTopRatedProducts);

// 🟠 Update review status (approve/reject)
router.put("/:id/status",protect,adminOnly, updateReviewStatus);

// 🔴 Delete a review
router.delete("/:id", protect, deleteReview);

router.get("/product/:productId", getReviewsByProduct); 

router.post("/", createReview);

export default router;
