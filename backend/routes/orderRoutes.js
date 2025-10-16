// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
  getUserOrders, // ✅ for logged-in user (self)
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================================================
   🧍 USER ROUTES (Customer-side APIs)
   ======================================================= */

// 🟢 Create a new order
router.post("/", protect, createOrder);

// 🟢 Get all orders for the currently logged-in user (frontend “My Orders” page)
router.get("/user", protect, getUserOrders);

// 🟣 Get all orders of a specific user (used in admin panel user details)
router.get("/user/:userId", protect, adminOnly, getOrdersByUser);

/* =======================================================
   👨‍💼 ADMIN ROUTES (Admin Dashboard APIs)
   ======================================================= */

// 🧾 Admin: Get all orders (for admin orders table)
router.get("/admin", protect, adminOnly, getAllOrders);

// 📘 Admin: Get a single order by ID
router.get("/:id", protect, adminOnly, getOrderById);

// 🔄 Admin: Update order status (Pending → Completed / Cancelled)
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// ❌ Admin: Delete an order
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
