import express from "express";
import multer from "multer";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* ======================================
   🗂️ Configure Multer for image upload
====================================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ======================================
   🧩 Category Routes (No Auth for Now)
====================================== */

// 🟢 Create Category
router.post("/", upload.single("image"), createCategory);

// 🟡 Get All Categories with Product Count
router.get("/", getCategoriesWithCount);

// 🟠 Update Category
router.put("/:id", upload.single("image"), updateCategory);

// 🔴 Delete Category
router.delete("/:id", deleteCategory);

export default router;
