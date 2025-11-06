// backend/routes/reelRoutes.js
import express from "express";
import {
  getAllReels,
  createReel,
  updateReel,
  deleteReel,
  reorderReels,
} from "../controllers/reelController.js";
import { uploadVideoSingle } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllReels);
router.post("/", uploadVideoSingle, createReel);
router.put("/reorder", reorderReels);
router.put("/:id", uploadVideoSingle, updateReel);
router.delete("/:id", deleteReel);


export default router;
