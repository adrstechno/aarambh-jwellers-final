import express from "express";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  reorderCategories,
} from "../controllers/categoryController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ======================================
   🧩 Category Routes (Cloudinary Enabled)
====================================== */

// 🟢 Create Category (Protected + Admin Only)
router.post("/", protect, adminOnly, upload.single("image"), createCategory);

// 🟡 Get All Categories (with Product Count)
router.get("/", getCategoriesWithCount);

// 🟢 Reorder Categories (⚡ must be before :id) - Protected + Admin Only
router.put("/reorder", protect, adminOnly, reorderCategories);

// 🟠 Update Category (with optional Cloudinary re-upload) - Protected + Admin Only
router.put("/:id", protect, adminOnly, upload.single("image"), updateCategory);

// 🔴 Delete Category - Protected + Admin Only
router.delete("/:id", protect, adminOnly, deleteCategory);

// 🌐 Get Active Categories
router.get("/active", getActiveCategories);

export default router;
