import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // ⚙️ speeds up queries like getReviewsByProduct
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ⚙️ useful for user review lookup
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// 🧠 Prevent multiple reviews per user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// 🧩 Optional Virtual: Useful for future — count approved reviews per product
reviewSchema.virtual("isApproved").get(function () {
  return this.status === "Approved";
});

// Include virtuals in JSON output
reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

export default mongoose.model("Review", reviewSchema);
