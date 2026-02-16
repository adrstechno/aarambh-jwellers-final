import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["Percentage", "Flat"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
