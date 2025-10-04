import jwt from "jsonwebtoken";
import User from "./models/User.js";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Logout user
export const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
