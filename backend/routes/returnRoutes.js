import express from "express";
import {
  getAllReturns,
  updateReturnStatus,
  deleteReturn,
  createReturnRequest,
  getUserReturns,
} from "../controllers/returnController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"; // ✅ Import middleware

const router = express.Router();

/* ============================================================
   👤 USER ROUTES (Protected)
============================================================ */
router.post("/request", protect, createReturnRequest); // ✅ User must be logged in
router.get("/my-returns", protect, getUserReturns);

/* ============================================================
   👨‍💼 ADMIN ROUTES (Protected + Admin Only)
============================================================ */
router.get("/", protect, adminOnly, getAllReturns);
router.put("/:id/status", protect, adminOnly, updateReturnStatus);
router.delete("/:id", protect, adminOnly, deleteReturn);

export default router;
