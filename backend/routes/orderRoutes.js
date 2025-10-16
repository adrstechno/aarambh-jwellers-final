import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ============================
   🧍 USER ROUTES
============================ */
router.post("/", createOrder);
router.get("/my-orders", getUserOrders);

/* ============================
   👨‍💼 ADMIN ROUTES
============================ */
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
