// backend/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  getUserOrders,
} from "../controllers/userController.js";

const router = express.Router();

// ✅ FIXED PATHS — no redundant /users here
router.get("/", getAllUsers); // GET /api/users
router.put("/:id/role", toggleUserRole); // PUT /api/users/:id/role
router.put("/:id/status", toggleUserStatus); // PUT /api/users/:id/status
router.get("/orders/user/:userId", getUserOrders); // GET /api/users/orders/user/:userId

export default router;
