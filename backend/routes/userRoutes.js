import express from "express";
import {
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  getUserOrders,
  getProfile,
  changePassword,
  updateProfile,
  makeAdmin,
  removeAdmin,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================================================
   👑 ADMIN ROUTES — PROTECTED WITH `adminOnly`
======================================================= */

// 🟢 Get all users (Admin)
router.get("/", protect, adminOnly, getAllUsers);

// 🟢 Toggle user active/block status (Admin)
router.put("/:id/status", protect, adminOnly, toggleUserStatus);

// 🟢 Toggle user role (Customer ↔ Admin)
router.put("/:id/role", protect, adminOnly, toggleUserRole);

// 🟢 Promote user to Admin
router.put("/make-admin/:id", protect, adminOnly, makeAdmin);

// 🟢 Revoke Admin privileges
router.put("/remove-admin/:id", protect, adminOnly, removeAdmin);

// 🟣 Fetch orders for specific user
router.get("/:userId/orders", protect, adminOnly, getUserOrders);

/* =======================================================
   👤 AUTHENTICATED USER ROUTES
======================================================= */

// 🟢 Get profile (logged-in user)
router.get("/me", protect, getProfile);

// 🟡 Update profile
router.put("/me", protect, updateProfile);

// 🔒 Change password
router.put("/change-password", protect, changePassword);

export default router;
