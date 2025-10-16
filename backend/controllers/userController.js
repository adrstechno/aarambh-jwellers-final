import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Order from "../models/order.js";

/* ======================================
   👑 ADMIN CONTROLLERS
====================================== */

// 🟢 Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🟡 Toggle Admin ↔ Customer Role
export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "Admin" ? "Customer" : "Admin";
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: `User role changed to ${updatedUser.role}`,
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// 🔴 Toggle Active ↔ Blocked Status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Blocked" : "Active";
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${updatedUser.status}`,
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// 🟣 Fetch orders for specific user (Admin)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

// ✅ Promote user to Admin
export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Admin";
    await user.save();

    res.status(200).json({ message: `${user.name} is now an admin`, user });
  } catch (err) {
    console.error("❌ Error promoting to admin:", err);
    res.status(500).json({ message: "Failed to promote user to admin" });
  }
};

// 🚫 Revoke admin privileges
export const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Customer";
    await user.save();

    res.status(200).json({ message: `${user.name} is no longer an admin`, user });
  } catch (err) {
    console.error("❌ Error revoking admin:", err);
    res.status(500).json({ message: "Failed to revoke admin privileges" });
  }
};

/* ======================================
   👤 USER CONTROLLERS
====================================== */

// 🟢 Get profile (logged-in user)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 🟡 Update user profile (name, phone, address)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// 🔑 Update user password
export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};
