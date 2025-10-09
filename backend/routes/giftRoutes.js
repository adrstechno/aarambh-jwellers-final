import express from "express";
import {
  createGift,
  getAllGifts,
  updateGift,
  deleteGift,
  toggleGiftStatus,
} from "../controllers/giftController.js";
import { uploadGiftImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ✅ Gift routes
router.post("/", uploadGiftImage.single("image"), createGift);
router.get("/", getAllGifts);
router.put("/:id", uploadGiftImage.single("image"), updateGift);
router.delete("/:id", deleteGift);
router.put("/:id/status", toggleGiftStatus);

export default router;
