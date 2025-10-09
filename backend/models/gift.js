import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, unique: true, uppercase: true, trim: true },
    description: { type: String },
    conditionType: {
      type: String,
      enum: ["Amount", "Product", "Category", "None"],
      default: "None",
    },
    conditionValue: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Gift", giftSchema);
