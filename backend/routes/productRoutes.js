import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
  searchProducts,
  getProducts,
} from "../controllers/productController.js";

import { uploadMultiple } from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==========================================
   🟢 Public Routes (Frontend)
========================================== */
router.get("/search", searchProducts);
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/category/:category", getProductsByCategory);

/* ==========================================
   🔵 Admin Routes (with Cloudinary Uploads)
========================================== */
router.get("/admin/list", protect, adminOnly, getProducts);

// ✅ Add product — multiple images (Protected + Admin Only)
router.post("/", protect, adminOnly, uploadMultiple, addProduct);

// ✅ Update product — multiple images (Protected + Admin Only)
router.put("/:id", protect, adminOnly, uploadMultiple, updateProduct);

// ✅ Delete product (Protected + Admin Only)
router.delete("/:id", protect, adminOnly, deleteProduct);

// ✅ Get product by ID (keep last)
router.get("/:id", getProductById);

export default router;
