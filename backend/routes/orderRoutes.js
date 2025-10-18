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
   Put more specific admin routes BEFORE the dynamic :id route
============================ */
// explicit admin listing (frontend calls /admin)
router.get("/admin", getAllOrders);

// also keep root GET/ for backward compatibility if needed
router.get("/", getAllOrders);

// orders for a specific user (admin)
router.get("/user/:userId", getOrdersByUser);

// get single order by id (must come after /user/:userId and /admin)
router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
