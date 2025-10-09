// backend/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById, getProductBySlug,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ⚙️ Multer setup for image uploads (optional)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// ✅ File filter (only allow image files)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (JPG, PNG, WEBP) are allowed."), false);
};

// ✅ 2MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/* 🟢 PUBLIC ROUTES — For Website Frontend */
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);
router.get("/:slug", getProductBySlug); 
router.get("/category/:category", getProductsByCategory);


/* 🔵 ADMIN ROUTES — For Admin Panel */
router.post("/", upload.single("image"),protect,adminOnly, addProduct);
router.put("/:id", upload.single("image"),protect, adminOnly, updateProduct);
router.delete("/:id",protect, adminOnly, deleteProduct);

export default router;
