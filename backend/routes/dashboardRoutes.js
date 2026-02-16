import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👨‍💼 Admin Dashboard Overview (Protected + Admin Only)
router.get("/", protect, adminOnly, getDashboardStats);

export default router;
