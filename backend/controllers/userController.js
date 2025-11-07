import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Order from "../models/order.js";

/* =======================================================
   👑 ADMIN CONTROLLERS
======================================================= */

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

    // ✅ Toggle role safely with lowercase
    const currentRole = user.role?.toLowerCase();
    user.role = currentRole === "admin" ? "customer" : "admin";

    await user.save();

    res.status(200).json({
      message:
        user.role === "admin"
          ? `${user.name} promoted to Admin`
          : `${user.name} demoted to Customer`,
      updatedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
      },
    });
  } catch (error) {
    console.error("❌ Error toggling user role:", error);
    res.status(500).json({ message: "Failed to toggle user role" });
  }
};


// 🔴 Toggle Active ↔ Blocked Status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Toggle between active <-> blocked (case-insensitive)
    const currentStatus = user.status?.toLowerCase();
    user.status = currentStatus === "active" ? "blocked" : "active";

    await user.save();

    res.status(200).json({
      success: true,
      message:
        user.status === "active"
          ? `${user.name} has been unblocked`
          : `${user.name} has been blocked`,
      updatedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
      },
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

/* =======================================================
   👤 USER CONTROLLERS (With JWT Auth)
======================================================= */

// 🟢 Get logged-in user profile (Protected)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ message: "Failed to get user profile" });
  }
};

// ✏️ Update profile (Protected)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { name, phone = "", email = "", password, address } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔎 Validate email/phone updates
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Either email or phone number must be provided." });
    }

    // 🔍 Check if updated email/phone already exists (exclude current user)
    if (email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (emailExists)
        return res.status(400).json({ message: "Email is already in use." });
    }

    if (phone) {
      const phoneExists = await User.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (phoneExists)
        return res.status(400).json({ message: "Phone number is already in use." });
    }

    // ✅ Apply updates
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email.toLowerCase();
    if (address) user.address = address;

    // 🔒 If password is being changed here (rare)
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({
      message: "✅ Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);

    // Mongo duplicate fallback (should rarely hit due to pre-check)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res
        .status(400)
        .json({ message: `This ${duplicateField} is already in use.` });
    }

    res.status(500).json({ message: "Failed to update profile" });
  }
};
// 🔒 Change password (Protected)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    // ✅ Let the schema handle hashing
    user.password = newPassword;
    await user.save();

    res.json({ message: "✅ Password updated successfully" });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};