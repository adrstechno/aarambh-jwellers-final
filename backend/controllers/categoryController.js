import Category from "../models/category.js";
import slugify from "slugify";
import Product from "../models/product.js";

// 🟢 Add new category (only name required)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check duplicate
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      slug: slugify(name, { lower: true }),
    });

    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error while creating category" });
  }
};

// 🟡 Get all categories with product count
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const result = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return { ...cat.toObject(), productCount };
      })
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// 🟠 Update category (only name allowed)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name: name.trim(), slug: slugify(name, { lower: true }) },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// 🔴 Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
