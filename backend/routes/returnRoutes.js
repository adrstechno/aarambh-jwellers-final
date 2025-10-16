// backend/routes/returnRoutes.js
import express from "express";
import {
  createReturnRequest,
  getAllReturns,
  updateReturnStatus,
  getUserReturns,
} from "../controllers/returnController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================================================
   🧍 USER ROUTES (Customer side)
   ======================================================= */

// 🟢 Create a new return request
router.post("/create", protect, createReturnRequest);

// 🟢 Get all return requests of the logged-in user
router.get("/my", protect, getUserReturns);

/* =======================================================
   👨‍💼 ADMIN ROUTES (Admin dashboard)
   ======================================================= */

// 🟣 Get all return requests (admin)
router.get("/", protect, adminOnly, getAllReturns);

// 🟡 Update return status (admin)
router.put("/:id/status", protect, adminOnly, updateReturnStatus);

export default router;
