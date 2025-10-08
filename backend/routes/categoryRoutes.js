import express from "express";
import multer from "multer";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

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
router.post("/", upload.single("image"), createCategory); // <-- Important fix
router.get("/", getCategoriesWithCount);
router.put("/:id", upload.single("image"), updateCategory); // <-- Fix update route too
router.delete("/:id", deleteCategory);

export default router;
