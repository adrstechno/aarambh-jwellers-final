import Review from "../models/review.js";
import Product from "../models/product.js";


// ✅ Get all reviews - OPTIMIZED with lean()
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name slug")
      .select("rating comment status createdAt user product")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments();

    // ✅ Set cache headers for review list
    res.set("Cache-Control", "private, max-age=300"); // 5 minutes
    res.status(200).json({
      reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      }
    });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ✅ Get reviews by product - OPTIMIZED
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId, status: "Approved" })
      .populate("user", "name")
      .select("rating comment user createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId, status: "Approved" });

    res.set("Cache-Control", "private, max-age=600"); // 10 minutes
    res.status(200).json({
      reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error("❌ Error fetching product reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ✅ Update review status - OPTIMIZED
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

// ✅ Delete review
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

// ✅ Get paginated reviews - OPTIMIZED with lean()
export const getPaginatedReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .select("rating comment status createdAt user product")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.set("Cache-Control", "private, max-age=300");
    res.status(200).json({
      reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      }
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

// ✅ Create review
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
