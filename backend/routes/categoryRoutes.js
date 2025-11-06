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

const router = express.Router();

/* ======================================
   🧩 Category Routes (Cloudinary Enabled)
====================================== */

// 🟢 Create Category
router.post("/", upload.single("image"), createCategory);

// 🟡 Get All Categories (with Product Count)
router.get("/", getCategoriesWithCount);

// 🟢 Reorder Categories (⚡ must be before :id)
router.put("/reorder", reorderCategories);

// 🟠 Update Category (with optional Cloudinary re-upload)
router.put("/:id", upload.single("image"), updateCategory);

// 🔴 Delete Category
router.delete("/:id", deleteCategory);

// 🌐 Get Active Categories
router.get("/active", getActiveCategories);

export default router;
