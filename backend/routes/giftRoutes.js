import express from "express";
import {
  createGift,
  getAllGifts,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../controllers/giftController.js";
import { uploadGiftImage } from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = express.Router();

// ✅ Gift routes
router.post("/", uploadGiftImage.single("image"),protect,adminOnly, createGift);
router.get("/",protect,getAllGifts);
router.put("/:id", uploadGiftImage.single("image"),protect,adminOnly, updateGift);
router.delete("/:id",protect,adminOnly, deleteGift);
router.put("/:id/status",protect,adminOnly, toggleGiftStatus);

export default router;
