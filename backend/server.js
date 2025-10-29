import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

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
import jewellerySectionRoutes from "./routes/jewellerySectionRoutes.js";

dotenv.config();
const app = express();

/* =======================================================
   🧩 Global Middlewares
======================================================= */

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // your Vite frontend
    credentials: true, // allows sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ JSON & URL parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cookie Parser (for token auth)
app.use(cookieParser());

// ✅ Static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.use("/api/jewellery-section", jewellerySectionRoutes);

/* =======================================================
   ⚠️ Global Error Handler
======================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================================================
   📦 MongoDB Connection
======================================================= */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10s timeout
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* =======================================================
   🟢 Start Express Server
======================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
