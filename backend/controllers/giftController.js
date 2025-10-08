import GiftCategory from "../models/giftCategory.js";
import Product from "../models/product.js";

// Get all gift categories
export const getGiftCategories = async (req, res) => {
  try {
    const gifts = await GiftCategory.find();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get single gift category by slug
export const getGiftCategoryBySlug = async (req, res) => {
  try {
    const category = await GiftCategory.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// (Optional) Get products under a gift category
export const getProductsByGiftCategory = async (req, res) => {
  try {
    const category = await GiftCategory.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Gift category not found" });

    const products = await Product.find({ giftCategory: category._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
