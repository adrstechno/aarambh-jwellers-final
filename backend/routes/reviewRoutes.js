import express from "express";
import {
  getAllReviews,
  getPaginatedReviews,
  getTopRatedProducts,
  updateReviewStatus,
  deleteReview,
  getReviewsByProduct,
  createReview,
} from "../controllers/reviewController.js";

const router = express.Router();

/* ==========================================
   🟢 PUBLIC ROUTES (Frontend)
========================================== */

// ✅ Get approved reviews for a specific product
router.get("/product/:productId", getReviewsByProduct);

// ✅ Submit a new product review
router.post("/", createReview);

/* ==========================================
   🔵 ADMIN ROUTES (Dashboard)
   Temporarily open (no auth middleware for testing)
========================================== */

// ✅ Paginated reviews (with ?page=n)
router.get("/", getPaginatedReviews);

// ✅ Get all reviews (unpaginated, rarely used)
router.get("/all", getAllReviews);

// ✅ Top-rated products summary
router.get("/top-products", getTopRatedProducts);

// ✅ Update review status (Approve/Reject/Pending)
router.put("/:id/status", updateReviewStatus);

// ✅ Delete a review
router.delete("/:id", deleteReview);

export default router;
