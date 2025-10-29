import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";


const fixImagePath = (imagePath) => {
  if (!imagePath) return null;

  const cleanPath = imagePath.replace(/\\/g, "/"); // normalize slashes
  if (cleanPath.startsWith("http")) return cleanPath;

  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/")
    ? `${base}${cleanPath}`
    : `${base}/${cleanPath}`;
};


export const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status, material, description } = req.body;

    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    let slug = slugify(name, { lower: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    const newProduct = new Product({
      name: name.trim(),
      slug,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      status: status || "Active",
      material: material?.trim() || "",
      description: description?.trim() || "",
      image: imagePath,
    });

    await newProduct.save();

    const populated = await Product.findById(newProduct._id).populate("category", "name");

    // ✅ Fix image URL before sending
    populated.image = fixImagePath(populated.image);

    res.status(201).json({
      message: "✅ Product added successfully",
      product: populated,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Server error while adding product" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    // ✅ Fix image URLs
    const fixedProducts = products.map((p) => ({
      ...p._doc,
      image: fixImagePath(p.image),
    }));

    res.json(fixedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, category, price, stock, status, material, description } = req.body;

    try {
      if (typeof category === "string" && category.includes("{")) {
        const parsed = JSON.parse(category);
        category = parsed._id || category;
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
    if (material !== undefined) updateData.material = material.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (status) updateData.status = status;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const oldProduct = await Product.findById(id);
    if (!oldProduct) return res.status(404).json({ message: "Product not found" });

    // Delete old image if replaced
    if (req.file && oldProduct.image) {
      const oldPath = path.join(process.cwd(), oldProduct.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate("category", "name");

    // ✅ Fix image URL before sending
    updated.image = fixImagePath(updated.image);

    res.json({ message: "✅ Product updated successfully", product: updated });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    if (deleted.image) {
      const imgPath = path.join(process.cwd(), deleted.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

//public routes
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    // ✅ Fix all image paths
    const fixedProducts = products.map((p) => ({
      ...p._doc,
      image: fixImagePath(p.image),
    }));

    res.status(200).json(fixedProducts);
  } catch (error) {
    console.error("❌ Error fetching public products:", error);
    res.status(500).json({ message: "Failed to fetch public products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
    if (!foundCategory) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({
      category: foundCategory._id,
      status: "Active",
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    // ✅ Fix image paths
    const fixedProducts = products.map((p) => ({
      ...p._doc,
      image: fixImagePath(p.image),
    }));

    res.status(200).json(fixedProducts);
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Fix image URL
    product.image = fixImagePath(product.image);

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Fix image path
    product.image = fixImagePath(product.image);

    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product by slug:", err);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

// 🟢 Search Products by name, description, or category
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";

    if (!query) {
      return res.status(200).json([]); // No query → return empty list
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "category.name": { $regex: query, $options: "i" } },
      ],
    })
      .populate("category", "name slug image") // optional: populate category info
      .limit(50); // safety limit

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error searching products:", err);
    res.status(500).json({ message: "Failed to search products" });
  }
};
