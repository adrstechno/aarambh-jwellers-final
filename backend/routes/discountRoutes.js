import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../controllers/discountController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/",protect,adminOnly, createDiscount);
router.get("/", getAllDiscounts);
router.put("/:id",protect,adminOnly, updateDiscount);
router.delete("/:id",protect,adminOnly, deleteDiscount);
router.put("/:id/status",protect,adminOnly, toggleDiscountStatus);

export default router;
