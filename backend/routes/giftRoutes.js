import express from "express";
import multer from "multer";
import path from "path";
import {
  createGift,
  getAllGifts,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../controllers/giftController.js";
// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🧩 Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only image files are allowed"));
  },
});

// ✅ Routes
router.get("/", getAllGifts);
router.post("/", upload.single("image"), createGift);
router.put("/:id", upload.single("image"), updateGift);
router.delete("/:id", deleteGift);
router.patch("/:id/toggle", toggleGiftStatus);

export default router;
