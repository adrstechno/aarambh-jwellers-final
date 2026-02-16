import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.ADMIN_NAME || "Administrator";

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("ℹ️ Admin user already exists:", existingAdmin.email || existingAdmin.phone);
      process.exit(0);
    }

    // Create admin user
    const newAdmin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      status: "active",
    });

    await newAdmin.save();
    console.log("✅ Admin user created:", adminEmail, "with password:", adminPassword);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    process.exit(1);
  }
};

run();
