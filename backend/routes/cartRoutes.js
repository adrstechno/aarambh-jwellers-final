import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ✅ Get user's cart
router.get("/:userId", getCart);

// ✅ Add item to cart
router.post("/", addToCart);

// ✅ Update item quantity
router.put("/update", updateQuantity);

// ✅ Remove an item
router.put("/remove", removeItem);

// ✅ Clear full cart
router.delete("/clear", clearCart);

export default router;
