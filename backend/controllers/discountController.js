import Discount from "../models/discount.js";

// ✅ Create new discount
export const createDiscount = async (req, res) => {
  try {
    const existing = await Discount.findOne({ code: req.body.code });
    if (existing)
      return res.status(400).json({ message: "Discount code already exists" });

    const discount = await Discount.create(req.body);
    res.status(201).json({ message: "Discount created successfully", discount });
  } catch (err) {
    console.error("❌ Error creating discount:", err);
    res.status(500).json({ message: "Failed to create discount" });
  }
};

// ✅ Get all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (err) {
    console.error("❌ Error fetching discounts:", err);
    res.status(500).json({ message: "Failed to fetch discounts" });
  }
};

// ✅ Update discount
export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });
    res.status(200).json({ message: "Discount updated", discount });
  } catch (err) {
    console.error("❌ Error updating discount:", err);
    res.status(500).json({ message: "Failed to update discount" });
  }
};

// ✅ Delete discount
export const deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting discount:", err);
    res.status(500).json({ message: "Failed to delete discount" });
  }
};

// ✅ Toggle status (Active <-> Inactive)
export const toggleDiscountStatus = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount)
      return res.status(404).json({ message: "Discount not found" });

    discount.status = discount.status === "Active" ? "Inactive" : "Active";
    await discount.save();

    res.status(200).json({ message: "Status updated", discount });
  } catch (err) {
    console.error("❌ Error toggling status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
