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

import upload from "../middlewares/uploadMiddleware.js"; // ✅ Use shared Cloudinary middleware

const router = express.Router();

/* ==========================================
   🟢 Public Routes (Frontend)
========================================== */
router.get("/search", searchProducts);
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

/* ==========================================
   🔵 Admin Routes (Cloudinary Uploads)
========================================== */
router.get("/admin/list", getProducts);
router.post("/", upload.single("image"), addProduct);     // ✅ Upload to Cloudinary
router.put("/:id", upload.single("image"), updateProduct); // ✅ Update + reupload
router.delete("/:id", deleteProduct);

export default router;
