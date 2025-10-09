import express from "express";
import {
  getAllRefunds,
  createRefund,
  updateRefundStatus,
  deleteRefund,
} from "../controllers/refundController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/",protect, getAllRefunds);
router.post("/",protect, createRefund);
router.put("/:id",protect,adminOnly, updateRefundStatus);
router.delete("/:id",protect,adminOnly, deleteRefund);

export default router;
