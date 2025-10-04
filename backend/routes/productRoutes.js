import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

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
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WEBP) are allowed."), false);
  }
};

// ✅ 2MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// 🟢 Routes
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
