// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelUserOrder,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"; // ✅ Un-commented

const router = express.Router();

/* ============================
   🧍 USER ROUTES
============================ */
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelUserOrder); // ✅ Added protect + cancel route

/* ============================
   👨‍💼 ADMIN ROUTES
   Put specific admin routes BEFORE the dynamic :id
============================ */
router.get("/admin", protect, adminOnly, getAllOrders); // ✅ Secure for admin
router.get("/", protect, adminOnly, getAllOrders);
router.get("/user/:userId", protect, adminOnly, getOrdersByUser);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);
router.get("/:id", protect, getOrderById); // user can view their own order

export default router;
