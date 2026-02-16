import Banner from "../models/banner.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ===========================================================
   🟢 Get Active Banners (for Frontend) - OPTIMIZED
=========================================================== */
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true })
      .select("title subtitle image link order createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ order: 1 });

    // ✅ Set cache headers for banners
    res.set("Cache-Control", "public, max-age=3600"); // 1 hour
    res.status(200).json(banners);
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

/* ===========================================================
   🟡 Get All Banners (for Admin) - OPTIMIZED
=========================================================== */
export const getAllBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const banners = await Banner.find()
      .select("title subtitle image link order active createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Banner.countDocuments();

    // ✅ Set cache headers
    res.set("Cache-Control", "private, max-age=300");
    res.status(200).json({
      banners,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("❌ Error fetching all banners:", error);
    res.status(500).json({ message: "Failed to fetch all banners" });
  }
};

/* ===========================================================
   🟢 Create Banner (Uploads to Cloudinary)
=========================================================== */
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, order, active } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file?.path) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    // ✅ Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "aarambh-jwellers/banners",
      transformation: [{ width: 1920, height: 1080, crop: "limit" }],
    });

    // ✅ Remove temporary local file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const banner = new Banner({
      title,
      subtitle,
      image: uploadResult.secure_url, // ✅ Cloudinary URL
      link: link || "/",
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    await banner.save();
    res.status(201).json({
      message: "✅ Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({ message: "Failed to create banner" });
  }
};

/* ===========================================================
   🟡 Update Banner (with Cloudinary support)
=========================================================== */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link, order, active } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // ✅ Upload new image if provided
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers/banners",
        transformation: [{ width: 1920, height: 1080, crop: "limit" }],
      });

      banner.image = uploadResult.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
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
    res.status(200).json({
      message: "✅ Banner updated successfully",
      banner: updated,
    });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
};

/* ===========================================================
   🔴 Delete Banner
=========================================================== */
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // ❗ Optional: remove from Cloudinary if you stored public_id
    // const publicId = banner.image.split("/").pop().split(".")[0];
    // await cloudinary.uploader.destroy(`aarambh-jwellers/banners/${publicId}`);

    await Banner.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Banner deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting banner:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
};

/* ===========================================================
   🔁 Reorder Banners
=========================================================== */
export const reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body;

    if (!Array.isArray(banners) || banners.length === 0) {
      return res.status(400).json({ message: "Invalid banners data" });
    }

    const bulkOps = banners.map((b) => ({
      updateOne: {
        filter: { _id: b._id },
        update: { order: b.order },
      },
    }));

    await Banner.bulkWrite(bulkOps);
    res.status(200).json({ message: "✅ Banners reordered successfully" });
  } catch (error) {
    console.error("❌ Error reordering banners:", error);
    res.status(500).json({ message: "Failed to reorder banners" });
  }
};
