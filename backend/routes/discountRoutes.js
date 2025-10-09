import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../controllers/discountController.js";

const router = express.Router();

router.post("/", createDiscount);
router.get("/", getAllDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);
router.put("/:id/status", toggleDiscountStatus);

export default router;
