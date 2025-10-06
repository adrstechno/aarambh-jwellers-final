// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
} from "../controllers/orderController.js";

const router = express.Router();

// 🟢 Create a new order (customer)
router.post("/", createOrder);

// 🟣 Get all orders of a specific user (used in Users.jsx)
router.get("/user/:userId", getOrdersByUser);

// 🧾 Admin: Get all orders (for admin panel table)
router.get("/admin", getAllOrders);

// 📘 Admin: Get a single order by ID (for detailed view)
router.get("/:id", getOrderById);

// 🔄 Update order status (Pending → Completed / Cancelled)
router.put("/:id/status", updateOrderStatus);

// ❌ Delete an order (admin cleanup)
router.delete("/:id", deleteOrder);

export default router;
