import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

/* =======================================================
   🧠 Helper: Generate JWT
======================================================= */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* =======================================================
   🟢 Register User (email OR phone)
======================================================= */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 🧩 Validation: At least one identifier (email or phone)
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        message: "Name, password, and either email or phone are required",
      });
    }

    // 🧠 Check if user already exists (by email OR phone)
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or phone" });
    }

    // 🆕 Create new user
    const newUser = new User({
      name,
      email: email || "",
      phone: phone || "",
      password,
      role: "customer",
      status: "active",
    });

    await newUser.save();

    // 🔐 Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "✅ Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* =======================================================
   🔵 Login User (email OR phone)
======================================================= */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 🧩 Validation
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email/phone and password" });
    }

    // 🔍 Find user by email OR phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email/phone or password" });
    }

    // ✅ Validate password using schema method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email/phone or password" });
    }

    // 🚫 Blocked users can’t login
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account is blocked. Please contact support.",
      });
    }

    // 🕒 Update last login
    user.lastLogin = new Date();
    await user.save();

    // 🔐 Generate JWT
    const token = generateToken(user);

    res.json({
      message: "✅ Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* =======================================================
   🟠 Get Profile
======================================================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =======================================================
   🔴 Logout
======================================================= */
export const logout = async (req, res) => {
  try {
    res.json({ message: "✅ Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
