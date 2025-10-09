import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    reason: { type: String, required: true },
    refundMethod: {
      type: String,
      enum: ["Bank Transfer", "Wallet", "Replacement"],
      default: "Bank Transfer",
    },
    refundAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Refunded"],
      default: "Pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Refund", refundSchema);
