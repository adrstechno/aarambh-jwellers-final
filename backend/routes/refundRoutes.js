import express from "express";
import {
  getAllRefunds,
  createRefund,
  updateRefundStatus,
  deleteRefund,
  createRefundRequest,
  getUserRefunds,
} from "../controllers/refundController.js";


const router = express.Router();

// 👨‍💼 Admin routes
router.get("/", getAllRefunds);
router.post("/",createRefund);
router.put("/:id/status", updateRefundStatus);
router.delete("/:id", deleteRefund);

// 🧍 User routes
router.post("/request",  createRefundRequest);
router.get("/my-refunds",  getUserRefunds);

export default router;
