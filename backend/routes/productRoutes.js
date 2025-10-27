import express from "express";
import multer from "multer";
import path from "path";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,searchProducts
} from "../controllers/productController.js";

const router = express.Router();

/* ==========================================
   ⚙️ Multer setup for image uploads
========================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (JPG, PNG, WEBP) are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

/* ==========================================
   🟢 PUBLIC ROUTES (for website frontend)
========================================== */
router.get("/search", searchProducts);

// ✅ Get all active products
router.get("/", getAllProducts);

// ✅ Get products by category slug
router.get("/category/:category", getProductsByCategory);

// ✅ Get product by slug (must come before :id)
router.get("/slug/:slug", getProductBySlug);

// ✅ Get product by ID
router.get("/:id", getProductById);

/* ==========================================
   🔵 ADMIN ROUTES (for admin panel)
   Temporarily open for testing (no protect/adminOnly)
========================================== */

// Add a new product
router.post("/", upload.single("image"), addProduct);

// Update product
router.put("/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
