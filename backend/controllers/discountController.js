import Discount from "../models/discount.js";
import Category from "../models/category.js";

// Get all discounts
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get active discount (most recent active one)
export const getActiveDiscount = async (req, res) => {
  try {
    const discount = await Discount.findOne({ isActive: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    if (!discount) return res.status(404).json({ message: "No active discount" });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Optional: Get discounts by category
export const getDiscountsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const discounts = await Discount.find({ category: category._id });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
