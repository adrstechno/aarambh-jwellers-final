import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, trim: true },
    conditionType: {
      type: String,
      enum: ["None", "Amount", "Product", "Category"],
      default: "None",
    },
    conditionValue: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    image: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Gift", giftSchema);
