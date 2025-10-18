import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

/* ============================================
   🟢 Create Category
============================================ */
export const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // 🔎 Check for duplicates (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // 🖼️ Image path (optional)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "/placeholder.jpg";

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

/* ============================================
   🟡 Get Categories with Product Count
============================================ */
export const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      { $unwind: { path: "$parentCategory", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          name: 1,
          slug: 1,
          image: 1,
          productCount: 1,
          "parentCategory._id": 1,
          "parentCategory.name": 1,
        },
      },
    ]);

    // ✅ Always return consistent structure
    res.status(200).json({ categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ============================================
   🟠 Update Category
============================================ */
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

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "✅ Category updated successfully",
      category: updated,
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

/* ============================================
   🔴 Delete Category (with image cleanup)
============================================ */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // 🧹 Delete image if exists (excluding placeholder)
    if (category.image && !category.image.includes("placeholder")) {
      const imagePath = path.join(process.cwd(), category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`🗑️ Deleted image: ${imagePath}`);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "🗑️ Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
