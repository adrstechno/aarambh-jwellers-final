import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ===========================================================
   🟢 CREATE CATEGORY (with Cloudinary upload)
=========================================================== */
export const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // 🔎 Check for duplicates
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imageUrl = "/placeholder.jpg";

    // ✅ Upload to Cloudinary if file exists
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers/categories",
        transformation: [{ width: 600, height: 600, crop: "limit" }],
      });
      imageUrl = uploadResult.secure_url;

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    // 🟢 Determine next order index
    const highestOrder = await Category.findOne().sort({ order: -1 }).select("order");
    const nextOrder = highestOrder ? highestOrder.order + 1 : 0;

    const category = new Category({
      name: name.trim(),
      slug: slugify(name, { lower: true }),
      parentCategory: parentCategory || null,
      image: imageUrl,
      order: nextOrder, // ✅ maintain consistent ordering
    });

    await category.save();

    const populated = await Category.findById(category._id).populate("parentCategory", "name");

    res.status(201).json({
      message: "✅ Category added successfully",
      category: populated,
    });
  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
};

/* ===========================================================
   🟢 GET CATEGORIES WITH PRODUCT COUNT
=========================================================== */
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
      { $sort: { order: 1, createdAt: -1 } }, // ✅ sort by order first
      {
        $project: {
          name: 1,
          slug: 1,
          image: 1,
          productCount: 1,
          order: 1, // ✅ include order in output
          "parentCategory._id": 1,
          "parentCategory.name": 1,
        },
      },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ===========================================================
   🟡 UPDATE CATEGORY (with Cloudinary support)
=========================================================== */
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

    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers/categories",
        transformation: [{ width: 600, height: 600, crop: "limit" }],
      });
      updateData.image = uploadResult.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("parentCategory", "name");

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "✅ Category updated successfully", category: updated });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

/* ===========================================================
   🗑️ DELETE CATEGORY
=========================================================== */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/* ===========================================================
   🌐 GET ACTIVE CATEGORIES (for navigation)
=========================================================== */
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null })
      .select("name slug image order")
      .sort({ order: 1, name: 1 }); // ✅ sort by order

    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ===========================================================
   🔄 REORDER CATEGORIES
=========================================================== */
export const reorderCategories = async (req, res) => {
  try {

    // Support both formats: [{_id, order}] OR { categories: [...] }
    const data = Array.isArray(req.body)
      ? req.body
      : req.body.categories;

    if (!Array.isArray(data))
      return res.status(400).json({ message: "Invalid data format. Expected an array of categories." });

    // Bulk update each category
    const updates = data.map(cat =>
      Category.findByIdAndUpdate(cat._id, { order: cat.order })
    );

    await Promise.all(updates);

    res.status(200).json({ message: "✅ Category order updated successfully" });
  } catch (error) {
    console.error("❌ Error reordering categories:", error);
    res.status(500).json({ message: "Failed to reorder categories" });
  }
};