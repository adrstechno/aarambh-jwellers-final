import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId",protect, getCart);
router.post("/add",protect, addToCart);
router.put("/update",protect, updateQuantity);
router.post("/remove",protect, removeItem);
router.post("/clear",protect, clearCart);

export default router;
