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

const router = express.Router();

// ✅ Get All Active Banners (Frontend)
router.get("/", getBanners);

// ✅ Get All Banners (Admin)
router.get("/all", getAllBanners);

// ✅ Create Banner (Uploads to Cloudinary)
router.post("/", upload.single("image"), createBanner);

// ✅ Update Banner (Optional image replacement)
router.put("/:id", upload.single("image"), updateBanner);

// ✅ Delete Banner
router.delete("/:id", deleteBanner);

// ✅ Reorder Banners
router.put("/reorder", reorderBanners);

export default router;
