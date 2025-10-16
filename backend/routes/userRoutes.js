// backend/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  getUserOrders,
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  makeAdmin,
  removeAdmin,
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ============================
   👑 ADMIN ROUTES
============================ */

// 🟢 Get all users (Admin)
router.get("/", protect, adminOnly, getAllUsers);

// 🟢 Toggle user active/block status
router.put("/:id/status", protect, adminOnly, toggleUserStatus);

// 🟢 Toggle user role (Customer/Admin)
router.put("/:id/role", protect, adminOnly, toggleUserRole);

// 🟢 Promote user to Admin
router.put("/make-admin/:id", protect, adminOnly, makeAdmin);

// 🟢 Revoke Admin privileges
router.put("/remove-admin/:id", protect, adminOnly, removeAdmin);

// 🟢 Get all orders of a specific user
router.get("/:userId/orders", protect, adminOnly, getUserOrders);

/* ============================
   👤 AUTHENTICATED USER ROUTES
============================ */

// 🟢 Get profile (logged-in user)
router.get("/profile", protect, getUserProfile);

// 🟢 Update profile
router.put("/profile", protect, updateUserProfile);

// 🟢 Change password
router.put("/change-password", protect, updateUserPassword);

export default router;
