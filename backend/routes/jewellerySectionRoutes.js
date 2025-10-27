import express from "express";
import multer from "multer";
import {
  getJewellerySection,
  upsertJewellerySection,
} from "../controllers/jewellerySectionController.js";

const router = express.Router();

// 🧩 File Upload setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`),
});
const upload = multer({ storage });

// USER ROUTE
router.get("/", getJewellerySection);

// ADMIN ROUTE
router.post(
  "/update",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "modelImage", maxCount: 1 },
  ]),
  upsertJewellerySection
);

export default router;
