import express from "express";
import {
  getDiscounts,
  getActiveDiscount,
  getDiscountsByCategory
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/", getDiscounts);
router.get("/active", getActiveDiscount);
router.get("/category/:slug", getDiscountsByCategory);

export default router;
