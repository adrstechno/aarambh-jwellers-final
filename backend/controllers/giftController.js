import GiftCategory from "./models/GiftCategory.js";

// @desc Get all gift categories
export const getGiftCategories = async (req, res) => {
  try {
    const gifts = await GiftCategory.find().sort({ createdAt: -1 });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gift categories" });
  }
};
