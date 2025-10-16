import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123"; // fallback key

// Helper to generate JWT
const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: "Customer",
    });

    const token = generateToken({ id: newUser._id, role: "Customer" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: "Customer",
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Login Controller (with Hardcoded Admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🟢 Hardcoded Admin Login
    if (email === "admin@adrs.com" && password === "Admin@123") {
      const token = generateToken({
        id: "hardcoded-admin",
        role: "Admin",
        name: "ADRS Super Admin",
      });

      return res.status(200).json({
        message: "Admin logged in successfully",
        token,
        user: {
          _id: "hardcoded-admin",
          name: "ADRS Super Admin",
          email: "admin@adrs.com",
          role: "Admin",
          isAdmin: true,
        },
      });
    }

    // 🧠 Regular user login
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({
      id: user._id,
      role: user.role,
      name: user.name,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "Admin",
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
