import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";


const router = express.Router();

// 👨‍💼 Admin Dashboard Overview
router.get("/",getDashboardStats);

export default router;
