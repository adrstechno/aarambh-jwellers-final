import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: true, // you can set this to false if admin approval is needed
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
