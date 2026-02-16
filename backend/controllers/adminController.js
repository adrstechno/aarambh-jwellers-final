import User from "../models/user.js"; // ✅ same name as your actual file
import bcrypt from "bcryptjs";

/* ======================================================
   🟢 Get Admin Profile
====================================================== */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("❌ Error fetching admin profile:", err);
    res.status(500).json({ message: "Server error fetching admin profile" });
  }
};

/* ======================================================
   🟠 Update Admin Profile
====================================================== */
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const admin = await User.findById(req.user._id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.name = name.trim();
    if (phone) admin.phone = phone.trim();
    if (password) admin.password = await bcrypt.hash(password, 10);

    if (req.file) {
      admin.profileImage = req.file.path.startsWith("http")
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    await admin.save();
    const updated = await User.findById(admin._id).select("-password");

    res.json({
      message: "✅ Admin profile updated successfully",
      admin: updated,
    });
  } catch (err) {
    console.error("❌ Error updating admin profile:", err);
    res.status(500).json({ message: "Server error updating admin profile" });
  }
};
