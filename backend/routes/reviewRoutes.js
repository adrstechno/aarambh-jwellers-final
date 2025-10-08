import express from "express";
import {
  addReview,
  getReviewsByProduct,
  deleteReview,
  getAverageRating
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:productId", getReviewsByProduct);
router.get("/:productId/average", getAverageRating);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;
