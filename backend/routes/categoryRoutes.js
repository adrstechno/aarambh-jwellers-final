import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,getActiveCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

/* ======================================
   🗂️ Multer Configuration for Image Upload
====================================== */

// ✅ Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// ✅ Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// ✅ Basic file filter (optional: restrict to images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, or WEBP images are allowed"), false);
  }
};

// ✅ Initialize multer instance
const upload = multer({ storage, fileFilter });

/* ======================================
   🧩 Category Routes (Public for now)
====================================== */

// 🟢 Create Category
router.post("/", upload.single("image"), createCategory);

// 🟡 Get All Categories with Product Count
router.get("/", getCategoriesWithCount);

// 🟠 Update Category
router.put("/:id", upload.single("image"), updateCategory);

// 🔴 Delete Category
router.delete("/:id", deleteCategory);
router.get("/active", getActiveCategories);

export default router;
