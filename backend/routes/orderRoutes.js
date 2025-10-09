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
import { adminOnly, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// 🟢 Create a new order (customer)
router.post("/",protect, createOrder);

// 🟣 Get all orders of a specific user (used in Users.jsx)
router.get("/user/:userId",protect, getOrdersByUser);

// 🧾 Admin: Get all orders (for admin panel table)
router.get("/admin",protect,adminOnly, getAllOrders);

// 📘 Admin: Get a single order by ID (for detailed view)
router.get("/:id",protect,adminOnly, getOrderById);

// 🔄 Update order status (Pending → Completed / Cancelled)
router.put("/:id/status",protect, adminOnly, updateOrderStatus);
// ❌ Delete an order (admin cleanup)
router.delete("/:id",protect, adminOnly, deleteOrder);

export default router;
