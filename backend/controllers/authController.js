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
    let { name, email, phone, password } = req.body;

    // 🧩 Basic validation
    if (!name || !password || (!email && !phone)) {
      return res
        .status(400)
        .json({ message: "Name, password, and either email or phone are required." });
    }

    // 🧼 Clean up empty strings or undefined values
    if (email === "" || email === undefined || email === null) email = undefined;
    if (phone === "" || phone === undefined || phone === null) phone = undefined;

    // 🧠 Check if user already exists (by email or phone)
    const existingUser = await User.findOne({
      $or: [{ email: email || null }, { phone: phone || null }],
    });

    if (existingUser) {
      let field = existingUser.email === email ? "email" : "phone number";
      return res.status(400).json({ message: `User with this ${field} already exists.` });
    }

    // 🆕 Create user object (exclude undefined fields)
    const newUserData = {
      name,
      password,
      role: "customer",
      status: "active",
    };

    if (email) newUserData.email = email.toLowerCase();
    if (phone) newUserData.phone = phone;

    const newUser = new User(newUserData);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "✅ Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email || "",
        phone: newUser.phone || "",
        role: newUser.role,
        status: newUser.status,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);

    // 🧩 Handle duplicate key errors clearly
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const prettyField = duplicateField === "phone" ? "Phone number" : "Email";
      return res.status(400).json({ message: `${prettyField} is already registered.` });
    }

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

    // 🧠 Normalize identifier safely
    const trimmed = identifier.trim();
    const normalizedEmail = trimmed.includes("@") ? trimmed.toLowerCase() : null;
    const normalizedPhone = !trimmed.includes("@") ? trimmed : null;

    // 🔍 Find user by email OR phone
    const user = await User.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
    }

    // ✅ Validate password using schema method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/phone or password" });
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
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "✅ Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
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
