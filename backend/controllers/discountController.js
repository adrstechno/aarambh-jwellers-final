import Discount from "./models/Discount.js";

// @desc Get all active discounts
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({ active: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch discounts" });
  }
};

// @desc Get single discount by ID
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch discount" });
  }
};

// @desc Create new discount (Admin)
export const createDiscount = async (req, res) => {
  try {
    const { title, description, discountPercent, category, bannerImage, active, validFrom, validTo } = req.body;

    const discount = await Discount.create({
      title,
      description,
      discountPercent,
      category,
      bannerImage,
      active,
      validFrom,
      validTo,
    });

    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ message: "Failed to create discount" });
  }
};

// @desc Update discount
export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Failed to update discount" });
  }
};

// @desc Delete discount
export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json({ message: "Discount deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete discount" });
  }
};
