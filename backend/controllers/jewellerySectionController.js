import JewellerySection from "../models/jewellerySection.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ======================================================
   🟢 Public: Get Jewellery Section
====================================================== */
export const getJewellerySection = async (req, res) => {
  try {
    const section = await JewellerySection.findOne().sort({ createdAt: -1 });

    if (!section) {
      // Return defaults if no section exists
      return res.status(200).json({
        title: "",
        subtitle: "",
        tagline: "",
        description: "",
        button1Text: "Shop Now",
        button1Link: "/products",
        button2Text: "View More",
        button2Link: "/about",
        mainImage: "",
        modelImage: "",
        status: "Active",
      });
    }

    res.status(200).json(section);
  } catch (err) {
    console.error("❌ Error fetching jewellery section:", err);
    res.status(500).json({ message: "Failed to fetch section" });
  }
};

/* ======================================================
   🟡 Admin: Create/Update (Upsert) Jewellery Section
====================================================== */
export const upsertJewellerySection = async (req, res) => {
  try {
    const data = req.body;
    const imageUrls = {};

    // ✅ Upload images to Cloudinary if provided
    if (req.files?.mainImage?.[0]) {
      const uploadMain = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
        folder: "aarambh-jwellers/jewellery-section",
        transformation: [{ width: 1200, height: 800, crop: "limit" }],
      });
      imageUrls.mainImage = uploadMain.secure_url;
      if (fs.existsSync(req.files.mainImage[0].path))
        fs.unlinkSync(req.files.mainImage[0].path);
    }

    if (req.files?.modelImage?.[0]) {
      const uploadModel = await cloudinary.uploader.upload(req.files.modelImage[0].path, {
        folder: "aarambh-jwellers/jewellery-section",
        transformation: [{ width: 1200, height: 800, crop: "limit" }],
      });
      imageUrls.modelImage = uploadModel.secure_url;
      if (fs.existsSync(req.files.modelImage[0].path))
        fs.unlinkSync(req.files.modelImage[0].path);
    }

    // ✅ Update or create new section
    const updated = await JewellerySection.findOneAndUpdate(
      {},
      { ...data, ...imageUrls },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "✅ Jewellery section updated successfully",
      section: updated,
    });
  } catch (err) {
    console.error("❌ Error saving section:", err);
    res.status(500).json({ message: "Failed to save section" });
  }
};
