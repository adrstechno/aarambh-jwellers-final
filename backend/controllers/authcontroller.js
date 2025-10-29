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
   🟢 Register User
======================================================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 🧩 Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // 🧠 Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 🆕 Create user (auto-hash & normalize via model middleware)
    const newUser = new User({
      name,
      email,
      password,
      phone,
      role: "customer",
      status: "active",
    });

    await newUser.save();

    const token = generateToken(newUser);

    // ✅ Return sanitized user object
    res.status(201).json({
      message: "✅ Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
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
   🔵 Login User
======================================================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🧩 Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Validate password using model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // 🚫 Blocked users cannot login
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked. Please contact support." });
    }

    // 🕒 Update last login
    user.lastLogin = new Date();
    await user.save();

    // 🔐 Generate token
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
    // Optional cookie removal if used
    // res.clearCookie("token");
    res.json({ message: "✅ Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
