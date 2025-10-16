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

const router = express.Router();

/* ============================
   👑 ADMIN ROUTES (temporarily public)
============================ */

// 🟢 Get all users (Temporarily public)
router.get("/", getAllUsers);

// 🟢 Toggle user active/block status
router.put("/:id/status", toggleUserStatus);

// 🟢 Toggle user role (Customer/Admin)
router.put("/:id/role", toggleUserRole);

// 🟢 Promote user to Admin
router.put("/make-admin/:id", makeAdmin);

// 🟢 Revoke Admin privileges
router.put("/remove-admin/:id", removeAdmin);

// 🟢 Get all orders of a specific user
router.get("/:userId/orders", getUserOrders);

/* ============================
   👤 AUTHENTICATED USER ROUTES
============================ */

// 🟢 Get profile (logged-in user)
router.get("/profile", getUserProfile);

// 🟢 Update profile
router.put("/profile", updateUserProfile);

// 🟢 Change password
router.put("/change-password", updateUserPassword);

export default router;
