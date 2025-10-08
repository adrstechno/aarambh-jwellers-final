import Review from "../models/review.js";
import Product from "../models/product.js";

// 🟢 Add new review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // from auth middleware

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview)
      return res.status(400).json({ message: "You have already reviewed this product." });

    const review = await Review.create({ product: productId, user: userId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

// 🟣 Get reviews for a product
export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// 🔴 Delete a review (Admin)
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review" });
  }
};

// 🟠 Get average rating for a product
export const getAverageRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$product", averageRating: { $avg: "$rating" } } },
    ]);
    const avg = result[0]?.averageRating || 0;
    res.json({ averageRating: avg.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: "Error calculating rating" });
  }
};
