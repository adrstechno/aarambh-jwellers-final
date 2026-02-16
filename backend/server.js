import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// ✅ Import Cloudinary config (initialize it once globally)
import "./config/cloudinary.js";

// ✅ Import routes
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import giftRoutes from "./routes/giftRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passwordResetRoutes from "./routes/passwordReset.js";


dotenv.config();
const app = express();

/* =======================================================
   🧩 Global Middlewares
======================================================= */

// ✅ Security & Performance Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "*.cloudinary.com"],
    },
  },
}));

// ✅ Compression Middleware
app.use(compression({ level: 6, threshold: 1000 }));

// ✅ CORS Configuration
// Support flexible allowed origins via ALLOWED_ORIGINS env (comma-separated).
// If ALLOWED_ORIGINS is set to '*' we allow all origins (useful for testing).
const defaultOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Merge defaults if ALLOWED_ORIGINS not provided
if (allowedOrigins.length === 0) {
  allowedOrigins.push(...defaultOrigins);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman and server-to-server
      // allow all when '*' explicitly set
      if (allowedOriginsEnv === "*") return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ JSON & URL parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Cookie Parser
app.use(cookieParser());

// 🚫 REMOVED: Local static uploads folder (no longer needed)
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================================================
   🚀 API Routes
======================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", passwordResetRoutes);

/* =======================================================
   ⚠️ Global Error Handler
======================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err?.stack || err);

  // capture useful info
  const statusCode = err.status || 500;
  const message =
    err?.message ||
    (typeof err === "string" ? err : "Internal Server Error");

  res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

/* =======================================================
   📦 MongoDB Connection
======================================================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* =======================================================
   🟢 Start Express Server
======================================================= */
const PORT = process.env.PORT || 5000;

// Start server after MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Atlas Connected");
    
    // Log connected DB name and collection counts
    try {
      const db = mongoose.connection.db;
      const dbName = mongoose.connection.name || "(unknown)";
      console.log(`🗄️ Connected to MongoDB database: ${dbName}`);

      const usersCount = await db.collection("users").countDocuments().catch(() => 0);
      const ordersCount = await db.collection("orders").countDocuments().catch(() => 0);
      const productsCount = await db.collection("products").countDocuments().catch(() => 0);

      console.log(`📊 Collections: users=${usersCount}, orders=${ordersCount}, products=${productsCount}`);
    } catch (err) {
      console.warn("⚠️ Could not read DB collection counts:", err.message);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Debug endpoint to inspect basic DB counts and app env (safe for short-term debugging)
app.get("/api/debug/status", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const users = await db.collection("users").countDocuments().catch(() => 0);
    const orders = await db.collection("orders").countDocuments().catch(() => 0);
    const products = await db.collection("products").countDocuments().catch(() => 0);
    const refunds = await db.collection("refunds").countDocuments().catch(() => 0);

    return res.json({
      success: true,
      dbName: mongoose.connection.name,
      counts: { users, orders, products, refunds },
      nodeEnv: process.env.NODE_ENV || "development",
      allowedOrigins: process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || null,
    });
  } catch (err) {
    console.error("❌ Debug status error:", err);
    return res.status(500).json({ success: false, message: "Failed to read debug status" });
  }
});

// ✅ Debug endpoint to check categories and products
app.get("/api/debug/categories-products", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all categories
    const categories = await db.collection("categories").find({}).toArray();
    
    // Get all products with their category IDs
    const products = await db.collection("products").find({}).toArray();
    
    // Group products by category
    const productsByCategory = {};
    products.forEach(product => {
      const catId = product.category?.toString();
      if (!productsByCategory[catId]) {
        productsByCategory[catId] = [];
      }
      productsByCategory[catId].push({
        name: product.name,
        status: product.status
      });
    });
    
    // Match categories with their products
    const result = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      productCount: productsByCategory[cat._id.toString()]?.length || 0,
      products: productsByCategory[cat._id.toString()] || []
    }));
    
    return res.json({
      success: true,
      categories: result,
      totalProducts: products.length
    });
  } catch (err) {
    console.error("❌ Debug categories-products error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
