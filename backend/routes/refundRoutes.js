// backend/routes/refundRoutes.js
import express from "express";
import {
  getAllRefunds,
  getUserRefunds,
  createRefund,
  createRefundRequest,
  updateRefundStatus,
  deleteRefund,
} from "../controllers/refundController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================================================
   🧍 USER ROUTES (Customer-side)
   ======================================================= */

// 🟢 Create a refund request (linked to return)
router.post("/create", protect, createRefundRequest);

// 🟣 Get refunds of the logged-in user
router.get("/my", protect, getUserRefunds);

/* =======================================================
   👨‍💼 ADMIN ROUTES (Admin panel)
   ======================================================= */

// 🧾 Get all refunds (Admin)
router.get("/", protect, adminOnly, getAllRefunds);

// 🟡 Create refund manually (Admin)
router.post("/", protect, adminOnly, createRefund);

// 🔄 Update refund status (Admin)
router.put("/:id/status", protect, adminOnly, updateRefundStatus);

// ❌ Delete refund (Admin)
router.delete("/:id", protect, adminOnly, deleteRefund);

export default router;
