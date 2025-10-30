import express from "express";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
  getActiveCategories,
} from "../controllers/categoryController.js";

import upload from "../middlewares/uploadMiddleware.js"; // ✅ shared Cloudinary upload middleware

const router = express.Router();

/* ======================================
   🧩 Category Routes (Now using Cloudinary)
====================================== */

// 🟢 Create Category (uploads to Cloudinary)
router.post("/", upload.single("image"), createCategory);

// 🟡 Get All Categories with Product Count
router.get("/", getCategoriesWithCount);

// 🟠 Update Category (optional Cloudinary re-upload)
router.put("/:id", upload.single("image"), updateCategory);

// 🔴 Delete Category
router.delete("/:id", deleteCategory);

// 🌐 Get Active Categories (for Navigation / Home)
router.get("/active", getActiveCategories);

export default router;
