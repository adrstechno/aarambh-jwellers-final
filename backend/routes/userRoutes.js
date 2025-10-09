// backend/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  getUserOrders,
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// ✅ FIXED PATHS — no redundant /users here
router.get("/",protect,adminOnly, getAllUsers); // GET /api/users
router.put("/:id/role",protect,adminOnly, toggleUserRole); // PUT /api/users/:id/role
router.put("/:id/status",protect,adminOnly, toggleUserStatus); // PUT /api/users/:id/status
router.get("/orders/user/:userId",protect,adminOnly, getUserOrders); // GET /api/users/orders/user/:userId

export default router;
