import Banner from "../models/banner.js";
import fs from "fs";
import path from "path";

/* =========================================================
   🟢 Public: Get Active Banners (Homepage Carousel)
========================================================= */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

/* =========================================================
   🟡 Admin: Get All Banners (with sorting)
========================================================= */
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching all banners:", error);
    res.status(500).json({ message: "Failed to fetch all banners" });
  }
};

/* =========================================================
   🟠 Admin: Create Banner
========================================================= */
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, order, active } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    if (!imagePath) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const banner = new Banner({
      title,
      subtitle,
      image: imagePath,
      link: link || "/",
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    await banner.save();
    res.status(201).json({ message: "✅ Banner created successfully", banner });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({ message: "Failed to create banner" });
  }
};

/* =========================================================
   🔵 Admin: Update Banner
========================================================= */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link, order, active } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Replace image if uploaded
    if (req.file) {
      const oldImagePath = path.join(process.cwd(), banner.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      banner.image = `/uploads/${req.file.filename}`;
    }

    banner.title = title || banner.title;
    banner.subtitle = subtitle || banner.subtitle;
    banner.link = link || banner.link;
    banner.order = order !== undefined ? order : banner.order;
    banner.active =
      active !== undefined
        ? active === "true" || active === true
        : banner.active;

    const updated = await banner.save();
    res.status(200).json({ message: "✅ Banner updated successfully", banner: updated });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
};

/* =========================================================
   🔴 Admin: Delete Banner
========================================================= */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete associated image
    if (banner.image) {
      const imagePath = path.join(process.cwd(), banner.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Banner.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Banner deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting banner:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
};

/* =========================================================
   ⚪ Admin: Reorder Banners (Optional)
========================================================= */
// 🟡 Reorder Banners
export const reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body;

    if (!Array.isArray(banners) || banners.length === 0) {
      return res.status(400).json({ message: "Invalid banners data" });
    }

    // Bulk update all banners with new order
    const bulkOps = banners.map((b) => ({
      updateOne: {
        filter: { _id: b._id },
        update: { order: b.order },
      },
    }));

    await import("../models/banner.js").then(({ default: Banner }) =>
      Banner.bulkWrite(bulkOps)
    );

    res.status(200).json({ message: "✅ Banners reordered successfully" });
  } catch (error) {
    console.error("❌ Error reordering banners:", error);
    res.status(500).json({ message: "Failed to reorder banners" });
  }
};


