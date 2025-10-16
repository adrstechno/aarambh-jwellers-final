import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../controllers/discountController.js";
// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createDiscount);
router.get("/", getAllDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);
router.patch("/:id/toggle", toggleDiscountStatus);

export default router;
