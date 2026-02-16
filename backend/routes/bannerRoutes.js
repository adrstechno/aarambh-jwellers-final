import express from "express";
import {
  createBanner,
  getBanners,
  getAllBanners,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from "../controllers/bannerController.js";
import upload from "../middlewares/uploadMiddleware.js"; // ✅ shared Cloudinary upload middleware
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Get All Active Banners (Frontend)
router.get("/", getBanners);

// ✅ Get All Banners (Admin - Protected)
router.get("/all", protect, adminOnly, getAllBanners);

// ✅ Create Banner (Uploads to Cloudinary) - Protected + Admin Only
router.post("/", protect, adminOnly, upload.single("image"), createBanner);

// ✅ Update Banner (Optional image replacement) - Protected + Admin Only
router.put("/:id", protect, adminOnly, upload.single("image"), updateBanner);

// ✅ Delete Banner - Protected + Admin Only
router.delete("/:id", protect, adminOnly, deleteBanner);

// ✅ Reorder Banners - Protected + Admin Only
router.put("/reorder", protect, adminOnly, reorderBanners);

export default router;
