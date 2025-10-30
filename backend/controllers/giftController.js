import Gift from "../models/gift.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ==========================================================
   🟢 Create Gift (Upload image to Cloudinary)
========================================================== */
export const createGift = async (req, res) => {
  try {
    const { name, code, description, conditionType, conditionValue, stock, status } = req.body;

    if (!name || !code)
      return res.status(400).json({ message: "Name and code are required" });

    const existing = await Gift.findOne({ code: code.toUpperCase() });
    if (existing)
      return res.status(400).json({ message: "Gift code already exists" });

    let imageUrl = "";

    // ✅ Upload to Cloudinary if file provided
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers/gifts",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });

      imageUrl = uploadResult.secure_url;

      // remove temp file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const gift = await Gift.create({
      name,
      code: code.toUpperCase(),
      description,
      conditionType,
      conditionValue,
      stock,
      status,
      image: imageUrl,
    });

    res.status(201).json({ message: "✅ Gift created successfully", gift });
  } catch (error) {
    console.error("❌ Error creating gift:", error);
    res.status(500).json({ message: "Failed to create gift" });
  }
};

/* ==========================================================
   🟡 Get All Gifts
========================================================== */
export const getAllGifts = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};
    const gifts = await Gift.find(filter).sort({ createdAt: -1 });

    res.status(200).json(gifts);
  } catch (error) {
    console.error("❌ Error fetching gifts:", error);
    res.status(500).json({ message: "Failed to fetch gifts" });
  }
};

/* ==========================================================
   🟢 Get Gift by Code
========================================================== */
export const getGiftByCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "Gift code is required" });

    const gift = await Gift.findOne({ code: code.toUpperCase(), status: "Active" });
    if (!gift)
      return res.status(404).json({ message: "Gift not found or inactive" });

    res.status(200).json(gift);
  } catch (error) {
    console.error("❌ Error fetching gift by code:", error);
    res.status(500).json({ message: "Failed to fetch gift details" });
  }
};

/* ==========================================================
   🟠 Update Gift (with optional Cloudinary upload)
========================================================== */
export const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // ✅ Upload new image if provided
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "aarambh-jwellers/gifts",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });

      updateData.image = uploadResult.secure_url;

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const gift = await Gift.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!gift) return res.status(404).json({ message: "Gift not found" });

    res.status(200).json({ message: "✅ Gift updated successfully", gift });
  } catch (error) {
    console.error("❌ Error updating gift:", error);
    res.status(500).json({ message: "Failed to update gift" });
  }
};

/* ==========================================================
   🔴 Delete Gift
========================================================== */
export const deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    res.status(200).json({ message: "🗑️ Gift deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting gift:", error);
    res.status(500).json({ message: "Failed to delete gift" });
  }
};

/* ==========================================================
   🔁 Toggle Gift Status
========================================================== */
export const toggleGiftStatus = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    gift.status = gift.status === "Active" ? "Inactive" : "Active";
    await gift.save();

    res.status(200).json({ message: "✅ Status updated", gift });
  } catch (error) {
    console.error("❌ Error toggling status:", error);
    res.status(500).json({ message: "Failed to toggle status" });
  }
};
