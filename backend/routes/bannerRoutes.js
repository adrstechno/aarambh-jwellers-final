import express from "express";
import multer from "multer";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from "../controllers/bannerController.js";

const router = express.Router();

// 🧩 Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Order of routes matters! Define “/reorder” first
router.put("/reorder", reorderBanners);

// 🟢 Create Banner
router.post("/", upload.single("image"), createBanner);

// 🟡 Get All Banners
router.get("/", getBanners);

// 🟠 Update Banner
router.put("/:id", upload.single("image"), updateBanner);

// 🔴 Delete Banner
router.delete("/:id", deleteBanner);

export default router;
