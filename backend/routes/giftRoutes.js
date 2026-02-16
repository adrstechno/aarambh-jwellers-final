import express from "express";
import {
  createGift,
  getAllGifts,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../controllers/giftController.js";
import upload from "../middlewares/uploadMiddleware.js"; // ✅ Cloudinary-based middleware
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Routes
router.get("/", getAllGifts);
router.post("/", protect, adminOnly, upload.single("image"), createGift);
router.put("/:id", protect, adminOnly, upload.single("image"), updateGift);
router.delete("/:id", protect, adminOnly, deleteGift);
router.patch("/:id/toggle", protect, adminOnly, toggleGiftStatus);

export default router;
