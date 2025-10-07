import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";

// 🟢 Add new product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status } = req.body;

    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // ✅ Generate a unique slug
    let slug = slugify(name, { lower: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = new Product({
      name: name.trim(),
      slug,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      status: status || "Active",
      image: imagePath,
    });

    await newProduct.save();
    const populatedProduct = await Product.findById(newProduct._id).populate(
      "category",
      "name"
    );

    res.status(201).json({
      message: "✅ Product added successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Server error while adding product" });
  }
};

// 🟡 Get all products (Admin)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// 🟠 Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, category, price, stock, status } = req.body;

    try {
      if (typeof category === "string") {
        if (category.includes("{")) {
          const parsed = JSON.parse(category);
          category = parsed._id || category;
        }
      } else if (typeof category === "object" && category?._id) {
        category = category._id;
      }
    } catch (err) {
      console.warn("⚠️ Could not parse category:", category);
    }

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name, { lower: true });
    }
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (status) updateData.status = status;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "✅ Product updated successfully", product: updated });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// 🔴 Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* ==========================================================
   🌐 FRONTEND WEBSITE ROUTES (Do NOT affect Admin APIs)
   ========================================================== */

// 🟢 Public: Get all active products for frontend
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching public products:", error);
    res.status(500).json({ message: "Failed to fetch public products" });
  }
};

// 🟣 Public: Get products by category (for FeaturedProducts.jsx)
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const products = await Product.find({
      "category.name": { $regex: new RegExp(category, "i") },
      status: "Active",
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

// 🔵 Public: Get product details by ID (for ProductDetail.jsx)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};
