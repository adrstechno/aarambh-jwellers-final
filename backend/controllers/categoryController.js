import Category from "../models/category.js";
import slugify from "slugify";

// 🟢 Add new category
export const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const category = new Category({
      name: name.trim(),
      slug: slugify(name, { lower: true }),
      parentCategory: parentCategory || null,
      image: imagePath,
    });

    await category.save();

    const populated = await Category.findById(category._id).populate(
      "parentCategory",
      "name"
    );

    res.status(201).json({
      message: "✅ Category added successfully",
      category: populated,
    });
  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
};

// 🟡 Get categories
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// 🟠 Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name, { lower: true });
    }
    if (parentCategory !== undefined) {
      updateData.parentCategory = parentCategory || null;
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("parentCategory", "name");

    if (!updated)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "✅ Category updated successfully", category: updated });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// 🔴 Delete
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
