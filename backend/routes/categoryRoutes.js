import express from "express";
import multer from "multer";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = express.Router();

// 🗂️ Configure Multer for image upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Routes
router.post("/", upload.single("image"),protect,adminOnly, createCategory); // <-- Important fix
router.get("/",protect,adminOnly, getCategoriesWithCount);
router.put("/:id", upload.single("image"),protect,adminOnly, updateCategory); // <-- Fix update route too
router.delete("/:id",protect,adminOnly, deleteCategory);

export default router;
