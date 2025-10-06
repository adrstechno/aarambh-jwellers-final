import User from "../models/user.js";

// 🟢 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// 🟡 Toggle user role (Admin ↔ Customer)
export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "Admin" ? "Customer" : "Admin";
    user.status = "Active"; // Ensure user is active when role changes
    const updatedUser = await user.save();

    res.status(200).json({ message: "User role updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

// 🔴 Toggle user status (Active ↔ Blocked)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Blocked" : "Active";
    const updatedUser = await user.save();

    res.status(200).json({ message: "User status updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

// 🟢 Create a new user (for testing or admin panel)
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, status } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create and save new user
    const newUser = new User({
      name,
      email,
      phone,
      password, // 🔒 (Plain for testing — ideally hash in production)
      role: role || "Customer",
      status: status || "Active",
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};
