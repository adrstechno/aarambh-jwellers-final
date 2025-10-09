import Review from "../models/review.js";

// ✅ Get all reviews (Admin)
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

// 🟡 Update review status (approve/reject)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Status updated", review });
  } catch (err) {
    console.error("❌ Error updating review status:", err);
    res.status(500).json({ message: "Failed to update review status" });
  }
};

// 🔴 Delete review
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

// ✅ Get paginated reviews
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

// ✅ Get top-rated products (average rating)
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
      { $limit: 5 },
    ]);

    const populated = await Review.populate(topRated, {
      path: "_id",
      select: "name",
      model: "Product",
    });

    res.status(200).json(populated);
  } catch (err) {
    console.error("❌ Error fetching top-rated products:", err);
    res.status(500).json({ message: "Failed to fetch rating summary" });
  }
};

// 🟢 Get all reviews for a specific product
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

// ✅ Create a review
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment, userId } = req.body;

    if (!product || !rating || !comment)
      return res.status(400).json({ message: "Missing fields" });

    const review = await Review.create({
      product,
      rating,
      comment,
      user: userId, // userId should come from frontend (or JWT)
      status: "Pending",
    });

    // Optionally update product average rating
    const reviews = await Review.find({ product, status: "Approved" });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Product.findByIdAndUpdate(product, { avgRating });

    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};