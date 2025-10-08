// backend/controllers/userController.js
import User from "../models/user.js";
import Order from "../models/order.js";

// 🟢 Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🟡 Toggle admin <-> customer
export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "Admin" ? "Customer" : "Admin";
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: `User role changed to ${updatedUser.role}`,
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating role:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// 🔴 Toggle Active <-> Blocked
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Blocked" : "Active";
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${updatedUser.status}`,
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};


// 🟣 Fetch orders for specific user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};
