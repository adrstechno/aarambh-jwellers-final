import express from "express";
import {
  createCategory,
  getCategoriesWithCount,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// 🟢 Routes
router.post("/", createCategory); // Add new category
router.get("/", getCategoriesWithCount); // Get all with product count
router.put("/:id", updateCategory); // Update name only
router.delete("/:id", deleteCategory); // Delete category

export default router;
