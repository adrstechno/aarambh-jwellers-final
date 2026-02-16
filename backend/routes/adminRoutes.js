import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";
import { uploadSingle } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🟢 Fetch logged-in admin profile
router.get("/profile", protect, adminOnly, getAdminProfile);

// 🟠 Update profile
router.put("/update-profile", protect, adminOnly, uploadSingle, updateAdminProfile);

export default router;
