import Review from "../models/review.js";
import Product from "../models/product.js";


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name slug")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("product", "name");

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Status updated successfully", review });
  } catch (err) {
    console.error("❌ Error updating review status:", err);
    res.status(500).json({ message: "Failed to update review status" });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};


export const getPaginatedReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Error fetching paginated reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


export const getTopRatedProducts = async (req, res) => {
  try {
    const topRated = await Review.aggregate([
      { $match: { status: "Approved" } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 6 },
    ]);

    const populated = await Product.populate(topRated, {
      path: "_id",
      select: "name",
    });

    res.status(200).json(populated);
  } catch (err) {
    console.error("❌ Error fetching top-rated products:", err);
    res.status(500).json({ message: "Failed to fetch rating summary" });
  }
};


export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, status: "Approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching product reviews:", err);
    res.status(500).json({ message: "Failed to fetch product reviews" });
  }
};


export const createReview = async (req, res) => {
  try {
    const { product, rating, comment, userId } = req.body;

    if (!product || !rating)
      return res.status(400).json({ message: "Missing fields" });

    // Prevent duplicate review by same user
    const existing = await Review.findOne({ product, user: userId });
    if (existing)
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });

    const review = await Review.create({
      product,
      rating,
      comment: comment?.trim() || "",
      user: userId,
      status: "Pending",
    });

    // Recalculate average rating
    const approvedReviews = await Review.find({ product, status: "Approved" });
    const avgRating = approvedReviews.length
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedReviews.length
      : 0;

    await Product.findByIdAndUpdate(product, { avgRating });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};
