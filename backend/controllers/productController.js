import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js"; // ✅ new
import fs from "fs";
import path from "path";

// ✅ Helper to clean URLs
const fixImagePath = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.replace(/\\/g, "/");
  if (cleanPath.startsWith("http")) return cleanPath;
  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

/* ===========================================================
   🟢 ADD PRODUCT (with Cloudinary upload)
=========================================================== */
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

    let imageUrl = "";

    // ✅ Upload to Cloudinary if file exists
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      imageUrl = uploadResult.secure_url;

      // remove local temp file if exists
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

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
      image: imageUrl || "", // ✅ Cloudinary URL stored
    });

    await newProduct.save();

    const populated = await Product.findById(newProduct._id).populate("category", "name");
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

/* ===========================================================
   🟢 GET ALL PRODUCTS (admin)
=========================================================== */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

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

/* ===========================================================
   🟡 UPDATE PRODUCT (with Cloudinary support)
=========================================================== */
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

    // ✅ Upload new image if provided
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      updateData.image = uploadResult.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const oldProduct = await Product.findById(id);
    if (!oldProduct) return res.status(404).json({ message: "Product not found" });

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate("category", "name");

    updated.image = fixImagePath(updated.image);

    res.json({ message: "✅ Product updated successfully", product: updated });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

/* ===========================================================
   🗑️ DELETE PRODUCT
=========================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    // (Optional) delete from Cloudinary if needed
    // You can store Cloudinary public_id when uploading, and use:
    // await cloudinary.uploader.destroy(deleted.public_id);

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* ===========================================================
   🌐 PUBLIC ROUTES
=========================================================== */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Active" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

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

    product.image = fixImagePath(product.image);
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product by slug:", err);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) return res.status(200).json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "category.name": { $regex: query, $options: "i" } },
      ],
    })
      .populate("category", "name slug image")
      .limit(50);

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error searching products:", err);
    res.status(500).json({ message: "Failed to search products" });
  }
};
