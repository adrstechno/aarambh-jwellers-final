import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123"; // fallback key for dev

// Helper: Generate JWT Token
const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });


// 🟢 Register User
export const register = async (req, res) => {
  try {
    console.log("📩 REGISTER BODY:", req.body);
    const { name, email, password, phone } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 🧠 Ensure password is string before hashing
    if (typeof password !== "string") {
      return res.status(400).json({ message: "Invalid password type" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 🔵 Login User
export const login = async (req, res) => {
  try {
      console.log("📩 LOGIN BODY:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "Admin",
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};