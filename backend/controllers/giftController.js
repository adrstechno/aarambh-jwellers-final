import Gift from "../models/gift.js";
// import path from "path";

export const createGift = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/gifts/${req.file.filename}` : null;
    const gift = await Gift.create({ ...req.body, image: imagePath });
    res.status(201).json({ message: "Gift created successfully", gift });
  } catch (err) {
    console.error("❌ Error creating gift:", err);
    res.status(500).json({ message: "Failed to create gift" });
  }
};

export const updateGift = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/gifts/${req.file.filename}` : undefined;
    const updateData = { ...req.body };
    if (imagePath) updateData.image = imagePath;

    const gift = await Gift.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!gift) return res.status(404).json({ message: "Gift not found" });
    res.status(200).json({ message: "Gift updated successfully", gift });
  } catch (err) {
    console.error("❌ Error updating gift:", err);
    res.status(500).json({ message: "Failed to update gift" });
  }
};
// ✅ Get all gifts
export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ createdAt: -1 });
    res.status(200).json(gifts);
  } catch (err) {
    console.error("❌ Error fetching gifts:", err);
    res.status(500).json({ message: "Failed to fetch gifts" });
  }
};

// ✅ Delete gift
export const deleteGift = async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gift deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting gift:", err);
    res.status(500).json({ message: "Failed to delete gift" });
  }
};

// ✅ Toggle Active/Inactive
export const toggleGiftStatus = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    gift.status = gift.status === "Active" ? "Inactive" : "Active";
    await gift.save();
    res.status(200).json({ message: "Status updated", gift });
  } catch (err) {
    console.error("❌ Error toggling gift status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
