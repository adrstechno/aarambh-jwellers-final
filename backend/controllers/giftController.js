import Gift from "../models/gift.js";

/* =====================================================
   🟢 Add Gift
===================================================== */
export const createGift = async (req, res) => {
  try {
    const { name, code, description, conditionType, conditionValue, stock, status } = req.body;

    if (!name || !code)
      return res.status(400).json({ message: "Name and code are required" });

    const existing = await Gift.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Gift code already exists" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const gift = await Gift.create({
      name,
      code: code.toUpperCase(),
      description,
      conditionType,
      conditionValue,
      stock,
      status,
      image: imagePath,
    });

    res.status(201).json({ message: "✅ Gift created successfully", gift });
  } catch (error) {
    console.error("❌ Error creating gift:", error);
    res.status(500).json({ message: "Failed to create gift" });
  }
};

/* =====================================================
   🟡 Get All Gifts
===================================================== */
export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ createdAt: -1 });
    res.status(200).json(gifts);
  } catch (error) {
    console.error("❌ Error fetching gifts:", error);
    res.status(500).json({ message: "Failed to fetch gifts" });
  }
};

/* =====================================================
   🟠 Update Gift
===================================================== */
export const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = { ...req.body };
    if (imagePath) updateData.image = imagePath;

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

/* =====================================================
   🔴 Delete Gift
===================================================== */
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

/* =====================================================
   🔁 Toggle Status
===================================================== */
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
