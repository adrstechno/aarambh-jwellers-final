import express from "express";
import {
  getGiftCategories,
  getGiftCategoryBySlug,
  getProductsByGiftCategory
} from "../controllers/giftController.js";

const router = express.Router();

router.get("/categories", getGiftCategories);
router.get("/categories/:slug", getGiftCategoryBySlug);
router.get("/categories/:slug/products", getProductsByGiftCategory);

export default router;
