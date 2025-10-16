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

router.get("/:userId",getCart);
router.post("/add",addToCart);
router.put("/update",updateQuantity);
router.post("/remove",removeItem);
router.post("/clear",clearCart);

export default router;
