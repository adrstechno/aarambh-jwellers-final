import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

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
import jewellerySectionRoutes from "./routes/jewellerySectionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

/* =======================================================
   🧩 Global Middlewares
======================================================= */

// ✅ CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, // ✅ from Render environment variable
  "http://localhost:5173",  // ✅ for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ JSON & URL parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/jewellery-section", jewellerySectionRoutes);
app.use("/api/admin", adminRoutes);
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
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
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
