import express from "express";
import {
  createGift,
  getAllGifts,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../controllers/giftController.js";
import upload from "../middlewares/uploadMiddleware.js"; // ✅ Cloudinary-based middleware

const router = express.Router();

// ✅ Routes
router.get("/", getAllGifts);
router.post("/", upload.single("image"), createGift);
router.put("/:id", upload.single("image"), updateGift);
router.delete("/:id", deleteGift);
router.patch("/:id/toggle", toggleGiftStatus);

export default router;
