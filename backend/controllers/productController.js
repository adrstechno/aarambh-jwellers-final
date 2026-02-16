import Product from "../models/product.js";
import Category from "../models/category.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ===========================================================
   🧩 Helper: Fix image URLs
=========================================================== */
const fixImagePath = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.replace(/\\/g, "/");
  if (cleanPath.startsWith("http")) return cleanPath;
  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

/* ===========================================================
   🟢 ADD PRODUCT (Multiple Images + Materials)
=========================================================== */
export const addProduct = async (req, res) => {
  console.log("\n\n===================== 🟢 ADD PRODUCT REQUEST =====================");
  try {
    console.log("🧾 req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    const { name, category, price, stock, status, materials, description } = req.body;

    // 🧱 Validation
    if (!name || !category || !price || stock === undefined) {
      console.warn("⚠️ Missing required fields.");
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ Validate Category
    console.log("🔍 Checking category...");
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.error("❌ Invalid category ID:", category);
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // ✅ Parse materials JSON (if stringified)
    console.log("🧪 Parsing materials...");
    let materialArray = [];
    if (materials) {
      try {
        materialArray =
          typeof materials === "string" ? JSON.parse(materials) : materials;
        console.log("✅ Parsed materials:", materialArray);
      } catch (e) {
        console.error("❌ Material JSON parse failed:", e.message);
        return res.status(400).json({ message: "Invalid materials JSON format" });
      }
    }

    // ✅ Upload multiple images
    console.log("📤 Uploading images to Cloudinary...");
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: "aarambh-jwellers/products",
            transformation: [{ width: 800, height: 800, crop: "limit" }],
          });
          imageUrls.push(upload.secure_url);
          console.log("✅ Uploaded:", upload.secure_url);
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (err) {
          console.error("❌ Cloudinary upload failed:", err.message);
        }
      }
    } else {
      console.warn("⚠️ No image files received.");
    }

    // ✅ Generate slug safely
    let slug = slugify(name, { lower: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    console.log("🧱 Creating product in database...");
    const newProduct = new Product({
      name: name.trim(),
      slug,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      status: status || "Active",
      materials: materialArray,
      images: imageUrls,
      image: imageUrls[0] || "",
      description: description?.trim() || "",
    });

    await newProduct.save();
    console.log("✅ Product saved successfully:", newProduct._id);

    const populated = await Product.findById(newProduct._id).populate("category", "name");

    console.log("✅ Product creation complete");
    res.status(201).json({
      message: "✅ Product added successfully",
      product: populated,
    });
  } catch (error) {
    console.error("❌ ADD PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Server error while adding product",
      error: error.message,
      stack: error.stack,
    });
  }
};
/* ===========================================================
   🟡 UPDATE PRODUCT (Multiple Images + Materials)
=========================================================== */

export const updateProduct = async (req, res) => {
  console.log("\n\n===================== 🟡 UPDATE PRODUCT REQUEST =====================");
  try {
    console.log("🧾 req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    const { id } = req.params;
    let { name, category, price, stock, status, materials, description } = req.body;

    // ✅ Ensure product exists
    const product = await Product.findById(id);
    if (!product) {
      console.error("❌ Product not found with ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Parse category safely
    try {
      if (typeof category === "string" && category.includes("{")) {
        const parsed = JSON.parse(category);
        category = parsed._id || category;
      } else if (typeof category === "object" && category?._id) {
        category = category._id;
      }
    } catch (err) {
      console.warn("⚠️ Could not parse category JSON:", category);
    }

    // ✅ Parse materials
    console.log("🧪 Parsing materials...");
    let materialArray = [];
    if (materials) {
      try {
        materialArray =
          typeof materials === "string" ? JSON.parse(materials) : materials;
        console.log("✅ Parsed materials:", materialArray);
      } catch (e) {
        console.error("❌ Invalid materials JSON during update:", e.message);
      }
    }

    // ✅ Build update data
    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name, { lower: true });
    }
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (status) updateData.status = status;
    if (materialArray.length > 0) updateData.materials = materialArray;

    // ✅ Upload new images if provided
    if (req.files && req.files.length > 0) {
      console.log("📤 Uploading new images to Cloudinary...");
      const newImages = [];
      for (const file of req.files) {
        try {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: "aarambh-jwellers/products",
            transformation: [{ width: 800, height: 800, crop: "limit" }],
          });
          newImages.push(upload.secure_url);
          console.log("✅ Uploaded new image:", upload.secure_url);
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } catch (err) {
          console.error("❌ Cloudinary upload failed during update:", err.message);
        }
      }

      updateData.images = [...(product.images || []), ...newImages];
      updateData.image = updateData.images[0] || "";
    } else {
      console.log("ℹ️ No new images uploaded, keeping existing ones.");
    }

    console.log("🧱 Updating product in database...");
    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "category",
      "name"
    );

    console.log("✅ Product updated successfully:", updated._id);

    res.json({
      message: "✅ Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Server error while updating product",
      error: error.message,
      stack: error.stack,
    });
  }
};

/* ===========================================================
   🟢 GET ALL PRODUCTS (Admin)
=========================================================== */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const fixedProducts = products.map((p) => ({
      ...p._doc,
      image: fixImagePath(p.image),
      images: p.images?.map((img) => fixImagePath(img)) || [],
    }));

    res.json(fixedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ===========================================================
   🗑️ DELETE PRODUCT
=========================================================== */
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

/* ===========================================================
   🌐 PUBLIC ROUTES (Frontend) - OPTIMIZED
=========================================================== */
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ✅ Use lean() for read-only queries - faster than full documents
    const products = await Product.find({ status: "Active" })
      .populate("category", "name")
      .select("name slug price image images category stock status createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ status: "Active" });

    const fixedProducts = products.map((p) => ({
      ...p,
      image: fixImagePath(p.image),
      images: p.images?.map((img) => fixImagePath(img)) || [],
    }));

    res.status(200).json({
      products: fixedProducts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching public products:", error);
    res.status(500).json({ message: "Failed to fetch public products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const foundCategory = await Category.findOne({ slug: category.toLowerCase() }).lean();
    if (!foundCategory)
      return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({
      category: foundCategory._id,
      status: "Active",
    })
      .select("name slug price image images category stock status createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      category: foundCategory._id,
      status: "Active",
    });

    const fixedProducts = products.map((p) => ({
      ...p,
      image: fixImagePath(p.image),
      images: p.images?.map((img) => fixImagePath(img)) || [],
    }));

    res.status(200).json({
      products: fixedProducts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images = product.images?.map((img) => fixImagePath(img)) || [];
    product.image = fixImagePath(product.image);

    // ✅ Set cache headers for client-side caching
    res.set("Cache-Control", "public, max-age=3600"); // 1 hour
    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images = product.images?.map((img) => fixImagePath(img)) || [];
    product.image = fixImagePath(product.image);

    // ✅ Set cache headers
    res.set("Cache-Control", "public, max-age=3600");
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

    const limit = 50;
    
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      status: "Active",
    })
      .select("name slug price image images category stock status")
      .lean() // ⚡ Performance optimization
      .limit(limit);

    const fixedProducts = products.map((p) => ({
      ...p,
      image: fixImagePath(p.image),
      images: p.images?.map((img) => fixImagePath(img)) || [],
    }));

    res.status(200).json(fixedProducts);
  } catch (err) {
    console.error("❌ Error searching products:", err);
    res.status(500).json({ message: "Failed to search products" });
  }
};
